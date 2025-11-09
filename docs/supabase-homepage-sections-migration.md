# Guia de migração – Homepage Sections

Este passo a passo explica como aplicar a migração `20241108190000_homepage_sections.sql` no Supabase (ou em ambientes locais) para habilitar o novo gerenciamento das seções da homepage.

## Pré-requisitos
- Projeto Supabase já configurado com as migrações anteriores do repositório.
- Tabela `products` populada com os produtos que serão exibidos nas seções (necessário para vincular os itens).
- Supabase CLI configurada **ou** acesso ao SQL Editor do painel.

## Passos usando Supabase CLI
1. Garanta que o arquivo `.env.local` (ou `.env`) contém `SUPABASE_SERVICE_ROLE_KEY` para que o CLI consiga aplicar as migrações.
2. Rode as migrações pendentes:
   ```bash
   supabase migration up
   ```
   Isto executará todos os arquivos dentro de `supabase/migrations/`, incluindo `20241108190000_homepage_sections.sql`.
3. Verifique se as tabelas foram criadas:
   ```bash
   supabase db remote commit --status
   ```
   ou cheque diretamente via SQL:
   ```sql
   select * from homepage_sections;
   select * from homepage_section_items;
   ```

## Passos usando o SQL Editor do Supabase
1. Abra o painel do Supabase → SQL Editor.
2. Copie o conteúdo completo de `supabase/migrations/20241108190000_homepage_sections.sql`.
3. Execute o script. Ele irá:
   - Criar `homepage_sections` e `homepage_section_items`.
   - Inserir os cinco registros padrão (Produtos em destaque, Mais vendidos, Impressão, Adesivos, Banners & Fachadas).
   - Migrar, quando possível, os dados de `homepage_products` para a nova estrutura (mapeando pelos `slug` existentes em `products`).
4. Revise o log do editor. Caso existam `NOTICE` informando produtos sem correspondência, cadastre esses produtos manualmente antes de associá-los às seções.

## Ambiente Docker/local
- O arquivo `docker/schema-docker.sql` já foi atualizado com as mesmas definições. Se você usa o stack Docker, basta reinicializar o banco local (`docker compose down -v && docker compose up -d`) para aplicar o novo schema.

## Pós-migração
1. Confirme que as novas tabelas contêm registros:
   ```sql
   select id, title, sort_order from homepage_sections order by sort_order;
   select section_id, product_id, sort_order from homepage_section_items order by section_id, sort_order;
   ```
2. Caso deseje resetar as seções, basta `TRUNCATE homepage_section_items` e repopular via painel admin (quando disponível).
3. Continue com as próximas etapas do plano (APIs e ajustes de frontend) após a migração ser aplicada em todos os ambientes.
