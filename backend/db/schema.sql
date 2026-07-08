-- Schema and seed data for the Carental database.
-- Run once against an empty database:
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE TABLE IF NOT EXISTS cars (
  id         SERIAL PRIMARY KEY,
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  stock      INTEGER NOT NULL,
  price_peak NUMERIC(8, 2) NOT NULL,
  price_mid  NUMERIC(8, 2) NOT NULL,
  price_off  NUMERIC(8, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id                  SERIAL PRIMARY KEY,
  car_id              INTEGER NOT NULL REFERENCES cars (id),
  user_id             TEXT NOT NULL,
  start_date          DATE NOT NULL,
  end_date            DATE NOT NULL,
  license_valid_until DATE NOT NULL,
  total_price         NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_car_range
  ON bookings (car_id, start_date, end_date);

-- The five cars from the brief, with peak / mid / off day prices.
INSERT INTO cars (brand, model, stock, price_peak, price_mid, price_off) VALUES
  ('Toyota',   'Yaris',   3, 98.43,  76.89, 53.65),
  ('Seat',     'Ibiza',   5, 85.12,  65.73, 46.85),
  ('Nissan',   'Qashqai', 2, 101.46, 82.94, 59.87),
  ('Jaguar',   'e-pace',  1, 120.54, 91.35, 70.27),
  ('Mercedes', 'Vito',    2, 109.16, 89.64, 64.97);
