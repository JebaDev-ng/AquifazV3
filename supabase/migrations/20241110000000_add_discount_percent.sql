-- Adicionar coluna discount_percent à tabela products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2);

-- Adicionar comentário
COMMENT ON COLUMN products.discount_percent IS 'Percentual de desconto aplicado (0-90%)';

-- Atualizar produtos existentes que têm original_price
-- Calcular o discount_percent baseado nos valores existentes
UPDATE products
SET discount_percent = ROUND(((original_price - price) / original_price) * 100, 2)
WHERE original_price IS NOT NULL 
  AND original_price > 0 
  AND price > 0 
  AND original_price > price;

-- Limpar dados inconsistentes (onde original_price <= price)
UPDATE products
SET original_price = NULL, discount_percent = NULL
WHERE original_price IS NOT NULL 
  AND original_price <= price;
