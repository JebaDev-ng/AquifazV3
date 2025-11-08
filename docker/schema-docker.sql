-- =====================================================
-- MIGRATION: Admin Panel Setup - Docker Local Version
-- Data: 2024-11-07
-- Descrição: Schema simplificado para ambiente Docker
-- =====================================================

-- 1. CRIAR TABELA PRODUCTS (SE NÃO EXISTIR)
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Colunas administrativas
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  show_on_home BOOLEAN DEFAULT true,
  show_on_featured BOOLEAN DEFAULT false,

  -- Colunas de mídia
  images TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,

  -- Colunas comerciais
  original_price DECIMAL(10,2),
  discount_price DECIMAL(10,2),
  discount_start TIMESTAMP WITH TIME ZONE,
  discount_end TIMESTAMP WITH TIME ZONE,

  -- Colunas técnicas
  specifications JSONB DEFAULT '{}',
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER,
  unit TEXT DEFAULT 'unidade',

  -- Colunas de SEO e organização
  tags TEXT[] DEFAULT '{}',
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,

  -- Colunas de auditoria
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas para products (público para leitura, auth para escrita)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- 2. TABELA DE PERFIS DE USUÁRIO
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. TABELA DE CONTEÚDO EDITÁVEL
-- =====================================================

CREATE TABLE IF NOT EXISTS content_sections (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL DEFAULT 'hero',
  type TEXT NOT NULL DEFAULT 'hero',
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  content JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Habilitar RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Policies para content_sections
CREATE POLICY "Content sections are viewable by everyone"
  ON content_sections FOR SELECT
  USING (true);

-- 4. TABELA DE MÍDIA
-- =====================================================

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  size INTEGER NOT NULL,
  type TEXT NOT NULL,
  mime_type TEXT,
  dimensions JSONB,
  alt_text TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policies para media
CREATE POLICY "Media are viewable by everyone"
  ON media FOR SELECT
  USING (true);

-- 5. TABELA DE LOGS DE ATIVIDADE
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 6. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS handle_updated_at_products ON products;
CREATE TRIGGER handle_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_profiles ON profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_content_sections ON content_sections;
CREATE TRIGGER handle_updated_at_content_sections
  BEFORE UPDATE ON content_sections
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 7. DADOS INICIAIS DE TESTE
-- =====================================================

-- Inserir produtos de exemplo para teste
INSERT INTO products (name, slug, description, category, price, active, featured) VALUES
  ('Cartão de Visita Premium', 'cartao-visita-premium', 'Cartão de visita em papel couché com acabamento especial', 'cartoes', 50.00, true, true),
  ('Banner 2x1m Lona', 'banner-2x1-lona', 'Banner em lona vinílica para uso externo', 'banners', 80.00, true, true),
  ('Adesivo Vinil Recortado', 'adesivo-vinil-recortado', 'Adesivo em vinil automotivo recortado', 'adesivos', 25.00, true, false),
  ('Impressão A4 Colorida', 'impressao-a4-colorida', 'Impressão colorida em papel sulfite 75g', 'print', 2.50, true, false),
  ('Flyer Promocional', 'flyer-promocional', 'Flyer A5 em papel couché para divulgação', 'flyers', 0.80, true, true)
ON CONFLICT (slug) DO NOTHING;

-- Inserir conteúdo do hero
INSERT INTO content_sections (id, section, title, subtitle, description, content) VALUES
  ('hero_main', 'hero', 'AquiFaz', 'Tecnologia que conecta você ao futuro', 'Descubra os produtos mais inovadores com a melhor experiência de compra. Qualidade garantida, entrega rápida e suporte excepcional.', 
   '{"whatsapp_number": "5563992731977", "whatsapp_message": "Olá! Vi os produtos da AquiFaz e gostaria de saber mais informações.", "features": ["Produtos Originais", "Entrega Rápida", "Suporte 24/7", "Garantia Estendida"]}')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  'products'::text as tabela,
  COUNT(*)::text as registros
FROM products
UNION ALL
SELECT 
  'profiles'::text,
  COUNT(*)::text
FROM profiles
UNION ALL
SELECT 
  'content_sections'::text,
  COUNT(*)::text
FROM content_sections
UNION ALL
SELECT 
  'media'::text,
  COUNT(*)::text
FROM media
UNION ALL
SELECT 
  'activity_logs'::text,
  COUNT(*)::text
FROM activity_logs;