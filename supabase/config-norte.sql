-- ============================================================
-- SITE_CONFIG con los datos reales de NORTE AUTOMOTORES
-- Ejecutar en Supabase Dashboard → SQL Editor
-- (fixes.sql había dejado cargados los datos de Bordon:
--  WhatsApp, dirección, email e Instagram equivocados)
-- Datos verificados contra el Instagram oficial norte.automotores
-- ============================================================

INSERT INTO site_config (key, value) VALUES
  ('whatsapp_number', '5493804796317'),
  ('phone', '+54 380 479-6317'),
  ('address', 'Av. Coronel Felipe Varela 1776, La Rioja, Argentina'),
  ('email', 'ventas@norteautomotores.com.ar'),
  ('instagram', 'norte.automotores'),
  ('facebook', 'https://www.facebook.com/share/177Lw7quNV/?mibextid=wwXlfr'),
  ('hero_title', ''),
  ('hero_subtitle', 'Venta de autos seleccionados · Usados en excelente estado · Recibimos menor (auto/moto)'),
  ('show_prices_globally', 'true'),
  ('show_financing_globally', 'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verificación
SELECT * FROM site_config ORDER BY key;
