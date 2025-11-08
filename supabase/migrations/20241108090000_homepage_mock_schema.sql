-- =====================================================
-- MIGRATION: Homepage Mock Schema
-- Date: 2024-11-08
-- Goal: Mirror the stable homepage data model (mocks) inside Supabase
-- =====================================================

BEGIN;

-- Helper function to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Categories shown on the homepage (matches CategoriesSection)
-- =====================================================
CREATE TABLE IF NOT EXISTS homepage_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  accent_color TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_homepage_categories_name ON homepage_categories (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_homepage_categories_active ON homepage_categories (active);

CREATE TRIGGER trg_homepage_categories_updated
  BEFORE UPDATE ON homepage_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- Products consumed by homepage grids (FeaturedProductsSection / ProductsGridSection)
-- =====================================================
CREATE TABLE IF NOT EXISTS homepage_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id TEXT NOT NULL REFERENCES homepage_categories(id) ON DELETE RESTRICT,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT DEFAULT 'unidade',
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  show_on_home BOOLEAN DEFAULT TRUE,
  show_on_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_homepage_products_category ON homepage_products(category_id);
CREATE INDEX IF NOT EXISTS idx_homepage_products_featured ON homepage_products(featured);
CREATE INDEX IF NOT EXISTS idx_homepage_products_show_home ON homepage_products(show_on_home);

CREATE TRIGGER trg_homepage_products_updated
  BEFORE UPDATE ON homepage_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- Hero block (HeroSection)
-- =====================================================
CREATE TABLE IF NOT EXISTS homepage_hero_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  whatsapp_number TEXT,
  whatsapp_message TEXT,
  promo_image_url TEXT,
  promo_title TEXT,
  promo_subtitle TEXT,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE TRIGGER trg_homepage_hero_updated
  BEFORE UPDATE ON homepage_hero_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- Banner block (ImageBannerSection)
-- =====================================================
CREATE TABLE IF NOT EXISTS homepage_banner_sections (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  text TEXT NOT NULL,
  link TEXT,
  background_color TEXT DEFAULT '#1D1D1F',
  text_color TEXT DEFAULT '#FFFFFF',
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE TRIGGER trg_homepage_banner_updated
  BEFORE UPDATE ON homepage_banner_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- Seed data derived from mocks (categories, hero, banner, products)
-- =====================================================
INSERT INTO homepage_categories (id, name, description, image_url, accent_color, sort_order, active)
VALUES
  ('cartoes',  'Cartoes de Visita',   'Cartoes profissionais e empresariais',        '/categories/cartoes.jpg',  '#EDEDED', 1, TRUE),
  ('banners',  'Banners e Fachadas',  'Sinalizacao visual e publicitaria',          NULL,                       '#DDE7FF', 2, TRUE),
  ('adesivos', 'Adesivos',            'Etiquetas e adesivos personalizados',        NULL,                       '#FFEFD9', 3, TRUE),
  ('print',    'Impressoes',          'Servicos gerais de impressao',               NULL,                       '#E4FFEF', 4, TRUE),
  ('flyers',   'Flyers e Panfletos',  'Materiais publicitarios para distribuicao',  NULL,                       '#FFE1EC', 5, TRUE)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    accent_color = EXCLUDED.accent_color,
    sort_order = EXCLUDED.sort_order,
    active = EXCLUDED.active;

INSERT INTO homepage_hero_content (
  id, title, subtitle, description,
  whatsapp_number, whatsapp_message,
  promo_image_url, promo_title, promo_subtitle, active
)
VALUES (
  'hero_main',
  E'Aquifaz trabalha\\ncom diversos servicos',
  'A sua grafica em Araguaina',
  'Tanto na area grafica quanto na digital. Veja o que podemos fazer por voce hoje!',
  '5563992731977',
  'Ola! Vim pelo site e gostaria de conhecer os servicos da AquiFaz.',
  NULL,
  NULL,
  '1200 x 900',
  TRUE
)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    whatsapp_number = EXCLUDED.whatsapp_number,
    whatsapp_message = EXCLUDED.whatsapp_message,
    promo_image_url = EXCLUDED.promo_image_url,
    promo_title = EXCLUDED.promo_title,
    promo_subtitle = EXCLUDED.promo_subtitle,
    active = EXCLUDED.active;

INSERT INTO homepage_banner_sections (
  id, title, description, text, link,
  background_color, text_color, image_url, active, sort_order
)
VALUES (
  'home_banner',
  'Solicite um orcamento rapido',
  'Converse com nossa equipe criativa e receba propostas personalizadas.',
  'Prontos para criar sua proxima peca? Clique e fale com a AquiFaz pelo WhatsApp.',
  'https://wa.me/5563992731977?text=Ola!%20Vim%20pelo%20site%20e%20gostaria%20de%20fazer%20um%20orcamento.',
  '#1D1D1F',
  '#FFFFFF',
  NULL,
  TRUE,
  1
)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    text = EXCLUDED.text,
    link = EXCLUDED.link,
    background_color = EXCLUDED.background_color,
    text_color = EXCLUDED.text_color,
    image_url = EXCLUDED.image_url,
    active = EXCLUDED.active,
    sort_order = EXCLUDED.sort_order;

INSERT INTO homepage_products (
  id, name, slug, description, category_id, price, unit, image_url,
  featured, show_on_home, show_on_featured, sort_order
)
VALUES
  ('1',  'Cartoes de Visita Premium',      'cartoes-visita-premium',       'Cartoes em papel couche 300g com acabamento fosco. Impressao colorida frente e verso.',               'cartoes',  89.90,  'unidade', '/products/business-cards.jpg',          TRUE,  TRUE, TRUE,   1),
  ('2',  'Banner 1x2m',                    'banner-1x2m',                  'Banner em lona 440g com impressao digital de alta qualidade. Ideal para eventos e fachadas.',         'banners', 149.90,  'unidade', '/products/banner.jpg',                  TRUE,  TRUE, FALSE,  2),
  ('3',  'Adesivos Personalizados',        'adesivos-personalizados',      'Adesivos em vinil com corte especial. Resistente a agua e UV.',                                       'adesivos',  59.90, 'unidade', '/products/stickers.jpg',               TRUE,  TRUE, TRUE,   3),
  ('4',  'Flyers A5',                      'flyers-a5',                    'Flyers coloridos em papel couche 150g. Perfeito para divulgacao.',                                   'flyers',    79.90, 'unidade', '/products/flyers.jpg',                  FALSE, TRUE, FALSE,  4),
  ('5',  'Cartao de Visita Verniz',        'cartao-verniz',                'Cartao premium com verniz localizado para destacar elementos do design.',                             'cartoes',  129.90, 'unidade', '/products/business-cards-premium.jpg', FALSE, TRUE, FALSE,  5),
  ('6',  'Banner Roll-Up',                 'banner-rollup',                'Banner retratil com estrutura em aluminio. Facil montagem e transporte.',                             'banners',  299.90, 'unidade', '/products/rollup.jpg',                 FALSE, TRUE, FALSE,  6),
  ('7',  'Adesivos Transparentes',         'adesivos-transparentes',       'Adesivos em vinil transparente. Efeito premium para sua marca.',                                      'adesivos',  89.90, 'unidade', '/products/transparent-stickers.jpg',   FALSE, TRUE, FALSE,  7),
  ('8',  'Folder A4',                      'folder-a4',                    'Folder dobrado em papel couche 170g. Ideal para apresentacoes.',                                      'print',     99.90, 'unidade', '/products/folder.jpg',                 FALSE, TRUE, FALSE,  8),
  ('9',  'Impressao A3 Colorida',          'impressao-a3',                 'Impressao colorida em papel couche 170g. Alta qualidade.',                                            'print',     12.90, 'unidade', '/products/print-a3.jpg',               FALSE, TRUE, FALSE,  9),
  ('10', 'Convites Personalizados',        'convites',                     'Convites em papel especial com acabamento premium. Perfeito para eventos.',                           'print',    149.90, 'unidade', '/products/invitations.jpg',            FALSE, TRUE, FALSE, 10),
  ('11', 'Fachada ACM',                    'fachada-acm',                  'Placa em ACM com impressao digital. Durabilidade e qualidade.',                                       'banners',  599.90, 'unidade', '/products/acm.jpg',                    FALSE, TRUE, FALSE, 11),
  ('12', 'Etiquetas Adesivas',             'etiquetas',                    'Etiquetas em papel adesivo. Diversos tamanhos e formatos.',                                           'adesivos',  49.90, 'unidade', '/products/labels.jpg',                 FALSE, TRUE, FALSE, 12),
  ('13', 'Adesivos para Veiculos',         'adesivos-veiculos',            'Adesivos automotivos em vinil de alta qualidade. Resistente ao sol e chuva.',                         'adesivos', 199.90, 'unidade', '/products/car-stickers.jpg',           FALSE, TRUE, FALSE, 13),
  ('14', 'Banner X-Banner',                'banner-x',                     'Banner com estrutura em X. Leve e facil de transportar.',                                            'banners',  189.90, 'unidade', '/products/x-banner.jpg',               FALSE, TRUE, FALSE, 14),
  ('15', 'Impressao Offset',               'impressao-offset',             'Impressao offset de alta qualidade. Ideal para grandes tiragens.',                                   'print',      0.50, 'unidade', '/products/offset.jpg',                 FALSE, TRUE, FALSE, 15)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    unit = EXCLUDED.unit,
    image_url = EXCLUDED.image_url,
    featured = EXCLUDED.featured,
    show_on_home = EXCLUDED.show_on_home,
    show_on_featured = EXCLUDED.show_on_featured,
    sort_order = EXCLUDED.sort_order;

COMMIT;
