"""
Админка каталога Аккумофф: создание, обновление, удаление товаров и загрузка фото.
Роутинг через query-параметры: ?action=upload-image, ?id=X
"""
import json
import os
import base64
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor
import boto3


ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "akkumoff-admin-2026")


def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


def check_auth(event: dict) -> bool:
    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token") or ""
    return token == ADMIN_TOKEN


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if not check_auth(event):
        return {
            "statusCode": 401,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Unauthorized"}),
        }

    method = event.get("httpMethod")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    product_id = params.get("id", "")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # Загрузка фото: POST ?action=upload-image
        if method == "POST" and action == "upload-image":
            image_b64 = body.get("image")
            filename = body.get("filename", "photo.jpg")
            content_type = body.get("content_type", "image/jpeg")

            if not image_b64:
                cur.close(); conn.close()
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "No image provided"})}

            image_data = base64.b64decode(image_b64)
            key = f"products/{uuid.uuid4()}_{filename}"
            s3 = get_s3()
            s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=content_type)
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

            cur.close(); conn.close()
            return {
                "statusCode": 200,
                "headers": {**cors, "Content-Type": "application/json"},
                "body": json.dumps({"url": cdn_url}),
            }

        # Создать товар: POST (без id)
        if method == "POST":
            cur.execute(
                """INSERT INTO products (name, category, subcategory, voltage, capacity, price_from, price_to, description, condition, image_url, in_stock)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (
                    body.get("name"), body.get("category"), body.get("subcategory"),
                    body.get("voltage"), body.get("capacity"),
                    body.get("price_from"), body.get("price_to"),
                    body.get("description"), body.get("condition", "new"),
                    body.get("image_url"), body.get("in_stock", True),
                ),
            )
            product = dict(cur.fetchone())
            conn.commit(); cur.close(); conn.close()
            return {
                "statusCode": 201,
                "headers": {**cors, "Content-Type": "application/json"},
                "body": json.dumps({"product": product}, default=str),
            }

        # Обновить товар: PUT ?id=X
        if method == "PUT":
            if not product_id:
                cur.close(); conn.close()
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "No product id"})}

            cur.execute(
                """UPDATE products SET name=%s, category=%s, subcategory=%s, voltage=%s, capacity=%s,
                   price_from=%s, price_to=%s, description=%s, condition=%s, image_url=%s, in_stock=%s, updated_at=NOW()
                   WHERE id=%s RETURNING *""",
                (
                    body.get("name"), body.get("category"), body.get("subcategory"),
                    body.get("voltage"), body.get("capacity"),
                    body.get("price_from"), body.get("price_to"),
                    body.get("description"), body.get("condition", "new"),
                    body.get("image_url"), body.get("in_stock", True),
                    int(product_id),
                ),
            )
            product = cur.fetchone()
            conn.commit(); cur.close(); conn.close()
            if not product:
                return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Not found"})}
            return {
                "statusCode": 200,
                "headers": {**cors, "Content-Type": "application/json"},
                "body": json.dumps({"product": dict(product)}, default=str),
            }

        # Удалить товар: DELETE ?id=X
        if method == "DELETE":
            if not product_id:
                cur.close(); conn.close()
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "No product id"})}
            cur.execute("DELETE FROM products WHERE id=%s", (int(product_id),))
            conn.commit(); cur.close(); conn.close()
            return {
                "statusCode": 200,
                "headers": {**cors, "Content-Type": "application/json"},
                "body": json.dumps({"ok": True}),
            }

        # Список всех товаров: GET
        if method == "GET":
            cur.execute("SELECT * FROM products ORDER BY created_at DESC")
            products = [dict(p) for p in cur.fetchall()]
            cur.close(); conn.close()
            return {
                "statusCode": 200,
                "headers": {**cors, "Content-Type": "application/json"},
                "body": json.dumps({"products": products}, default=str),
            }

        cur.close(); conn.close()
        return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}

    except Exception as e:
        conn.rollback(); cur.close(); conn.close()
        return {
            "statusCode": 500,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }
