# Planejamento Integrado – Desconto por Percentual nos Produtos

## 1. Contexto & Objetivo
- Hoje o desconto depende apenas de `original_price` manual: o admin precisa calcular o valor anterior e inserir na ficha do produto.
- Isso gera erros operacionais (percentuais inconsistentes, dificuldade de promoções em massa, vitrine mostrando descontos indevidos quando `original_price` permanece preenchido).
- Objetivo: permitir que administradores definam descontos em porcentagem ou valor, mantendo consistência entre painel, APIs e vitrine pública, com validações alinhadas ao Supabase.

## 2. Estado Atual
- **Formulário** (`components/admin/products/product-form.tsx`): campo opcional `original_price` e preço atual `price`; vitrine calcula `% OFF` no client.
- **APIs** (`app/api/admin/products{,/ [id]}/route.ts`): schemas não aceitam `original_price`; qualquer envio é descartado, mantendo valores antigos no banco.
- **Banco**: tabela `products` já possui coluna `original_price` (`DECIMAL(10,2)`). Não existe `discount_percent`.
- **Admin Pricing Page** (`app/admin/products/pricing/page.tsx`): conta quantos produtos têm desconto comparando `original_price > price`.

## 3. Requisitos Funcionais
1. Administrador pode escolher entre dois modos de desconto: "Por porcentagem" ou "Por valor".
2. No modo porcentagem, informar o percentual (0–90%) calcula automaticamente `original_price` e bloqueia edição direta do campo.
3. No modo valor, o admin define explicitamente `original_price`; o sistema valida que `original_price > price`.
4. Toggle padrão desativado: produtos novos e existentes permanecem sem desconto até o admin acionar o recurso.
5. APIs aceitam atualização/remoção do desconto (incluindo `discount_percent` e `original_price: null`).
6. Vitrine continua exibindo badge de desconto calculada a partir dos dados persistidos, sem regressão visual.
7. Logs de auditoria registram mudanças de desconto (valor anterior → novo valor/percentual).
8. Relatórios em `app/admin/products/pricing/page.tsx` exibem percentuais e permitem filtrar por faixas de desconto.

## 4. Requisitos Não Funcionais
- Persistência única: `original_price` é derivado do percentual no backend para evitar divergências.
- Validação server-side com Zod garante integridade mesmo via chamadas diretas.
- Migração reversível: se necessário, remover coluna `discount_percent` sem perder `original_price` existente.
- UX responsiva, mantendo padrões de Tailwind e componentes do admin.

## 5. Modelo de Dados & Migração
### 5.1 Alterações no Supabase
```sql
ALTER TABLE products
  ADD COLUMN discount_percent NUMERIC(5,2);
```
- Default `NULL` indica ausência de desconto.
- Trigger opcional (fase 2) pode manter `original_price` em sincronia; inicialmente, lógica fica na API.

### 5.2 Migração de Dados Existentes
```sql
UPDATE products
SET discount_percent = ROUND(((original_price - price) / original_price) * 100, 2)
WHERE original_price IS NOT NULL AND original_price > price;

UPDATE products
SET original_price = NULL, discount_percent = NULL
WHERE original_price <= price;
```
- Revisar manualmente registros onde cálculo diverge do esperado (>90%).

## 6. Atualizações de API
### 6.1 `productSchema` e `productUpdateSchema`
- Adicionar campos:
  - `original_price: z.number().nullable().optional()`
  - `discount_percent: z.number().min(0).max(90).nullable().optional()`
- Regras no handler:
  - Se `discount_percent` presente:
    ```ts
    const computedOriginal = Number(((data.price ?? current.price) / (1 - discount_percent / 100)).toFixed(2))
    payload.original_price = computedOriginal
    payload.discount_percent = discount_percent
    ```
  - Se ambos enviados, validar coerência (`Math.abs(providedOriginal - computedOriginal) < 0.01`).
  - Se modo desativado: forçar `original_price = null`, `discount_percent = null`.
- Garantir que `PUT`/`POST` retornem novos campos e loguem atividade `discount_updated`.

## 7. Ajustes no Admin UI
### 7.1 Formulário de Produto
- Novo grupo "Estratégia de desconto" com radio buttons:
  - `Nenhum desconto` (default)
  - `Por valor` → habilita campo `original_price` (com validação).
  - `Por porcentagem` → habilita campo `discount_percent`; mostra `original_price` calculado (read-only) + badge preview.
- Atualizar `useForm` para lidar com ambos os campos e sincronizar `discountEnabled` com `discountMode`.
- Mostrar ajuda contextual: "Você verá o rótulo %OFF na vitrine quando o preço original for maior que o atual".

### 7.2 Página de Gestão de Preços
- Novas colunas/opções de filtro por `discount_percent`.
- Card resumo mostra: `Produtos com desconto (%)`, `Média de desconto`, `Maior desconto ativo`.

## 8. Ajustes na Vitrine Pública
- No componente `ProductCard`/`FeaturedProductsSection`, exibir `discount_percent` quando disponível (para evitar recálculos repetidos).
- Fallback: caso `discount_percent` ausente, continuar calculando com base em `original_price` e `price` (garantia de compatibilidade).

## 9. Observabilidade & QA
- Atualizar `logActivity` para incluir mudanças de `discount_percent`.
- Criar testes manuais cobrindo: criação de desconto %, remoção, inconsistências (bloqueio quando `original_price <= price`).
- Check-list QA em staging: vitrine, pricing dashboard, chamadas API via Thunder Client.

## 10. Plano de Entrega
1. **Migração & Tipos**
   - Criar SQL + atualizar `lib/types.ts` (`discount_percent?: number | null`).
2. **API**
   - Atualizar schemas e handlers (`POST`/`PUT`).
   - Ajustar logging.
3. **Admin UI**
   - Refatorar formulário para novo modo de desconto.
   - Atualizar tela de preços.
4. **Storefront**
   - Adaptar cards e seções para usar `discount_percent` quando existir.
5. **QA & Rollout**
   - População inicial: decidir se mantém descontos via script ou zera tudo.
   - Testes regressivos + validação com stakeholders.

## 11. Backlog de Tarefas
| Ordem | Tarefa | Responsável sugerido | Notas |
| --- | --- | --- | --- |
| 1 | Escrever migração Supabase adicionando `discount_percent` | Backend | Incluir script de backfill seguro |
| 2 | Atualizar `lib/types.ts` e helpers (`lib/admin/homepage-sections` se depender de preço) | Backend | Garantir tipos compartilhados |
| 3 | Ajustar schemas e lógica em `app/api/admin/products{,/ [id]}/route.ts` | Backend | Cobrir cenários com/sem percentual |
| 4 | Refatorar `product-form.tsx` para suportar modos de desconto | Frontend | Reutilizar componentes existentes, manter Tailwind |
| 5 | Atualizar `app/admin/products/pricing/page.tsx` com métricas de percentuais | Frontend | Incluir filtros por faixa |
| 6 | Revisar componentes públicos (`components/ui/product-card.tsx`, `app/page.tsx` fetchers) | Frontend | Preferir usar `discount_percent` direto |
| 7 | Atualizar documentação (`docs/` + onboarding) | Tech Writer | Explicar novo fluxo |
| 8 | QA manual + checklist regressivo | QA | Cobrir desconto por % e valor |
| 9 | Planejar rollout (comunicar time de conteúdo) | PM | Definir data e passos |

## 12. Riscos & Mitigações
- **Divergência de valores**: manter cálculo único no backend evita inconsistências.
- **Dados antigos com descontos inválidos**: script de backfill + dashboard para localizar anomalias.
- **Complexidade para o admin**: interface clara com modos distintos e mensagens de ajuda minimiza erros.
- **Rollback**: manter `original_price` garante compatibilidade; basta ignorar `discount_percent` se reverter.

## 13. Próximos Passos
1. Validar este planejamento com stakeholders (produto + conteúdo).
2. Abrir issues correspondentes às tarefas 1–9 no tracker.
3. Agendar janela de migração e preparar comunicação para o time de conteúdo.
