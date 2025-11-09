-- =====================================================
-- MIGRATION: Homepage Sections Management
-- Date: 2024-11-08
-- Goal: create homepage_sections + homepage_section_items and migrate existing data
-- =====================================================

BEGIN;

-- Ensure helper trigger function exists
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------
-- 1. Table: homepage_sections
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS homepage_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  layout_type TEXT NOT NULL DEFAULT 'grid' CHECK (layout_type IN ('featured', 'grid')),
  bg_color TEXT NOT NULL DEFAULT 'white' CHECK (bg_color IN ('white', 'gray')),
  "limit" INTEGER NOT NULL DEFAULT 3 CHECK ("limit" > 0 AND "limit" <= 12),
  view_all_label TEXT NOT NULL DEFAULT 'Ver todos',
  view_all_href TEXT NOT NULL DEFAULT '/produtos',
  category_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_homepage_sections_sort_order ON homepage_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON homepage_sections(is_active);

CREATE TRIGGER trg_homepage_sections_updated
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------
-- 2. Table: homepage_section_items
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS homepage_section_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id TEXT NOT NULL REFERENCES homepage_sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_by UUID
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_section_items_unique_product
  ON homepage_section_items(section_id, product_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_section_items_order
  ON homepage_section_items(section_id, sort_order);

CREATE TRIGGER trg_homepage_section_items_updated
  BEFORE UPDATE ON homepage_section_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------
-- 3. Seed default homepage sections
-- -----------------------------------------------------
INSERT INTO homepage_sections (
  id, title, subtitle, layout_type, bg_color, "limit", view_all_label, view_all_href,
  category_id, sort_order, is_active
)
VALUES
  (
    'featured_showcase',
    'Produtos em destaque',
    'Confira nossos produtos mais populares',
    'featured',
    'white',
    3,
    'Ver todos',
    '/produtos',
    NULL,
    1,
    TRUE
  ),
  (
    'best_sellers',
    'Mais vendidos',
    'Escolhas frequentes dos nossos clientes',
    'grid',
    'white',
    3,
    'Ver todos',
    '/produtos',
    NULL,
    2,
    TRUE
  ),
  (
    'print',
    'Impressão',
    'Serviços de impressão com máxima qualidade',
    'grid',
    'gray',
    3,
    'Ver todos',
    '/produtos?category=print',
    'print',
    3,
    TRUE
  ),
  (
    'sticker',
    'Adesivos',
    'Etiquetas e adesivos personalizados',
    'grid',
    'white',
    3,
    'Ver todos',
    '/produtos?category=adesivos',
    'adesivos',
    4,
    TRUE
  ),
  (
    'banners_fachadas',
    'Banners & Fachadas',
    'Soluções completas para destaque visual',
    'grid',
    'gray',
    3,
    'Ver todos',
    '/produtos?category=banners',
    'banners',
    5,
    TRUE
  )
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    layout_type = EXCLUDED.layout_type,
    bg_color = EXCLUDED.bg_color,
    "limit" = EXCLUDED."limit",
    view_all_label = EXCLUDED.view_all_label,
    view_all_href = EXCLUDED.view_all_href,
    category_id = EXCLUDED.category_id,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- -----------------------------------------------------
-- 4. Data migration from homepage_products (when available)
-- -----------------------------------------------------
DO $$
DECLARE
  missing_count INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'homepage_products'
  ) THEN
    -- Helper CTE to map homepage_products to products table via slug
    WITH matched_products AS (
      SELECT
        hp.*,
        p.id AS product_uuid
      FROM homepage_products hp
      JOIN products p
        ON LOWER(p.slug) = LOWER(hp.slug)
      WHERE p.name IS NOT NULL
        AND p.price IS NOT NULL
        AND p.unit IS NOT NULL
    )
    INSERT INTO homepage_section_items (section_id, product_id, sort_order)
    SELECT
      section_id,
      product_uuid,
      row_number() OVER (
        PARTITION BY section_id
        ORDER BY COALESCE(hp.sort_order, 0), hp.created_at DESC, hp.id
      ) AS ranked_order
    FROM (
      -- Featured showcase
      SELECT
        'featured_showcase' AS section_id,
        mp.product_uuid,
        mp.sort_order,
        mp.created_at,
        mp.id
      FROM matched_products mp
      WHERE COALESCE(mp.featured, FALSE) OR COALESCE(mp.show_on_featured, FALSE)

      UNION ALL

      -- Best sellers (legacy show_on_home)
      SELECT
        'best_sellers',
        mp.product_uuid,
        mp.sort_order,
        mp.created_at,
        mp.id
      FROM matched_products mp
      WHERE COALESCE(mp.show_on_home, FALSE)

      UNION ALL

      -- Print category
      SELECT
        'print',
        mp.product_uuid,
        mp.sort_order,
        mp.created_at,
        mp.id
      FROM matched_products mp
      WHERE LOWER(mp.category_id) = 'print'

      UNION ALL

      -- Stickers / adesivos
      SELECT
        'sticker',
        mp.product_uuid,
        mp.sort_order,
        mp.created_at,
        mp.id
      FROM matched_products mp
      WHERE LOWER(mp.category_id) = 'adesivos'

      UNION ALL

      -- Banners & Fachadas
      SELECT
        'banners_fachadas',
        mp.product_uuid,
        mp.sort_order,
        mp.created_at,
        mp.id
      FROM matched_products mp
      WHERE LOWER(mp.category_id) = 'banners'
    ) AS hp
    ON CONFLICT (section_id, product_id) DO NOTHING;

    -- Log slugs that could not be migrated
    SELECT COUNT(*)
    INTO missing_count
    FROM homepage_products hp
    LEFT JOIN products p
      ON LOWER(p.slug) = LOWER(hp.slug)
    WHERE p.id IS NULL;

    IF missing_count > 0 THEN
      RAISE NOTICE 'homepage_section_items migration skipped % homepage_products without matching products', missing_count;
    END IF;
  ELSE
    RAISE NOTICE 'Skipping homepage_products migration because table was not found.';
  END IF;
END $$;

COMMIT;
