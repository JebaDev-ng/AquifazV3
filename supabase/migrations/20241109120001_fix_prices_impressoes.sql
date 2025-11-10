-- =====================================================
-- MIGRATION: Corrigir Preços Produtos Categoria Impressões
-- Data: 2024-11-09
-- Descrição: Remove descontos e ajusta preços para valores corretos
-- =====================================================

BEGIN;

-- Atualizar preços dos produtos (usando o original_price como preço correto)
-- e remover o campo original_price para desativar descontos

UPDATE products SET price = 12.00, original_price = NULL WHERE slug = 'convite-de-casamento';
UPDATE products SET price = 7.00, original_price = NULL WHERE slug = 'convite-empresarial';
UPDATE products SET price = 8.00, original_price = NULL WHERE slug = 'convite-formatura';
UPDATE products SET price = 6.00, original_price = NULL WHERE slug = 'convite-de-aniversario';

UPDATE products SET price = 200.00, original_price = NULL WHERE slug = 'flyer';
UPDATE products SET price = 180.00, original_price = NULL WHERE slug = 'panfleto';
UPDATE products SET price = 300.00, original_price = NULL WHERE slug = 'folder-1-dobra';
UPDATE products SET price = 390.00, original_price = NULL WHERE slug = 'folder-2-dobras';

UPDATE products SET price = 160.00, original_price = NULL WHERE slug = 'papel-timbrado';
UPDATE products SET price = 80.00, original_price = NULL WHERE slug = 'cartao-de-visitas';
UPDATE products SET price = 3.00, original_price = NULL WHERE slug = 'cartao-postal';
UPDATE products SET price = 6.00, original_price = NULL WHERE slug = 'certificado';
UPDATE products SET price = 3.00, original_price = NULL WHERE slug = 'marca-pagina';

UPDATE products SET price = 60.00, original_price = NULL WHERE slug = 'apostilas';
UPDATE products SET price = 70.00, original_price = NULL WHERE slug = 'receituario';
UPDATE products SET price = 12.00, original_price = NULL WHERE slug = 'revista-com-grampo';
UPDATE products SET price = 20.00, original_price = NULL WHERE slug = 'bloco-de-anotacoes';
UPDATE products SET price = 30.00, original_price = NULL WHERE slug = 'planner-semanal';

UPDATE products SET price = 3.00, original_price = NULL WHERE slug = 'capa-de-carne';
UPDATE products SET price = 12.00, original_price = NULL WHERE slug = 'pasta-personalizada';
UPDATE products SET price = 3.50, original_price = NULL WHERE slug = 'envelope';
UPDATE products SET price = 60.00, original_price = NULL WHERE slug = 'etiquetas';
UPDATE products SET price = 2.50, original_price = NULL WHERE slug = 'solapa';
UPDATE products SET price = 2.00, original_price = NULL WHERE slug = 'tags';

UPDATE products SET price = 40.00, original_price = NULL WHERE slug = 'topo-de-bolo';
UPDATE products SET price = 6.00, original_price = NULL WHERE slug = 'aviso-de-porta';
UPDATE products SET price = 4.00, original_price = NULL WHERE slug = 'wobbler';
UPDATE products SET price = 30.00, original_price = NULL WHERE slug = 'cartela-bijuteria';
UPDATE products SET price = 4.00, original_price = NULL WHERE slug = 'lembranca-de-7-dia';

UPDATE products SET price = 15.00, original_price = NULL WHERE slug = 'calendario-de-mesa';
UPDATE products SET price = 30.00, original_price = NULL WHERE slug = 'calendario-de-parede';
UPDATE products SET price = 25.00, original_price = NULL WHERE slug = 'display-de-mesa';
UPDATE products SET price = 30.00, original_price = NULL WHERE slug = 'display-em-l';

UPDATE products SET price = 8.00, original_price = NULL WHERE slug = 'impressao-colorida-a3';
UPDATE products SET price = 2.50, original_price = NULL WHERE slug = 'impressao-colorida-a4';

COMMIT;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
SELECT 
  name,
  price,
  original_price,
  unit
FROM products
WHERE category = 'print'
ORDER BY sort_order;
