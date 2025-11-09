# Plano para administrar todas as seções da homepage

## Objetivo
- Permitir que o time edite diretamente no painel admin todas as seções de produtos exibidas na homepage pública (`Produtos em destaque`, `Mais vendidos`, `Impressão`, `Adesivos`, `Banners & Fachadas`) além das já existentes (`Hero` e `Banners`).
- Centralizar a configuração no Supabase para que o site público, o painel e os dados de mock mantenham comportamento consistente e tenham fallback seguro.

## Estado atual (08/11/2025)
- Admin: somente páginas `/admin/content/hero` e `/admin/content/banners` com APIs em `/api/admin/content/hero|banner`.
- Homepage (`app/page.tsx`) consome dados diretos de Supabase:
  - `getFeaturedShowcaseProducts` busca `homepage_products` (filtro `featured`).
  - `getProducts` usa `homepage_products` (filtro `show_on_home`).
  - `getProductsByCategory('<category>')` usa `homepage_products` por categoria (`print`, `adesivos`, `banners`).
  - Mock data cobre todos os cenários quando `use_mock_data` ou Supabase indisponível.
- Não existe API/admin para manter `homepage_products`, logo os blocos usam dados fixos ou flags manualmente inseridas no banco.

## Requisitos funcionais
1. Administrar quais produtos compõem cada seção, respeitando limites de itens (3 para os cards exibidos na home); o link “Ver todos” continua apontando para uma listagem completa sem limite.
2. Definir ordem dos produtos de cada seção.
3. Permitir ativar/desativar uma seção sem precisar remover dados (para fallback).
4. Exibir prévia no painel com dados reais.
5. Suportar modo mock data sem quebrar as novas configurações.
6. Permitir editar os títulos/subtítulos das seções, mantendo valores padrão (`Produtos em destaque`, `Mais vendidos`, `Impressão`, `Adesivos`, `Banners & Fachadas`) apenas como sugestão inicial.
7. Possibilitar a criação de novas seções personalizadas (ex.: “Lançamentos 2025”) sem depender de deploy, inclusive definindo slug, limite e link “Ver todos”.
8. Controlar a ordem em que as seções aparecem e permitir customizar o CTA de listagem (`view_all_label`, `view_all_href`) e opções visuais como fundo claro/cinza.
9. Não alterar/inventar frontend: todas as seções devem renderizar exatamente com os componentes já usados na homepage (`FeaturedProductsSection`, `ProductsGridSection`, `ImageBannerSection`), garantindo consistência pixel-perfect.
10. Respeitar fielmente o layout atual dos cards: placeholder 600x800 permanece até que o admin envie imagem; caso contrário, o texto “600 x 800 pixels” precisa continuar visível e o card deve mostrar nome + “A partir de” + `R$ {preço}/ {unidade}` exatamente como na home.

## Proposta de arquitetura

### 1. Modelo de dados
- **Nova tabela `homepage_sections`**  
  | coluna | tipo | descrição |
  | --- | --- | --- |
| `id` (PK) | text | slug (`featured_showcase`, `best_sellers`, `print`, `sticker`, `banners_fachadas`, ou customizados criados pelo admin) |
| `title` | text | título editável exibido na home (preenchido com os nomes padrão na criação, mas sempre customizável) |
| `subtitle` | text | opcional (ex.: texto auxiliar) |
| `category_id` | text? | usado quando a seção é baseada em categoria (print/adesivos/banners) |
| `limit` | int | número máximo de produtos (default 3 visíveis) |
| `view_all_label` | text | rótulo do CTA (default `Ver todos`) |
| `view_all_href` | text | URL completa do CTA (default `/produtos` ou query de categoria) |
| `bg_color` | text | `white` ou `gray`, alinhado com `ProductsGridSection` |
| `layout_type` | text | `featured` (usa `FeaturedProductsSection`) ou `grid` (usa `ProductsGridSection`) |
| `sort_order` | int | posição da seção na home |
| `is_active` | bool | liga/desliga seção |
| `config` | jsonb | espaço para customizações futuras (cores extras, badges, etc.) |
| `created_at/updated_at/updated_by` | timestamps |

- **Nova tabela `homepage_section_items`**  
  | coluna | tipo | descrição |
  | --- | --- | --- |
  | `id` (PK) | uuid |  |
  | `section_id` (FK) | references `homepage_sections.id` |  |
  | `product_id` (FK) | references `products.id` | produto selecionado |
  | `sort_order` | int | controle de posição |
  | `created_at/updated_at/updated_by` | timestamps |
  | `metadata` | jsonb | espaço para rótulos adicionais (ex.: badge “Novo”) |
  - Restrições: `unique(section_id, product_id)` e `sort_order` único por seção.

- **Migração de dados**  
  - Popular `homepage_sections` com registros padrões (titulos atuais).  
  - Para não perder lógica existente: criar job que leia `homepage_products` e preencha `homepage_section_items`, ou usar script manual.
  - Manter `homepage_products` por enquanto para compatibilidade, mas planejar desativação quando o novo modelo estiver consolidado.
  - Garantir que todos os produtos ligados às seções possuam `name`, `price`, `unit`; se `image_url` estiver vazio o front mantém o placeholder 600x800 (não devemos tentar gerar thumbs automáticas).

### 2. APIs (Next.js /app/api)
- `GET /api/admin/content/homepage-sections` -> retorna lista de seções com itens (join produtos básicos: id, nome, slug, preço, categoria, thumbnail).
- `PUT /api/admin/content/homepage-sections/:id` -> atualiza dados gerais (title, subtitle, is_active, limit, config).
- `POST /api/admin/content/homepage-sections/:id/items` -> adiciona produto à seção (valida limite).
- `PATCH /api/admin/content/homepage-sections/:id/items/:itemId` -> atualiza `sort_order` ou metadados.
- `DELETE /api/admin/content/homepage-sections/:id/items/:itemId` -> remove item.
- Implementar handlers utilizando Supabase service role (reutilizar helpers e validações de `hero`/`banner`).
- Atualizar `lib/types.ts` com novos tipos (`HomepageSection`, `HomepageSectionItem`) e `lib/content.ts` com defaults e constantes de IDs.

### 3. Atualização do site público (`app/page.tsx`)
- Substituir chamadas a `getFeaturedShowcaseProducts`, `getProducts`, `getProductsByCategory` por uma única `getHomepageSections()` que lê `homepage_sections` + itens.
- Implementar cache/fallback: se consulta falhar retorna mock (usar defaults novos para cada seção).
- Ajustar componentes `FeaturedProductsSection` e `ProductsGridSection` para receber `title`/`subtitle` vindos da seção (em vez de strings fixas).
- Manter compatibilidade com dados antigos enquanto migração não terminar (feature flag `USE_LEGACY_HOMEPAGE_PRODUCTS` ou fallback no fetch).

### 4. Painel admin
- **Sidebar:** adicionar item “Seções de produtos” dentro de Conteúdo com:
  - Uma página índice listando todas as seções cadastradas (padrão + custom), com botão “Nova seção”.
  - Subitens rápidos pré-configurados para as seções padrão (`Produtos em destaque`, `Mais vendidos`, `Impressão`, `Adesivos`, `Banners & Fachadas`) para facilitar acesso direto.
- **Páginas individuais** (pode reciclar o mesmo componente base):
  - Header com título/subtítulo editáveis, toggle `is_active` e botão salvar.
  - Campos para `view_all_label`, `view_all_href`, escolha de layout (`featured`/`grid`) e `bg_color`.
  - Lista ordenável (drag & drop) de produtos selecionados com cards (nome, categoria, preço, thumbnail).
  - Botão “Adicionar produto” abre modal com busca (usar endpoint existente de produtos ou `select * from products` com filtros).
  - Limitar número de itens conforme `limit`; avisar quando atingir.
  - Preview reutilizando `FeaturedProductsSection`/`ProductsGridSection` em modo mock, para garantir consistência visual e evitar qualquer alteração de layout definida na homepage.
- **Página índice:** permitir reordenar as seções (drag & drop que alimenta `sort_order`) e ativar/desativar rapidamente.
- **Validacoes:** impedir duplicados, exigir pelo menos 1 produto quando `is_active=true`, refletir erros da API (toast) e garantir que cada item tenha `name`, `price` e `unit` definidos (sem esses campos o card nao segue o padrao da homepage).

### 5. Segurança e auditoria
- Reutilizar middleware/auth já aplicado às outras rotas admin.
- Atualizar `audit log` se existir (ver `lib/types.ts` -> `ActivityLog`).
- Sanitizar entradas (`title`, `subtitle`) e restringir `config` a chaves conhecidas (p. ex. `cta_label`, `view_all_href`).

## Plano de entrega incremental
1. **Preparação**
   - Confirmar esquema atual de `homepage_products`.
   - Escrever migração SQL (Supabase) para criar novas tabelas e popular dados iniciais.
2. **Camada de dados/serviços**
   - Criar utilitários em `lib/homepage-sections.ts` com funções `fetchHomepageSections`, `upsertSection`, `reorderSectionItems`.
3. **APIs**
   - Adicionar rotas REST mencionadas acima com testes manuais via Thunder Client/Insomnia.
4. **Site público**
   - Trocar consumo para novas funções, preservar fallback.
   - Validar SSR/revalidate.
5. **Admin UI**
   - Criar páginas e atualizar sidebar (componentes reutilizáveis para formulário e lista ordenável).
   - Incluir loading states e mensagens de erro.
6. **QA & rollout**
   - Feature flag (`use_new_homepage_sections`) para ativar quando todas as seções estiverem populadas.
   - Escrever checklist de testes (mock data on/off, seção desativada, reordenação, remoção de produto, permissões).

## Riscos / itens em aberto
- Necessidade de paginação e busca eficiente de produtos (coleções grandes). Avaliar limitações ao montar modal de seleção.
- Garantir que múltiplos administradores não sobrescrevam ordem simultaneamente (usar `updated_at` e `if-match` ou otimismo).
- Decidir prazo de desativação do modelo antigo `homepage_products` para evitar duplicidade.
- Confirmar se “Mais vendidos” continuará sendo editável manualmente ou se deve continuar automático (se for automático, talvez bastar somente mostrar métricas em vez de edição manual).
- Seções customizadas podem requerer layouts além de `featured`/`grid` (ex.: carrossel); definir se suportaremos via `layout_type` ou deixaremos para uma fase 2.
- **Pricing Section** continua 100% hardcoded (`components/ui/pricing/pricing-section.tsx`); decidir se entra no escopo deste esforço ou em fase futura (editor de planos + API).

## Próximos passos imediatos
1. Validar com stakeholders se o modelo proposto (seções + itens) cobre todos os casos ou se desejam mais campos (ex.: CTAs próprios por seção).
2. Após validação, abrir tarefas técnicas separadas (DB, backend, frontend admin, homepage) no tracker do time.
3. Definir janela de manutenção para executar migração e popular dados.

## Sugestões extras após nova revisão
- Criar um “designer” simples para o bloco de preços (tabela de planos) seguindo o mesmo padrão de APIs/admin futuros.
- Revisar seções de categorias e banner para reutilizar o novo modelo (ex.: permitir múltiplas faixas no futuro).
- Monitorar o impacto de seções desativadas na home (Analytics, SEO) e considerar logs para entender uso dessas personalizações.
- Ajustar o fluxo de cadastro/edição em `/admin/products` para exigir `name`, `price` e `unit`, além de mostrar o preview com o mesmo placeholder 600x800 usado na homepage quando não houver imagem.

