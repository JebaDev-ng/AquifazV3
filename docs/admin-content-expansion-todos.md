# TODOs – Expansão do conteúdo da homepage

Checklist orientado pelos documentos:
- Plano: `docs/admin-content-expansion-plan.md`
- Especificação: `docs/admin-content-expansion-specs.md`

## 1. Banco de dados / Supabase
- [x] Criar migração para `homepage_sections` e `homepage_section_items` com índices e constraints descritas nos specs.
- [x] Popular tabela `homepage_sections` com os 5 registros atuais (ordem igual à homepage).
- [x] Implementar script/migração que lê `homepage_products` e insere os dados nas novas tabelas (respeitando `sort_order`).
- [x] Validar que todos os produtos utilizados possuem `name`, `price`, `unit`; logar e pular os inválidos.
- [x] Atualizar seeds/mocks locais para incluir as novas tabelas.
- [x] Documentar instruções de execução das migrações (docs + README).

## 2. APIs (`/api/admin/content/homepage-sections`)
- [x] Implementar rotas CRUD para seções (GET/POST/PUT/PATCH reorder/DELETE se necessário).
- [x] Implementar rotas para itens (listar, adicionar, atualizar metadata, reorder em lote, remover).
- [x] Reaproveitar middleware de autenticação e registrar `updated_by`.
- [x] Adicionar validações: enums (`layout_type`, `bg_color`), limites, unicidade de slug e presença de `name/price/unit`.
- [x] Sanitizar inputs (`title`, `subtitle`, `view_all_label`) e restringir `view_all_href`/`config` às opções permitidas descritas nos specs.
- [x] Integrar com `ActivityLog` (create/update/delete/reorder).
- [x] Garantir que erros retornem códigos apropriados (400/409/422).

## 3. Homepage pública (`app/page.tsx` + helpers)
- [x] Criar utilitário `fetchHomepageSections` em `lib/homepage-sections.ts`.
- [x] Ajustar `app/page.tsx` para usar os dados dinâmicos e renderizar componentes conforme `layout_type`.
- [x] Manter fallback para mock data/legacy enquanto a feature flag não for ativada.
- [x] Confirmar que placeholders 600×800 continuam aparecendo quando não há imagem.
- [x] Validar revalidate/caching após novas queries.

## 4. Painel admin – Seções
- [x] Adicionar item “Seções de produtos” na sidebar com subitens para cada seção padrão.
- [x] Criar página índice `/admin/content/sections` com lista + drag & drop + toggles e botão “Nova seção”.
- [x] Criar página/aba de edição reutilizando formulário descrito nos specs (título, slug, layout, cor, CTA, limite, ativo).
- [x] Implementar modal de seleção de produtos com busca/paginação e bloqueio para produtos sem `price`/`unit`.
- [x] Adicionar preview usando `FeaturedProductsSection`/`ProductsGridSection`.
- [x] Exibir mensagens claras para limite atingido e para erros vindos da API.

## 5. Painel admin – Produtos
- [ ] Tornar `name`, `price`, `unit` campos obrigatórios no formulário e na API `/api/admin/products`.
- [ ] Normalizar unidades (lista pré-definida ou campo adicional “outros”).
- [ ] Atualizar cards/listas do painel para usar o placeholder 600×800 quando não houver imagem.
- [ ] Garantir que novos produtos apareçam nas buscas da modal de seções (filtros consistentes).

## 6. QA / Releases
- [ ] Criar plano de testes cobrindo backend, admin UI e homepage conforme seção 7 dos specs.
- [ ] Configurar feature flag `use_new_homepage_sections` (ou similar) e definir estratégia de rollout.
- [ ] Monitorar logs pós-release para identificar rejeições de produtos sem `price`/`unit`.
- [ ] Atualizar documentação interna com o fluxo completo (cadastro → associação na seção → publicação na home).
