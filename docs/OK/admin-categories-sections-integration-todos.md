# To-Dos – Integração de Categorias com Seções da Homepage

## Backend
- [ ] `GET /api/admin/content/homepage-sections/[sectionId]`: garantir retorno de `category_id` e `category_name`.
- [ ] `POST /api/admin/content/homepage-sections/[sectionId]/items`: comparar `section.category_id` x `product.category`; rejeitar mismatch com `422`.
- [ ] Padronizar payload de erro `CATEGORY_MISMATCH` com mensagem clara e tradução i18n.
- [ ] Ajustar `PUT /api/admin/content/homepage-sections/[sectionId]` para recalcular `view_all_href` default.
- [ ] Cobrir validação com testes unitários (mocks do repositório de produtos).
- [ ] Emitir log estruturado `section_items.category_mismatch` no Supabase Edge Function.

## Frontend – Página da Seção (`app/admin/content/sections/[sectionId]/page.tsx`)
- [ ] Atualizar hook/modal de busca para aplicar `?category=<id>` quando `category_id` estiver definido.
- [ ] Exibir badge `Categoria fixada: <nome>` com tooltip explicando restrição.
- [ ] Desabilitar botão "Limpar filtro" se `category_id` estiver presente.
- [ ] Interceptar erros `CATEGORY_MISMATCH` e mostrar toast `error` contextual.
- [ ] Recalcular CTA (`view_all_label`, `view_all_href`) ao selecionar nova categoria, preservando overrides manuais.
- [ ] Testar manualmente fluxo de adição com filtro aplicado.

## Scripts & Migração
- [ ] Criar script `scripts/classify-section-items.ts` para auditar inconsistências.
- [ ] Adicionar instruções no README/Runbook para executar o script antes do deploy.
- [ ] Preparar planilha/relatório `logs/section-category-mismatches.json` para uso do time de conteúdo.

## QA & Observabilidade
- [ ] Escrever cenários E2E (Playwright) para casos positivo/negativo.
- [ ] Atualizar checklists de QA manual com novas validações.
- [ ] Garantir rastreamento de métricas no dashboard (mismatch rate).

## Comunicação & Coordenação
- [ ] Reunião com UX para validar textos e comportamento do filtro.
- [ ] Avisar squad de conteúdo sobre nova regra antes do release.
- [ ] Atribuir responsáveis por corrigir dados legados após auditoria.
