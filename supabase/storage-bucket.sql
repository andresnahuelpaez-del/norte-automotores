-- ============================================================
-- BUCKET "vehiculos" para las fotos que sube el panel admin
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Crear el bucket público
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehiculos', 'vehiculos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policies sobre los objetos del bucket
-- Lectura pública (para que el sitio muestre las fotos)
DROP POLICY IF EXISTS "Public read vehiculos" ON storage.objects;
CREATE POLICY "Public read vehiculos" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehiculos');

-- Subida solo para admins logueados
DROP POLICY IF EXISTS "Admin upload vehiculos" ON storage.objects;
CREATE POLICY "Admin upload vehiculos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');

-- Sobrescritura (el form sube con upsert) solo para admins
DROP POLICY IF EXISTS "Admin update vehiculos" ON storage.objects;
CREATE POLICY "Admin update vehiculos" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'vehiculos' AND auth.role() = 'authenticated')
  WITH CHECK (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');

-- Borrado solo para admins
DROP POLICY IF EXISTS "Admin delete vehiculos" ON storage.objects;
CREATE POLICY "Admin delete vehiculos" ON storage.objects
  FOR DELETE USING (bucket_id = 'vehiculos' AND auth.role() = 'authenticated');

-- Verificación
SELECT id, public FROM storage.buckets WHERE id = 'vehiculos';
