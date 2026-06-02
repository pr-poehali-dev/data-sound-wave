-- Добавляем статус в contacts (новая/в работе/закрыта)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';

-- Таблица email-получателей для уведомлений о заявках
CREATE TABLE IF NOT EXISTS notification_emails (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  label VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
