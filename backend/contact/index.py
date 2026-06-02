"""
Приём заявок на консультацию с сайта Аккумофф + email-уведомления
"""
import json
import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
from psycopg2.extras import RealDictCursor


def send_notifications(contact: dict):
    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_port = int(os.environ.get("SMTP_PORT", "465"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_host or not smtp_user or not smtp_pass:
        return

    conn2 = psycopg2.connect(os.environ["DATABASE_URL"])
    cur2 = conn2.cursor(cursor_factory=RealDictCursor)
    cur2.execute("SELECT email FROM notification_emails WHERE active = true")
    emails = [r["email"] for r in cur2.fetchall()]
    cur2.close()
    conn2.close()

    if not emails:
        return

    subject = f"Новая заявка с сайта Аккумофф — {contact['name']}"
    body = f"""Новая заявка с сайта Аккумофф

Имя: {contact['name']}
Телефон: {contact['phone']}
Источник: {contact.get('source', 'website')}
Сообщение: {contact.get('message') or '—'}

---
Посмотреть все заявки: /admin
"""
    ctx = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx) as server:
            server.login(smtp_user, smtp_pass)
            for to_email in emails:
                msg = MIMEMultipart()
                msg["From"] = smtp_user
                msg["To"] = to_email
                msg["Subject"] = subject
                msg.attach(MIMEText(body, "plain", "utf-8"))
                server.sendmail(smtp_user, to_email, msg.as_string())
    except Exception:
        pass  # Не прерываем сохранение заявки при ошибке отправки


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    name = (body.get("name") or "").strip()
    phone = (body.get("phone") or "").strip()
    message = (body.get("message") or "").strip()
    source = (body.get("source") or "website").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": {**cors, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Укажите имя и телефон"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO contacts (name, phone, message, source) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
        (name, phone, message or None, source),
    )
    row = cur.fetchone()
    contact_id, created_at = row[0], row[1]
    conn.commit()
    cur.close()
    conn.close()

    send_notifications({"name": name, "phone": phone, "message": message, "source": source, "created_at": str(created_at)})

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps({"ok": True, "id": contact_id}),
    }
