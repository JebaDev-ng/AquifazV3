# TODOs de Refatoração da Aplicação

Este documento descreve as tarefas de refatoração para melhorar a consistência e a manutenibilidade da aplicação, com base na análise do código, da estrutura do banco de dados e do planejamento de novas funcionalidades.

## Tarefa 1: Implementar Desconto por Percentual e Simplificar a Lógica de Preços

**Objetivo:** Substituir o cálculo manual de descontos por um sistema que permita ao administrador definir descontos em porcentagem ou valor, garantindo consistência entre o painel administrativo, APIs e a vitrine pública.

**Problema Atual:** A tabela `products` possui os campos `price`, `original_price`, e `discount_price`, o que gera confusão e erros operacionais. O desconto depende de um `original_price` manual, tornando difícil a gestão de promoções em massa.

**Solução Proposta:**
Adicionar a coluna `discount_percent` à tabela `products` e centralizar a lógica de cálculo no backend. O administrador poderá escolher entre:
- **Nenhum desconto**: `original_price` e `discount_percent` são `NULL`.
- **Desconto por valor**: O admin define `original_price` manualmente, que deve ser maior que `price`. `discount_percent` é `NULL`.
- **Desconto por porcentagem**: O admin define um `discount_percent` (0-90%), e o `original_price` é calculado e salvo automaticamente no backend.

### Plano de Ação

1.  **Criar um Script de Migração (SQL):**
    - O script deverá ser criado em `supabase/migrations/`.
    - **Passo 1.1:** Adicionar a nova coluna `discount_percent`.
      ```sql
      ALTER TABLE products
      ADD COLUMN discount_percent NUMERIC(5,2);
      ```
    - **Passo 1.2:** Migrar os dados existentes para a nova estrutura.
      ```sql
      -- 1. Garante que o preço de venda final (price) seja o preço com desconto, se ele existir.
      UPDATE products
      SET price = COALESCE(discount_price, price)
      WHERE discount_price IS NOT NULL;

      -- 2. Calcula o discount_percent para produtos que já possuem um desconto válido.
      UPDATE products
      SET discount_percent = ROUND(((original_price - price) / original_price) * 100, 2)
      WHERE original_price IS NOT NULL AND original_price > price;

      -- 3. Limpa dados de descontos inválidos.
      UPDATE products
      SET original_price = NULL, discount_percent = NULL
      WHERE original_price <= price;
      ```
    - **Passo 1.3:** Remover as colunas redundantes.
      ```sql
      -- Remove as colunas que não serão mais usadas.
      ALTER TABLE products
      DROP COLUMN IF EXISTS discount_price,
      DROP COLUMN IF EXISTS discount_start,
      DROP COLUMN IF EXISTS discount_end;
      ```

2.  **Atualizar o Código da Aplicação:**
    - **Tipos (TypeScript):**
        - Atualizar o tipo `Product` em `lib/types.ts` para remover `discount_price`, `discount_start`, `discount_end` e adicionar `discount_percent?: number | null`.
    - **Backend (API Routes):**
        - Em `app/api/admin/products{,/[id]}/route.ts`, atualizar os schemas Zod (`productSchema`, `productUpdateSchema`) para aceitar `discount_percent` e `original_price`.
        - Implementar a lógica no handler da API para:
            - Calcular `original_price` se `discount_percent` for fornecido.
            - Validar se `original_price > price` quando o desconto for por valor.
            - Nulificar `original_price` e `discount_percent` quando o desconto for desativado.
    - **Frontend (Componentes do Admin):**
        - **`components/admin/products/product-form.tsx`**: Refatorar o formulário para incluir um seletor de "Estratégia de desconto" (Nenhum, Por valor, Por porcentagem) e exibir os campos condicionalmente.
        - **`app/admin/products/pricing/page.tsx`**: Atualizar a página de gestão de preços para exibir métricas baseadas em `discount_percent` e permitir filtros por faixa de desconto.
    - **Frontend (Vitrine Pública):**
        - **`components/ui/product-card.tsx`**: Adaptar o card de produto para usar `discount_percent` para exibir o badge de desconto, com fallback para o cálculo manual se `original_price` existir.

---

## Tarefa 2: Avaliar a Padronização de Chaves Primárias (PK)

**Objetivo:** Analisar a viabilidade de padronizar o uso de `UUID` como chave primária em tabelas principais para melhorar a consistência das relações no banco de dados.

**Problema Atual:** Tabelas como `product_categories` e `homepage_sections` usam `TEXT` (slug) como PK, enquanto `products` usa `UUID`. Isso é funcional, mas pode complicar joins e a padronização da API no futuro.

**Solução Proposta:**
Avaliar o impacto de migrar as chaves primárias de `TEXT` para `UUID` e, se for seguro, executar a migração.

### Plano de Ação

Esta é uma operação de maior risco e deve ser feita com cuidado.

1.  **Análise de Impacto para `product_categories`:**
    - **Passo 2.1:** Identificar todas as referências à chave `product_categories.id`.
        - **Banco de Dados:** Verificar chaves estrangeiras, como `products.category` (que é `TEXT`).
        - **Código:** Fazer uma busca global por `product.category` e `category.id` para mapear todos os pontos de uso no frontend e backend (ex: filtros de produtos, URLs, formulários).
    - **Passo 2.2:** Documentar os arquivos e as alterações necessárias. A mudança exigiria:
        - Adicionar uma nova coluna `category_id (UUID)` na tabela `products`.
        - Criar um script para popular esta nova coluna com base na relação `products.category` (TEXT) -> `product_categories.id` (TEXT).
        - Alterar a PK de `product_categories` e atualizar a chave estrangeira em `products`.
        - Atualizar todo o código da aplicação para usar a nova chave UUID.

2.  **Análise de Impacto para `homepage_sections`:**
    - **Passo 2.3:** Repetir o processo de análise para a tabela `homepage_sections` e suas relações (ex: `homepage_section_items`).

3.  **Decisão e Execução:**
    - Com base na análise, decidir se a migração é viável sem quebrar a aplicação.
    - **Se for viável:** Criar os scripts de migração e fazer as alterações no código em um branch separado, com testes rigorosos.
    - **Se não for viável (alto risco):** Manter o modelo atual e adotar o padrão `UUID` apenas para novas tabelas. A consistência em tabelas existentes pode ser um débito técnico aceitável para garantir a estabilidade.

---
