-- =====================================================
-- MIGRATION: Refatoração dos Campos de Preço dos Produtos
-- Data: 2025-11-09
-- Descrição: Simplifica a lógica de preços na tabela `products`,
--            unificando `price` e `discount_price` e removendo
--            campos de promoção redundantes.
-- =====================================================

BEGIN;

-- Passo 1: Migrar o valor de `discount_price` para `price`
-- O objetivo é fazer com que `price` seja sempre o preço final de venda.
-- `original_price` será o preço "de", e `price` o preço "por".
UPDATE products
SET 
  price = COALESCE(discount_price, price),
  updated_at = TIMEZONE('utc', NOW())
WHERE discount_price IS NOT NULL;

-- Passo 2: Remover as colunas redundantes
-- `discount_price` foi movido para `price`.
-- `discount_start` e `discount_end` não são mais necessários nesta estrutura simplificada.
ALTER TABLE products
DROP COLUMN IF EXISTS discount_price,
DROP COLUMN IF EXISTS discount_start,
DROP COLUMN IF EXISTS discount_end;

COMMIT;

-- =====================================================
-- VERIFICAÇÃO (opcional, para rodar manualmente)
-- =====================================================
-- SELECT
--   name,
--   price,
--   original_price
-- FROM products
-- WHERE original_price IS NOT NULL
-- LIMIT 10;
