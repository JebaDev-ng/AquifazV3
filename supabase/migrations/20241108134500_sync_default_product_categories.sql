-- =====================================================
-- MIGRATION: Sync Default Product Categories
-- Date: 2024-11-08
-- Goal: Ensure all homepage categories exist inside Supabase
-- =====================================================

BEGIN;

INSERT INTO product_categories (id, name, description, icon, image_url, sort_order, active, created_at, updated_at)
VALUES
  ('cartoes', 'Cartoes de Visita', 'Cartoes profissionais e empresariais', 'CreditCard', '/categories/cartoes.jpg', 1, true, NOW(), NOW()),
  ('banners', 'Banners e Fachadas', 'Sinalizacao visual e publicitaria', 'PanelsTopLeft', NULL, 2, true, NOW(), NOW()),
  ('adesivos', 'Adesivos', 'Etiquetas e adesivos personalizados', 'Sticker', NULL, 3, true, NOW(), NOW()),
  ('print', 'Impressoes', 'Servicos gerais de impressao', 'Printer', NULL, 4, true, NOW(), NOW()),
  ('flyers', 'Flyers e Panfletos', 'Materiais publicitarios para distribuicao', 'Files', NULL, 5, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order,
  active = true,
  updated_at = NOW();

COMMIT;
