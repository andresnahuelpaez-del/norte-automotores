-- cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  slug text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  version text,
  year integer NOT NULL,
  mileage integer,
  color text,
  fuel_type text,
  transmission text,
  doors integer,
  body_type text,
  condition text DEFAULT 'used',
  price numeric,
  show_price boolean DEFAULT true,
  description text,
  features text[],
  images text[],
  video_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  financing_available boolean DEFAULT false,
  financing_details text,
  whatsapp_text text,
  views integer DEFAULT 0,
  vehicle_type    text DEFAULT 'car',   -- 'car' | 'moto'
  currency        text DEFAULT 'USD',   -- 'USD' | 'ARS'
  engine_cc       integer               -- motos: cilindrada
);

-- inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  car_id uuid REFERENCES cars(id),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text,
  type text
);

-- site_config table
CREATE TABLE IF NOT EXISTS site_config (
  key text PRIMARY KEY,
  value text
);

INSERT INTO site_config VALUES
  ('whatsapp_number', '5493804000000'),
  ('show_prices_globally', 'true'),
  ('show_financing_globally', 'true'),
  ('hero_title', 'Tu próximo auto te espera'),
  ('hero_subtitle', 'Usados, 0km y financiación. La Rioja.'),
  ('address', 'Av. Principal 1234, La Rioja'),
  ('phone', '+54 380 400-0000'),
  ('email', 'ventas@bordonautos.com.ar'),
  ('instagram', 'bordonautos'),
  ('facebook', 'bordonautos')
ON CONFLICT (key) DO NOTHING;

-- RLS policies
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active cars" ON cars FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all cars" ON cars USING (auth.role() = 'authenticated');

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Admin write config" ON site_config USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA: 10 AUTOS USADOS PREMIUM
-- Datos representativos del mercado argentino (2024-2025)
-- Fotos via picsum.photos (reemplazar con fotos reales)
-- ============================================================
INSERT INTO cars (slug, brand, model, version, year, mileage, color, fuel_type, transmission, doors, body_type, condition, price, show_price, currency, vehicle_type, description, features, images, is_featured, is_active, financing_available, financing_details, whatsapp_text, views)
VALUES

-- 1. Toyota Hilux
('toyota-hilux-srv-4x4-at-2021-usado',
 'Toyota', 'Hilux', 'SRV 4x4 AT', 2021, 45000, 'Blanco Perla', 'diesel', 'automatico', 4, 'pickup', 'used',
 38500, true, 'USD', 'car',
 'Toyota Hilux SRV 4x4 automática, un solo dueño, service oficial al día. Impecable estado interior y exterior. Papeles listos para transferir.',
 ARRAY['Cámara de reversa','Control de crucero','Asientos de cuero','Pantalla táctil 8"','Apple CarPlay / Android Auto','Climatizador bizona','Sensor de lluvia','4x4 con reductora','Alarma original','Dirección eléctrica'],
 ARRAY['https://picsum.photos/seed/hilux2021a/800/450','https://picsum.photos/seed/hilux2021b/800/450','https://picsum.photos/seed/hilux2021c/800/450'],
 true, true, true, 'Financiación en 36 cuotas fijas. Consultá tu plan.', 'Hola! Me interesa la Toyota Hilux SRV 4x4 AT 2021 que vi en su web. ¿Está disponible?', 0),

-- 2. Ford Ranger
('ford-ranger-xlt-4x4-mt-2020-usado',
 'Ford', 'Ranger', 'XLT 4x4 MT', 2020, 58000, 'Gris Magnético', 'diesel', 'manual', 4, 'pickup', 'used',
 31000, true, 'USD', 'car',
 'Ford Ranger XLT 4x4 manual. Excelente estado mecánico, neumáticos nuevos, cabina doble. Documentación en regla.',
 ARRAY['Cabina doble','4x4 con reductora','Bluetooth','Control de tracción','Airbags duales','Elevalunas eléctrico','Espejos eléctricos','Llave inteligente'],
 ARRAY['https://picsum.photos/seed/ranger2020a/800/450','https://picsum.photos/seed/ranger2020b/800/450','https://picsum.photos/seed/ranger2020c/800/450'],
 true, true, true, '36 cuotas sin anticipo. Preguntá por el plan.', 'Hola! Me interesa la Ford Ranger XLT 4x4 2020 que vi en su web. ¿Está disponible?', 0),

-- 3. Toyota Corolla
('toyota-corolla-xei-at-2022-usado',
 'Toyota', 'Corolla', 'XEI AT', 2022, 28000, 'Gris Oscuro', 'nafta', 'automatico', 4, 'sedan', 'used',
 27500, true, 'USD', 'car',
 'Toyota Corolla XEI automático 2022 con muy bajo kilometraje. Un dueño, service oficial Toyota completo. Como nuevo.',
 ARRAY['Apple CarPlay','Android Auto','Cámara de reversa 360°','Asientos tapizados cuero','Climatizador bizona','Sensores de estacionamiento','Lane departure warning','Adaptive cruise control','Pantalla 9"','Bluetooth'],
 ARRAY['https://picsum.photos/seed/corolla2022a/800/450','https://picsum.photos/seed/corolla2022b/800/450','https://picsum.photos/seed/corolla2022c/800/450'],
 true, true, true, 'Financiación disponible. Consultá tu cuota.', 'Hola! Me interesa el Toyota Corolla XEI AT 2022 que vi en su web. ¿Está disponible?', 0),

-- 4. VW Amarok
('volkswagen-amarok-v6-highline-4x4-2019-usado',
 'Volkswagen', 'Amarok', 'V6 Highline 4x4', 2019, 72000, 'Negro', 'diesel', 'automatico', 4, 'pickup', 'used',
 39000, true, 'USD', 'car',
 'Volkswagen Amarok V6 Highline 4x4 con caja automática de 8 velocidades. Motor 3.0 TDI biturbo 224cv. Full equipo.',
 ARRAY['Motor V6 3.0 TDI 224cv','Caja automática 8 vel','4MOTION permanente','Pantalla Discovery Pro 8"','Cuero Nappa','Techo panorámico','Cámara 360°','Control de crucero adaptativo','Sensores delanteros y traseros','Llantas 20"'],
 ARRAY['https://picsum.photos/seed/amarokv6a/800/450','https://picsum.photos/seed/amarokv6b/800/450','https://picsum.photos/seed/amarokv6c/800/450'],
 false, true, true, 'Tomamos tu auto en parte de pago. Financiación disponible.', 'Hola! Me interesa la VW Amarok V6 Highline 2019 que vi en su web. ¿Está disponible?', 0),

-- 5. Chevrolet Onix Plus
('chevrolet-onix-plus-premier-at-2022-usado',
 'Chevrolet', 'Onix Plus', 'Premier AT', 2022, 22000, 'Rojo Sedúceme', 'nafta', 'automatico', 4, 'sedan', 'used',
 15800, true, 'USD', 'car',
 'Chevrolet Onix Plus Premier automático 2022, bajo kilometraje. Todo el equipamiento de serie incluyendo pantalla MyLink y cámara trasera.',
 ARRAY['Pantalla MyLink 8"','Apple CarPlay / Android Auto','Cámara de reversa','Sensores de estacionamiento','Climatizador','Asientos parcialmente cuero','Alarma','Llave inteligente','Control de crucero'],
 ARRAY['https://picsum.photos/seed/onixplus22a/800/450','https://picsum.photos/seed/onixplus22b/800/450','https://picsum.photos/seed/onixplus22c/800/450'],
 false, true, true, 'Cuotas accesibles. Consultá tu plan de financiación.', 'Hola! Me interesa el Chevrolet Onix Plus Premier AT 2022 que vi en su web. ¿Está disponible?', 0),

-- 6. Jeep Renegade
('jeep-renegade-longitude-plus-at-2021-usado',
 'Jeep', 'Renegade', 'Longitude Plus AT', 2021, 38000, 'Azul Jetset', 'nafta', 'automatico', 4, 'suv', 'used',
 23500, true, 'USD', 'car',
 'Jeep Renegade Longitude Plus automático 2021. SUV compacta con estilo, gran equipamiento y excelente estado.',
 ARRAY['Pantalla Uconnect 8.4"','Apple CarPlay / Android Auto','Cámara trasera','Sensores delanteros y traseros','Techo solar de apertura eléctrica','Asientos en tela premium','Control de tracción','Llantas 18"','Alarma'],
 ARRAY['https://picsum.photos/seed/renegade21a/800/450','https://picsum.photos/seed/renegade21b/800/450','https://picsum.photos/seed/renegade21c/800/450'],
 false, true, true, 'Financiación en cuotas. Preguntá por los planes disponibles.', 'Hola! Me interesa el Jeep Renegade Longitude Plus 2021 que vi en su web. ¿Está disponible?', 0),

-- 7. Ford Focus
('ford-focus-se-plus-at-2019-usado',
 'Ford', 'Focus', 'SE Plus AT', 2019, 65000, 'Blanco Oxford', 'nafta', 'automatico', 4, 'sedan', 'used',
 13200, true, 'USD', 'car',
 'Ford Focus SE Plus automático con excelente estado mecánico. Ideal para uso cotidiano, muy económico.',
 ARRAY['Pantalla SYNC 8"','Apple CarPlay','Bluetooth','Cámara de reversa','Climatizador','Control de crucero','Asientos de tela premium','Alarma'],
 ARRAY['https://picsum.photos/seed/focus19a/800/450','https://picsum.photos/seed/focus19b/800/450','https://picsum.photos/seed/focus19c/800/450'],
 false, true, true, 'Excelente relación precio/calidad. Financiación disponible.', 'Hola! Me interesa el Ford Focus SE Plus AT 2019 que vi en su web. ¿Está disponible?', 0),

-- 8. Renault Duster
('renault-duster-privilege-4x4-2020-usado',
 'Renault', 'Duster', 'Privilege 4x4', 2020, 48000, 'Gris Estrella', 'nafta', 'manual', 4, 'suv', 'used',
 17900, true, 'USD', 'car',
 'Renault Duster Privilege 4x4 2020. SUV robusta, ideal para todo tipo de caminos. Excelente estado.',
 ARRAY['4x4 con modo 2WD/4WD','Pantalla táctil 7"','Bluetooth','Cámara de reversa','Climatizador','Sensores de estacionamiento','Llantas 16" con goma BF Goodrich','Portabici trasero'],
 ARRAY['https://picsum.photos/seed/duster20a/800/450','https://picsum.photos/seed/duster20b/800/450','https://picsum.photos/seed/duster20c/800/450'],
 false, true, true, 'Tomamos tu auto. Financiación en cuotas.', 'Hola! Me interesa la Renault Duster Privilege 4x4 2020 que vi en su web. ¿Está disponible?', 0),

-- 9. Honda HR-V
('honda-hr-v-exl-at-2021-usado',
 'Honda', 'HR-V', 'EXL AT', 2021, 32000, 'Plateado Lunar', 'nafta', 'automatico', 4, 'suv', 'used',
 25500, true, 'USD', 'car',
 'Honda HR-V EXL CVT 2021. SUV premium con bajo kilometraje y todo el equipamiento. Muy buen estado general.',
 ARRAY['Motor 1.8 i-VTEC 141cv','CVT','Apple CarPlay / Android Auto','Pantalla táctil 7"','Asientos en cuero','Cámara de reversa','LaneWatch','Honda Sensing','Climatizador bizona','Techo solar'],
 ARRAY['https://picsum.photos/seed/hrv21a/800/450','https://picsum.photos/seed/hrv21b/800/450','https://picsum.photos/seed/hrv21c/800/450'],
 true, true, true, 'Financiación disponible. Consultá tu plan personalizado.', 'Hola! Me interesa el Honda HR-V EXL AT 2021 que vi en su web. ¿Está disponible?', 0),

-- 10. VW Vento
('volkswagen-vento-highline-at-2020-usado',
 'Volkswagen', 'Vento', 'Highline AT', 2020, 42000, 'Gris Plata', 'nafta', 'automatico', 4, 'sedan', 'used',
 18700, true, 'USD', 'car',
 'Volkswagen Vento Highline automático 2020. Excelente estado, service al día en concesionaria VW. Documentación impecable.',
 ARRAY['Motor 1.4 TSI 150cv','Pantalla Composition Color 6.5"','Apple CarPlay / Android Auto','Sensores de estacionamiento delantero y trasero','Climatizador bizona','Asientos de cuero','Control de crucero','Asistente de frenado de emergencia','Llantas 16"'],
 ARRAY['https://picsum.photos/seed/vento20a/800/450','https://picsum.photos/seed/vento20b/800/450','https://picsum.photos/seed/vento20c/800/450'],
 false, true, true, 'Tomamos tu auto en parte de pago. Preguntá por financiación.', 'Hola! Me interesa el VW Vento Highline AT 2020 que vi en su web. ¿Está disponible?', 0);


-- ============================================================
-- SEED DATA: 4 MOTOS USADAS PREMIUM
-- Datos representativos del mercado argentino (2024-2025)
-- ============================================================
INSERT INTO cars (slug, brand, model, version, year, mileage, color, fuel_type, transmission, doors, body_type, condition, price, show_price, currency, vehicle_type, engine_cc, description, features, images, is_featured, is_active, financing_available, financing_details, whatsapp_text, views)
VALUES

-- 1. Honda CB 300R
('honda-cb-300r-abs-2022-usado',
 'Honda', 'CB 300R', 'ABS', 2022, 8000, 'Negro Mate', 'nafta', 'manual', 0, 'naked', 'used',
 4200, true, 'USD', 'moto', 300,
 'Honda CB 300R ABS 2022. Moto naked urbana en excelente estado, bajo kilometraje. Ideal para la ciudad y ruta. Service oficial Honda al día.',
 ARRAY['Motor monocilíndrico 286cc','ABS de 2 canales','Display LCD','Iluminación LED completa','Suspensión USD delantera','Frenos Nissin','Cadena original sin desgaste'],
 ARRAY['https://picsum.photos/seed/hondacb300a/800/450','https://picsum.photos/seed/hondacb300b/800/450'],
 true, true, true, 'Financiación en cuotas. Consultá disponibilidad.', 'Hola! Me interesa la Honda CB 300R ABS 2022 que vi en su web. ¿Está disponible?', 0),

-- 2. Yamaha MT-03
('yamaha-mt-03-abs-2021-usado',
 'Yamaha', 'MT-03', 'ABS', 2021, 12000, 'Azul/Blanco', 'nafta', 'manual', 0, 'naked', 'used',
 5100, true, 'USD', 'moto', 321,
 'Yamaha MT-03 ABS 2021. Motor bicilíndrico 321cc de alto rendimiento. Perfecta para el piloto que busca adrenalina y versatilidad.',
 ARRAY['Motor bicilíndrico 321cc 42cv','ABS','Display LCD','Frenos Advics de alto rendimiento','Suspensión telescópica ajustable','Chasis Deltabox','Iluminación LED'],
 ARRAY['https://picsum.photos/seed/yamahamtc3a/800/450','https://picsum.photos/seed/yamahamtc3b/800/450'],
 true, true, true, 'Tomamos tu moto en parte de pago. Financiación disponible.', 'Hola! Me interesa la Yamaha MT-03 ABS 2021 que vi en su web. ¿Está disponible?', 0),

-- 3. Bajaj Pulsar NS 200
('bajaj-pulsar-ns200-fi-abs-2023-usado',
 'Bajaj', 'Pulsar NS 200', 'FI ABS', 2023, 5000, 'Rojo/Negro', 'nafta', 'manual', 0, 'naked', 'used',
 2700, true, 'USD', 'moto', 200,
 'Bajaj Pulsar NS200 FI ABS 2023 con muy bajo kilometraje. Moto deportiva urbana con inyección electrónica y ABS. Ideal primera moto deportiva.',
 ARRAY['Motor monocilíndrico 199.5cc','Inyección electrónica','ABS','Velocímetro digital','Suspensión perimeter frame','Frenos a disco delante y atrás','Luz DRL LED'],
 ARRAY['https://picsum.photos/seed/bajajns200a/800/450','https://picsum.photos/seed/bajajns200b/800/450'],
 false, true, true, 'Excelente precio. Financiación en cuotas. Consultanos.', 'Hola! Me interesa la Bajaj Pulsar NS200 FI ABS 2023 que vi en su web. ¿Está disponible?', 0),

-- 4. Royal Enfield Meteor 350
('royal-enfield-meteor-350-fireball-2022-usado',
 'Royal Enfield', 'Meteor 350', 'Fireball', 2022, 6500, 'Rojo Fireball', 'nafta', 'manual', 0, 'cruiser', 'used',
 4600, true, 'USD', 'moto', 349,
 'Royal Enfield Meteor 350 Fireball 2022. Cruiser clásica con motor moderno. Perfecta para salidas largas y viajes. En impecable estado.',
 ARRAY['Motor monocilíndrico 349cc 20.2cv','Tripper Navigation','Bluetooth','ABS de doble canal','Pantalla LED semidigital','Asiento bicolor','Guardabarros cromados','Excelente comodidad para viajes'],
 ARRAY['https://picsum.photos/seed/royalenfield22a/800/450','https://picsum.photos/seed/royalenfield22b/800/450'],
 false, true, true, 'Financiación disponible. Preguntá por el plan.', 'Hola! Me interesa la Royal Enfield Meteor 350 Fireball 2022 que vi en su web. ¿Está disponible?', 0);


-- increment views function
CREATE OR REPLACE FUNCTION increment_views(car_id uuid)
RETURNS void AS $$
  UPDATE cars SET views = views + 1 WHERE id = car_id;
$$ LANGUAGE sql SECURITY DEFINER;
