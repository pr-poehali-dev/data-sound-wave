
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  voltage INTEGER,
  capacity INTEGER,
  price_from INTEGER NOT NULL,
  price_to INTEGER,
  description TEXT,
  condition VARCHAR(50) DEFAULT 'new',
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_voltage ON products(voltage);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

INSERT INTO products (name, category, subcategory, voltage, capacity, price_from, price_to, description, condition, in_stock) VALUES
('АКБ 24В 210Ah свинцово-кислотный', 'battery_lead', 'traction', 24, 210, 28000, 35000, 'Для электропогрузчиков до 1.5т, стандартные габариты', 'new', true),
('АКБ 48В 400Ah свинцово-кислотный', 'battery_lead', 'traction', 48, 400, 65000, 80000, 'Для погрузчиков 2–3т и ричтраков, усиленный корпус', 'new', true),
('АКБ 80В 500Ah свинцово-кислотный', 'battery_lead', 'traction', 80, 500, 95000, 115000, 'Для тяжёлых погрузчиков и тягачей от 3т', 'new', true),
('Восстановленный АКБ 24В 200Ah', 'battery_lead', 'restored', 24, 200, 12000, 18000, 'Ёмкость до 85% после ионно-резонансного восстановления, гарантия', 'restored', true),
('Восстановленный АКБ 48В 350Ah', 'battery_lead', 'restored', 48, 350, 28000, 36000, 'Ёмкость до 85%, ионно-резонансная технология', 'restored', true),
('LFP 24В 200Ah Li-Ion', 'battery_lithium', 'lfp', 24, 200, 85000, 100000, 'Литий железо фосфат, срок службы 20–30 лет, BMS в комплекте', 'new', true),
('LFP 48В 300Ah Li-Ion', 'battery_lithium', 'lfp', 48, 300, 145000, 170000, 'Для погрузчиков 2–3т, быстрая зарядка за 2 часа', 'new', true),
('LFP 80В 400Ah Li-Ion', 'battery_lithium', 'lfp', 80, 400, 220000, 260000, 'Тяжёлая серия для крупной складской техники', 'new', true),
('Зарядник 24В 30А (свинец)', 'charger', 'lead', 24, NULL, 12000, 16000, 'Автоматическое зарядное для свинцовых АКБ, таймер', 'new', true),
('Зарядник 48В 50А (свинец)', 'charger', 'lead', 48, NULL, 22000, 28000, 'Промышленное зарядное, защита от переполюсовки', 'new', true),
('Зарядник 48В 30А (литий)', 'charger', 'lithium', 48, NULL, 18000, 24000, 'Совместим с LFP и Li-Ion, CC/CV алгоритм', 'new', true),
('Зарядник 80В 60А (свинец)', 'charger', 'lead', 80, NULL, 35000, 45000, 'Для тяжёлых аккумуляторов, кабель в комплекте', 'new', true),
('Электропогрузчик 1.5т', 'equipment', 'forklift', NULL, NULL, 480000, 560000, 'Тяговый аккумулятор 24В в комплекте, пробег до 8 часов', 'new', true),
('Электрический штабелёр 1т', 'equipment', 'stacker', NULL, NULL, 180000, 220000, 'Подъём до 3.5м, АКБ 24В, компактные размеры', 'new', true),
('ЭПТ-тележка 2т', 'equipment', 'pallet', NULL, NULL, 95000, 120000, 'Электрическая подъёмная тележка, горизонтальный транспорт', 'new', true);
