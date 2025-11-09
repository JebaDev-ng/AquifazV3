# TODOs â€“ ExpansÃ£o do conteÃºdo da homepage

Checklist orientado pelos documentos:
- Plano: `docs/admin-content-expansion-plan.md`
- EspecificaÃ§Ã£o: `docs/admin-content-expansion-specs.md`

## 1. Banco de dados / Supabase
- [x] Criar migraÃ§Ã£o para `homepage_sections` e `homepage_section_items` com Ã­ndices e constraints descritas nos specs.
- [x] Popular tabela `homepage_sections` com os 5 registros atuais (ordem igual Ã  homepage).
- [x] Implementar script/migraÃ§Ã£o que lÃª `homepage_products` e insere os dados nas novas tabelas (respeitando `sort_order`).
- [x] Validar que todos os produtos utilizados possuem `name`, `price`, `unit`; logar e pular os invÃ¡lidos.
- [x] Atualizar seeds/mocks locais para incluir as novas tabelas.
- [x] Documentar instruÃ§Ãµes de execuÃ§Ã£o das migraÃ§Ãµes (docs + README).

## 2. APIs (`/api/admin/content/homepage-sections`)
- [x] Implementar rotas CRUD para seÃ§Ãµes (GET/POST/PUT/PATCH reorder/DELETE se necessÃ¡rio).
- [x] Implementar rotas para itens (listar, adicionar, atualizar metadata, reorder em lote, remover).
- [x] Reaproveitar middleware de autenticaÃ§Ã£o e registrar `updated_by`.
- [x] Adicionar validaÃ§Ãµes: enums (`layout_type`, `bg_color`), limites, unicidade de slug e presenÃ§a de `name/price/unit`.
- [x] Sanitizar inputs (`title`, `subtitle`, `view_all_label`) e restringir `view_all_href`/`config` Ã s opÃ§Ãµes permitidas descritas nos specs.
- [x] Integrar com `ActivityLog` (create/update/delete/reorder).
- [x] Garantir que erros retornem cÃ³digos apropriados (400/409/422).

## 3. Homepage pÃºblica (`app/page.tsx` + helpers)
- [x] Criar utilitÃ¡rio `fetchHomepageSections` em `lib/homepage-sections.ts`.
- [x] Ajustar `app/page.tsx` para usar os dados dinÃ¢micos e renderizar componentes conforme `layout_type`.
- [x] Manter fallback para mock data/legacy enquanto a feature flag nÃ£o for ativada.
- [x] Confirmar que placeholders 600Ã—800 continuam aparecendo quando nÃ£o hÃ¡ imagem.
- [x] Validar revalidate/caching apÃ³s novas queries.

## 4. Painel admin â€“ SeÃ§Ãµes
- [x] Adicionar item â€œSeÃ§Ãµes de produtosâ€ na sidebar com subitens para cada seÃ§Ã£o padrÃ£o.
- [x] Criar pÃ¡gina Ã­ndice `/admin/content/sections` com lista + drag & drop + toggles e botÃ£o â€œNova seÃ§Ã£oâ€.
- [x] Criar pÃ¡gina/aba de ediÃ§Ã£o reutilizando formulÃ¡rio descrito nos specs (tÃ­tulo, slug, layout, cor, CTA, limite, ativo).
- [x] Implementar modal de seleÃ§Ã£o de produtos com busca/paginaÃ§Ã£o e bloqueio para produtos sem `price`/`unit`.
- [x] Adicionar preview usando `FeaturedProductsSection`/`ProductsGridSection`.
- [x] Exibir mensagens claras para limite atingido e para erros vindos da API.

## 5. Painel admin â€“ Produtos
- [x] Tornar `name`, `price`, `unit` campos obrigatÃ³rios no formulÃ¡rio e na API `/api/admin/products`.
- [x] Normalizar unidades (lista prÃ©-definida ou campo adicional â€œoutrosâ€).
- [x] Atualizar cards/listas do painel para usar o placeholder 600Ã—800 quando nÃ£o houver imagem.
- [x] Garantir que novos produtos apareÃ§am nas buscas da modal de seÃ§Ãµes (filtros consistentes).

## 6. QA / Releases
- [x] Criar plano de testes cobrindo backend, admin UI e homepage conforme seÃ§Ã£o 7 dos specs.
- [x] Configurar feature flag `use_new_homepage_sections` (ou similar) e definir estratÃ©gia de rollout.
- [x] Monitorar logs pÃ³s-release para identificar rejeiÃ§Ãµes de produtos sem `price`/`unit`.
- [x] Atualizar documentaÃ§Ã£o interna com o fluxo completo (cadastro â†’ associaÃ§Ã£o na seÃ§Ã£o â†’ publicaÃ§Ã£o na home).

