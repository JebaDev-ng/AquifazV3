-- =====================================================
-- MIGRATION: Admin Panel Setup
-- Data: 2024-11-07
-- Descrição: Expansão do schema para suportar painel administrativo
-- =====================================================

-- 1. CRIAR TABELA PRODUCTS (SE NÃO EXISTIR)
-- =====================================================

-- Criar tabela products com todas as colunas necessárias
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
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

-- Adicionar colunas se a tabela já existir (para compatibilidade)
DO $$
BEGIN
  -- Verificar e adicionar colunas administrativas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'active') THEN
    ALTER TABLE products ADD COLUMN active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'featured') THEN
    ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'show_on_home') THEN
    ALTER TABLE products ADD COLUMN show_on_home BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'show_on_featured') THEN
    ALTER TABLE products ADD COLUMN show_on_featured BOOLEAN DEFAULT false;
  END IF;

  -- Verificar e adicionar colunas de mídia
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
    ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'thumbnail_url') THEN
    ALTER TABLE products ADD COLUMN thumbnail_url TEXT;
  END IF;

  -- Verificar e adicionar colunas comerciais
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
    ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_price') THEN
    ALTER TABLE products ADD COLUMN discount_price DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_start') THEN
    ALTER TABLE products ADD COLUMN discount_start TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_end') THEN
    ALTER TABLE products ADD COLUMN discount_end TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Verificar e adicionar colunas técnicas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specifications') THEN
    ALTER TABLE products ADD COLUMN specifications JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'min_quantity') THEN
    ALTER TABLE products ADD COLUMN min_quantity INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'max_quantity') THEN
    ALTER TABLE products ADD COLUMN max_quantity INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'unit') THEN
    ALTER TABLE products ADD COLUMN unit TEXT DEFAULT 'unidade';
  END IF;

  -- Verificar e adicionar colunas de SEO
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tags') THEN
    ALTER TABLE products ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_description') THEN
    ALTER TABLE products ADD COLUMN meta_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sort_order') THEN
    ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;

  -- Verificar e adicionar colunas de auditoria
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updated_at') THEN
    ALTER TABLE products ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'updated_by') THEN
    ALTER TABLE products ADD COLUMN updated_by UUID;
  END IF;
END
$$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Índices para outras tabelas
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_content_sections_type ON content_sections(type);
CREATE INDEX IF NOT EXISTS idx_content_sections_active ON content_sections(active);

-- 2. TABELA DE PERFIS DE USUÁRIO
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

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
  type TEXT NOT NULL CHECK (type IN ('hero', 'banner', 'pricing', 'footer')),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  data JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Content sections are viewable by everyone" ON content_sections;
DROP POLICY IF EXISTS "Only admins can insert content sections" ON content_sections;
DROP POLICY IF EXISTS "Only admins can update content sections" ON content_sections;
DROP POLICY IF EXISTS "Only admins can delete content sections" ON content_sections;

-- Policies para content_sections (público para leitura, admin para escrita)
CREATE POLICY "Content sections are viewable by everyone"
  ON content_sections FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert content sections"
  ON content_sections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update content sections"
  ON content_sections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete content sections"
  ON content_sections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 4. TABELA DE MÍDIA
-- =====================================================

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  category TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Media are viewable by everyone" ON media;
DROP POLICY IF EXISTS "Only authenticated users can upload media" ON media;

-- Policies para media
CREATE POLICY "Media are viewable by everyone"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can upload media"
  ON media FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);

-- 5. TABELA DE CATEGORIAS DE PRODUTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON product_categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON product_categories;

-- Policies para categorias (público para leitura)
CREATE POLICY "Categories are viewable by everyone"
  ON product_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON product_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 6. TABELA DE LOGS DE ATIVIDADE
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Only admins can view activity logs" ON activity_logs;

-- Policies para logs (apenas admins)
CREATE POLICY "Only admins can view activity logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 7. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS handle_updated_at_products ON products;
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON profiles;
DROP TRIGGER IF EXISTS handle_updated_at_content_sections ON content_sections;

CREATE TRIGGER handle_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_content_sections
  BEFORE UPDATE ON content_sections
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignorar erros para não bloquear criação de usuário
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 8. DADOS INICIAIS
-- =====================================================

-- Inserir categorias padrão
INSERT INTO product_categories (id, name, description, icon, sort_order) VALUES
  ('cartoes', 'Cartões de Visita', 'Cartões profissionais e empresariais', '💳', 1),
  ('banners', 'Banners e Fachadas', 'Sinalização visual e publicitária', '🏪', 2),
  ('adesivos', 'Adesivos', 'Adesivos personalizados diversos', '🏷️', 3),
  ('print', 'Impressões', 'Serviços gerais de impressão', '🖨️', 4),
  ('flyers', 'Flyers', 'Material publicitário impresso', '📄', 5)
ON CONFLICT (id) DO NOTHING;

-- Inserir conteúdo padrão do hero
INSERT INTO content_sections (id, type, title, subtitle, description, data) VALUES
  ('hero_main', 'hero', 'Aquifaz trabalha com diversos serviços', 'A sua gráfica em Araguaína', 'Tanto na área gráfica quanto na digital. Veja o que podemos fazer por você hoje!', 
   '{"whatsapp_number": "5563992731977", "whatsapp_message": "Olá! Vim pelo site e gostaria de conhecer os serviços da AquiFaz."}')
ON CONFLICT (id) DO NOTHING;

-- Atualizar produtos existentes com novos campos (se existirem)
UPDATE products SET 
  active = COALESCE(active, true),
  featured = COALESCE(featured, false),
  show_on_home = COALESCE(show_on_home, true),
  show_on_featured = COALESCE(show_on_featured, false),
  unit = COALESCE(unit, CASE 
    WHEN category = 'print' THEN 'folha'
    WHEN category = 'adesivos' THEN 'unidade'
    ELSE 'unidade'
  END),
  sort_order = COALESCE(sort_order, CASE 
    WHEN category = 'cartoes' THEN 100
    WHEN category = 'banners' THEN 200
    WHEN category = 'adesivos' THEN 300
    WHEN category = 'print' THEN 400
    ELSE 500
  END),
  updated_at = NOW()
WHERE active IS NULL OR featured IS NULL OR show_on_home IS NULL OR sort_order IS NULL;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA PARA PRODUCTS (ATUALIZAR)
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON products;
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Only admins and editors can insert products" ON products;
DROP POLICY IF EXISTS "Only admins and editors can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- Habilitar RLS para products se ainda não estiver
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Novas políticas mais restritivas
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);
CREATE POLICY "Only admins and editors can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only admins and editors can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

COMMENT ON TABLE products IS 'Tabela expandida de produtos com suporte administrativo completo';
COMMENT ON TABLE profiles IS 'Perfis de usuários com controle de acesso baseado em roles';
COMMENT ON TABLE content_sections IS 'Conteúdo editável das seções do site';
COMMENT ON TABLE media IS 'Biblioteca de mídia com metadados completos';
COMMENT ON TABLE product_categories IS 'Categorias de produtos organizadas hierarquicamente';
COMMENT ON TABLE activity_logs IS 'Log de todas as ações administrativas';