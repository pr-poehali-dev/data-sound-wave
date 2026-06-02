"""
Управление заявками и email-уведомлениями в админке Аккумофф.
Роутинг через query-параметр ?resource=contacts|emails и ?action=...
"""
import json
import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
from psycopg2.extras import RealDictCursor

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "akkumoff-admin-2026")


def check_auth(event: dict) -> bool:
    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token") or ""
    return token == ADMIN_TOKEN


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def send_test_email(to_email: str):
    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_port = int(os.environ.get("SMTP_PORT", "465"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_host or not smtp_user or not smtp_pass:
        raise ValueError("SMTP не настроен. Заполните секреты SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_PORT.")

    subject = "Тест уведомлений — Аккумофф"
    body = "Это тестовое письмо. SMTP-уведомления работают корректно!"
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx) as server:
        server.login(smtp_user, smtp_pass)
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain", "utf-8"))
        server.sendmail(smtp_user, to_email, msg.as_string())


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

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    resource = params.get("resource", "")
    action = params.get("action", "")
    res_id = params.get("id", "")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # ── ЗАЯВКИ ──────────────────────────────────────────────────────────

        if resource == "contacts":
            if method == "GET":
                cur.execute("SELECT * FROM contacts ORDER BY created_at DESC")
                rows = [dict(r) for r in cur.fetchall()]
                cur.close(); conn.close()
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"contacts": rows}, default=str),
                }

            if method == "PUT" and action == "status" and res_id:
                new_status = body.get("status", "new")
                cur.execute("UPDATE contacts SET status=%s WHERE id=%s RETURNING *", (new_status, int(res_id)))
                row = cur.fetchone()
                conn.commit(); cur.close(); conn.close()
                if not row:
                    return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Not found"})}
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"contact": dict(row)}, default=str),
                }

            if method == "DELETE" and res_id:
                cur.execute("DELETE FROM contacts WHERE id=%s", (int(res_id),))
                conn.commit(); cur.close(); conn.close()
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"ok": True}),
                }

        # ── EMAIL-АДРЕСА ────────────────────────────────────────────────────

        if resource == "emails":
            if method == "GET":
                cur.execute("SELECT * FROM notification_emails ORDER BY created_at ASC")
                rows = [dict(r) for r in cur.fetchall()]
                cur.close(); conn.close()
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"emails": rows}, default=str),
                }

            if method == "POST":
                email = (body.get("email") or "").strip().lower()
                label = (body.get("label") or "").strip()
                if not email:
                    cur.close(); conn.close()
                    return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Email обязателен"})}
                cur.execute(
                    "INSERT INTO notification_emails (email, label) VALUES (%s, %s) "
                    "ON CONFLICT (email) DO UPDATE SET label=%s, active=true RETURNING *",
                    (email, label or None, label or None),
                )
                row = dict(cur.fetchone())
                conn.commit(); cur.close(); conn.close()
                return {
                    "statusCode": 201,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"email": row}, default=str),
                }

            if method == "PUT" and res_id:
                cur.execute(
                    "UPDATE notification_emails SET label=%s, active=%s WHERE id=%s RETURNING *",
                    (body.get("label"), body.get("active", True), int(res_id)),
                )
                row = cur.fetchone()
                conn.commit(); cur.close(); conn.close()
                if not row:
                    return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Not found"})}
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"email": dict(row)}, default=str),
                }

            if method == "DELETE" and res_id:
                cur.execute("DELETE FROM notification_emails WHERE id=%s", (int(res_id),))
                conn.commit(); cur.close(); conn.close()
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"ok": True}),
                }

        # ── ТЕСТ SMTP ────────────────────────────────────────────────────────

        if resource == "test-email" and method == "POST":
            to_email = (body.get("email") or "").strip()
            if not to_email:
                cur.close(); conn.close()
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Укажите email"})}
            cur.close(); conn.close()
            try:
                send_test_email(to_email)
                return {
                    "statusCode": 200,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"ok": True}),
                }
            except Exception as e:
                return {
                    "statusCode": 500,
                    "headers": {**cors, "Content-Type": "application/json"},
                    "body": json.dumps({"error": str(e)}),
                }

        cur.close(); conn.close()
        return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Not found"})}

    except Exception as e:
        conn.rollback(); cur.close(); conn.close()
        return {
            "statusCode": 500,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }
