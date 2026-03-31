-- ============================================================
-- FIXES a ejecutar en Supabase Dashboard → SQL Editor
-- DESPUÉS de haber aplicado schema.sql
-- ============================================================

-- 1. Fix RLS: Admin necesita WITH CHECK para INSERT/UPDATE
DROP POLICY IF EXISTS "Admin all cars" ON cars;
CREATE POLICY "Admin all cars" ON cars
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin write config" ON site_config;
CREATE POLICY "Admin write config" ON site_config
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin read inquiries" ON inquiries;
CREATE POLICY "Admin all inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 2. Asegurarse de que increment_views existe
CREATE OR REPLACE FUNCTION increment_views(car_id uuid)
RETURNS void AS $$
  UPDATE cars SET views = views + 1 WHERE id = car_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- STORAGE BUCKET: crear manualmente en Supabase Dashboard
-- Storage → New bucket → nombre: "vehiculos" → Public: ON
-- Luego agregar esta policy:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehiculos', 'vehiculos', true)
-- ON CONFLICT DO NOTHING;

-- Policy para subir imágenes (solo admins autenticados):
-- CREATE POLICY "Admin upload" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');

-- Policy para lectura pública:
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT
--   USING (bucket_id = 'vehiculos');

-- 3. Actualizar site_config con datos reales de Bordon
INSERT INTO site_config (key, value) VALUES
  ('whatsapp_number', '5493804264242'),
  ('address', 'Avenida Félix de la colina esq. Cap. Giachino, La Rioja 5300'),
  ('phone', '+54 380 426-4242'),
  ('email', 'ventas@bordonautomotores.com.ar'),
  ('hero_title', 'Tu próximo auto te espera'),
  ('hero_subtitle', 'Autos, motos y financiación propia. La Rioja.'),
  ('instagram', 'bordonautomotores'),
  ('facebook', 'bordonautomotores'),
  ('show_prices_globally', 'true'),
  ('show_financing_globally', 'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
