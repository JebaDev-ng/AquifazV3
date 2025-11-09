# Plano de QA e Release — Expansão de Conteúdo da Homepage

Este guia centraliza os testes, o rollout controlado e as verificações pós-release para a nova gestão de seções da homepage descrita em `docs/admin-content-expansion-plan.md` e `docs/admin-content-expansion-specs.md`.

## 1. Feature flag `use_new_homepage_sections`
- **Onde fica**: registro `content_sections.id = 'homepage_settings'` no Supabase. Campo `data` (JSON) deve conter `use_new_homepage_sections: true | false`.
- **Valor default**: `true` (ver `DEFAULT_HOMEPAGE_SETTINGS`). Defina como `false` para forçar o site a renderizar o fallback antigo (mock data) sem tocar as novas tabelas.
- **Script SQL exemplo**:
  ```sql
  update content_sections
  set data = jsonb_set(
        coalesce(data, '{}'::jsonb),
        '{use_new_homepage_sections}',
        'true'::jsonb,
        true
      )
  where id = 'homepage_settings';
  ```
- **Rollout sugerido**:
  1. Ambiente de homologação: `use_mock_data = false`, `use_new_homepage_sections = true`.
  2. Produção fase 1: manter `use_new_homepage_sections = false`, validar migrações e popular todas as seções.
  3. Produção fase 2: ativar flag e monitorar (ver seção 3). Caso seja necessário rollback, basta voltar o flag para `false` (sem deploy).

## 2. Plano de testes (mapa para a seção 7 dos specs)

### Backend / APIs
- Executar migração limpa (`supabase db reset` ou `supabase db push`) e confirmar criação de `homepage_sections` + `homepage_section_items`.
- `/api/admin/content/homepage-sections`:
  - CRUD completo, incluindo validações de slug duplicado, enums (`layout_type`, `bg_color`) e limites.
  - `PATCH /:id/reorder` e `/items/reorder` com tentativas com/sem permissão.
- `/api/admin/products`:
  - `POST` sem `price` ou `unit` retorna 422 (ver logs). Payload válido cria produto com `updated_by`.
  - `PUT` impedindo que produtos existentes fiquem sem `name/price/unit`.
  - Verificar ActivityLog para create/update/delete.

### Admin UI
- `/admin/content/sections`:
  - Lista todas as seções, drag & drop persiste ordem, toggle ativa/desativa.
  - Botão “Nova seção” salva campos obrigatórios.
- Página de edição:
  - Form impede salvar sem `title` ou `view_all_href`.
  - Modal “Adicionar produto” bloqueia itens sem preço/unidade (ver tooltip).
  - Preview renderiza `FeaturedProductsSection`/`ProductsGridSection` fielmente.
- `/admin/products`:
  - Criar/editar exige `name`, `price`, `unit`.
  - Cards usam placeholder 600×800 quando não há imagem.

### Homepage pública
- Flag desligada: homepage usa mock data sem acessar as novas tabelas.
- Flag ligada:
  - Ordem das seções respeita `sort_order`, e `is_active = false` oculta a seção.
  - Placeholders 600×800 aparecem quando produtos não têm imagem.
  - `revalidate` (3600s) atualiza conteúdo em <= 1 minuto ao chamar `npm run dev` + edição no painel.

### Integração / Regressão
- Testar login como `viewer` para garantir que APIs protegidas retornem 403.
- Confirmar que scripts/mocks (`lib/homepage-sections.ts`) continuam retornando dados quando Supabase está offline.

## 3. Monitoramento pós-release
- Os endpoints de produto registram no log mensagens como:
  ```
  [admin/products] payload rejeitado (POST /api/admin/products) { missingFields: ['price','unit'] }
  ```
  Use-as para identificar cadastros incorretos após a virada (Vercel/Next logs ou Supabase Edge Functions ➝ Logs HTTP).
- Configurar alerta simples (ex.: Slack ou email) filtrando por `payload rejeitado` para reagir rapidamente a cadastros inválidos.
- Revisar `ActivityLog` de `homepage_section` e `homepage_section_item` buscando ações inesperadas depois de ativar a flag.

## 4. Fluxo ponta a ponta (documentação interna)
1. **Cadastro do produto** — `/admin/products/new`
   - Preencher `name`, `price`, `unit`. Sem esses campos o formulário não envia.
   - Subir imagens; caso não haja, o card exibirá o placeholder padrão.
2. **Associação à seção** — `/admin/content/sections/:id`
   - Salvar a seção (ou garantir que já exista).
   - Abrir “Adicionar produto”, buscar pelo nome e adicionar apenas itens válidos.
   - Reordenar conforme o layout e salvar.
3. **Publicação na home**
   - Ativar a seção (`is_active = true`) e ajustar CTA/link.
   - Se `use_new_homepage_sections = true`, a homepage refletirá a mudança após o `revalidate`.
   - Em caso de rollback, setar a flag para `false` e o site volta ao fallback antigo sem intervenção adicional.

## 5. Checklist de release
**Antes da ativação**
- [ ] Migrações executadas em produção.
- [ ] Todas as seções preenchidas com ao menos 3 produtos válidos.
- [ ] QA manual concluído nos cenários de backend/admin/homepage (lista acima).
- [ ] `homepage_settings` com `use_mock_data = false`, `use_new_homepage_sections = false` (pré-switch).

**Switch**
- [ ] Ativar `use_new_homepage_sections = true`.
- [ ] Forçar revalidate manual (`curl https://site.com/api/revalidate?path=/`) ou aguardar 60s.

**Após ativação**
- [ ] Monitorar logs durante as primeiras 24h (especialmente rejeições de `price`/`unit`).
- [ ] Confirmar ActivityLog e analytics (cliques nos CTAs).
- [ ] Atualizar este checklist com qualquer incidente/rollback executado.

Com este plano, os itens da seção 6 do TODO ficam cobertos e o time possui instruções claras para QA, rollout e operação contínua.

