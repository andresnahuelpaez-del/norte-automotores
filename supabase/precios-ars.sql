-- ============================================================
-- PRECIOS EN PESOS ARGENTINOS para el catálogo demo
-- Ejecutar en Supabase Dashboard → SQL Editor
-- Convierte los 14 vehículos demo de USD a ARS con valores
-- plausibles del mercado argentino (demo, no precios reales).
-- ============================================================

UPDATE cars SET currency = 'ARS', price = 56000000, updated_at = now() WHERE slug = 'toyota-hilux-srv-4x4-at-2021-usado';
UPDATE cars SET currency = 'ARS', price = 45000000, updated_at = now() WHERE slug = 'ford-ranger-xlt-4x4-mt-2020-usado';
UPDATE cars SET currency = 'ARS', price = 40000000, updated_at = now() WHERE slug = 'toyota-corolla-xei-at-2022-usado';
UPDATE cars SET currency = 'ARS', price = 57000000, updated_at = now() WHERE slug = 'volkswagen-amarok-v6-highline-4x4-2019-usado';
UPDATE cars SET currency = 'ARS', price = 23000000, updated_at = now() WHERE slug = 'chevrolet-onix-plus-premier-at-2022-usado';
UPDATE cars SET currency = 'ARS', price = 34000000, updated_at = now() WHERE slug = 'jeep-renegade-longitude-plus-at-2021-usado';
UPDATE cars SET currency = 'ARS', price = 19500000, updated_at = now() WHERE slug = 'ford-focus-se-plus-at-2019-usado';
UPDATE cars SET currency = 'ARS', price = 26000000, updated_at = now() WHERE slug = 'renault-duster-privilege-4x4-2020-usado';
UPDATE cars SET currency = 'ARS', price = 37000000, updated_at = now() WHERE slug = 'honda-hr-v-exl-at-2021-usado';
UPDATE cars SET currency = 'ARS', price = 27500000, updated_at = now() WHERE slug = 'volkswagen-vento-highline-at-2020-usado';

UPDATE cars SET currency = 'ARS', price = 6200000, updated_at = now() WHERE slug = 'honda-cb-300r-abs-2022-usado';
UPDATE cars SET currency = 'ARS', price = 7500000, updated_at = now() WHERE slug = 'yamaha-mt-03-abs-2021-usado';
UPDATE cars SET currency = 'ARS', price = 4000000, updated_at = now() WHERE slug = 'bajaj-pulsar-ns200-fi-abs-2023-usado';
UPDATE cars SET currency = 'ARS', price = 6800000, updated_at = now() WHERE slug = 'royal-enfield-meteor-350-fireball-2022-usado';

-- Verificación: todos deben quedar en ARS
SELECT slug, price, currency FROM cars ORDER BY vehicle_type, price DESC;
