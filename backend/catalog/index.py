"""
Каталог товаров Аккумофф: получение списка с фильтрами
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        params = event.get("queryStringParameters") or {}
        category = params.get("category", "")
        voltage = params.get("voltage", "")
        condition = params.get("condition", "")
        in_stock = params.get("in_stock", "")
        price_max = params.get("price_max", "")
        search = params.get("search", "")

        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor(cursor_factory=RealDictCursor)

        query = "SELECT * FROM products WHERE 1=1"
        args = []

        if category:
            query += " AND category = %s"
            args.append(category)
        if voltage:
            query += " AND voltage = %s"
            args.append(int(voltage))
        if condition:
            query += " AND condition = %s"
            args.append(condition)
        if in_stock == "true":
            query += " AND in_stock = true"
        if price_max:
            query += " AND price_from <= %s"
            args.append(int(price_max))
        if search:
            query += " AND (name ILIKE %s OR description ILIKE %s)"
            args.append(f"%{search}%")
            args.append(f"%{search}%")

        query += " ORDER BY created_at DESC"

        cur.execute(query, args)
        products = cur.fetchall()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"products": [dict(p) for p in products]}, default=str),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }
