-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by authenticated users"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Insert sample products
INSERT INTO products (name, slug, description, category, price, image_url) VALUES
  ('Cartões de Visita Premium', 'cartoes-visita-premium', 'Cartões de visita em papel couché 300g com acabamento fosco', 'cartoes', 89.90, '/products/business-cards.jpg'),
  ('Banner 1x2m', 'banner-1x2m', 'Banner em lona 440g com impressão digital de alta qualidade', 'banners', 149.90, '/products/banner.jpg'),
  ('Adesivos Personalizados', 'adesivos-personalizados', 'Adesivos em vinil com corte especial', 'adesivos', 59.90, '/products/stickers.jpg'),
  ('Flyers A5', 'flyers-a5', 'Flyers coloridos em papel couché 150g', 'flyers', 79.90, '/products/flyers.jpg'),
  ('Cartão de Visita Verniz Localizado', 'cartao-verniz', 'Cartão premium com verniz localizado', 'cartoes', 129.90, '/products/business-cards-premium.jpg'),
  ('Banner Roll-Up', 'banner-rollup', 'Banner retrátil com estrutura em alumínio', 'banners', 299.90, '/products/rollup.jpg'),
  ('Adesivos Transparentes', 'adesivos-transparentes', 'Adesivos em vinil transparente', 'adesivos', 89.90, '/products/transparent-stickers.jpg'),
  ('Folder A4', 'folder-a4', 'Folder dobrado em papel couché 170g', 'print', 99.90, '/products/folder.jpg'),
  ('Impressão A3 Colorida', 'impressao-a3', 'Impressão colorida em papel couché 170g', 'print', 12.90, '/products/print-a3.jpg'),
  ('Convites Personalizados', 'convites', 'Convites em papel especial com acabamento premium', 'print', 149.90, '/products/invitations.jpg'),
  ('Fachada ACM', 'fachada-acm', 'Placa em ACM com impressão digital', 'banners', 599.90, '/products/acm.jpg'),
  ('Etiquetas Adesivas', 'etiquetas', 'Etiquetas em papel adesivo', 'adesivos', 49.90, '/products/labels.jpg');
