# Especificação técnica – Expansão do conteúdo da homepage

Este documento descreve os requisitos técnicos necessários para implementar o plano definido em `docs/admin-content-expansion-plan.md`. Serve como referência direta para devs backend, frontend (admin e site público) e QA.

## 1. Escopo
- **Incluso**
  - Nova infraestrutura para gerenciar as seções de produtos da homepage via painel admin.
  - APIs REST em `/api/admin/content/homepage-sections`.
  - Migração de dados no Supabase (novas tabelas + seed inicial + script de migração a partir de `homepage_products`).
  - Ajustes no site público (`app/page.tsx`) para consumir as novas estruturas sem alterar o layout existente.
  - Validações e UX no cadastro de produtos (`/admin/products`) para garantir os campos mínimos exigidos pelos cards.
- **Fora do escopo**
  - Reformulação do layout público (deve permanecer exatamente o já publicado).
  - Editor de Hero/Banner (já existem).
  - Painel Analytics/Logs (apenas registrar necessidade futura quando aplicável).

## 2. Modelo de dados

### 2.1 Tabela `homepage_sections`
| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | text (PK) | slug único; defaults sugeridos: `featured_showcase`, `best_sellers`, `print`, `sticker`, `banners_fachadas`. |
| `title` | text | obrigatório; default com os rótulos atuais da homepage. |
| `subtitle` | text | opcional. |
| `layout_type` | text | enum: `featured`, `grid`. |
| `bg_color` | text | enum: `white`, `gray`. |
| `limit` | int2 | default 3 (número de cards renderizados). |
| `view_all_label` | text | default `Ver todos`. |
| `view_all_href` | text | default `/produtos` ou `/produtos?category=<id>`. |
| `category_id` | text | opcional; usado apenas quando a seção representa uma categoria fixa. |
| `sort_order` | int2 | obrigatório; controla a ordenação final. |
| `is_active` | boolean | default true. |
| `config` | jsonb | default `{}`. Deve armazenar apenas chaves conhecidas (ex.: `badgeLabel`). |
| `created_at` | timestamptz | default now(). |
| `updated_at` | timestamptz | trigger de atualização. |
| `updated_by` | uuid | referência ao usuário autenticado (FK opcional para `profiles.id`). |

Índices: `pk_homepage_sections`, `idx_homepage_sections_sort_order`, `idx_homepage_sections_active`.

### 2.2 Tabela `homepage_section_items`
| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | uuid (PK) | gerado via `gen_random_uuid()`. |
| `section_id` | text | FK → `homepage_sections.id` (ON DELETE CASCADE). |
| `product_id` | uuid | FK → `products.id`. |
| `sort_order` | int2 | obrigatório. |
| `metadata` | jsonb | default `{}`. |
| `created_at/updated_at/updated_by` | timestamptz / uuid | mesmos padrões da tabela pai. |

Constraints: `unique(section_id, product_id)` e `unique(section_id, sort_order)`.

### 2.3 Migração & seed
1. Criar ambas as tabelas e índices.
2. Popular `homepage_sections` com os 5 registros atuais (usar `sort_order` baseado na ordem da homepage).
3. Script de migração:
   - Ler `homepage_products` (quando existir).
   - Para cada linha, mapear:
     - `featured=true` → `featured_showcase`.
     - `show_on_home=true` → `best_sellers`.
     - `category_id` ∈ {`print`, `adesivos`, `banners`} → respectivas seções.
   - Gerar `homepage_section_items` respeitando `sort_order`.
4. Garantir que cada produto usado tenha `name`, `price`, `unit`. Se faltarem dados, registrar no log e pular item (será tratado manualmente).
5. `image_url` vazio **não** deve ser modificado – o frontend continua exibindo o placeholder 600×800.

## 3. APIs

Base: `/api/admin/content/homepage-sections`

| Método & rota | Corpo esperado | Resposta | Notas |
| --- | --- | --- | --- |
| `GET /` | – | `{ sections: HomepageSectionWithItems[] }` | Inclui itens ordenados + dados mínimos do produto (id, name, slug, price, unit, image_url). |
| `POST /` | `{ id?, title, layout_type, bg_color, limit, view_all_label, view_all_href, category_id?, sort_order?, subtitle?, config?, is_active? }` | `{ section }` | `id` opcional (gerar slug server-side). Deve validar unicidade. |
| `GET /:id` | – | `{ section }` | 404 se não existir. |
| `PUT /:id` | Mesmo corpo do POST | `{ section }` | Atualiza campos e `updated_by`. |
| `PATCH /:id/reorder` | `{ sort_order: number }` | `{ section }` | Reordena a seção em relação às demais (transação). |
| `POST /:id/items` | `{ product_id, sort_order?, metadata? }` | `{ item }` | Verifica limite (`limit`). Busca dados do produto e garante presença de `name`, `price`, `unit`. |
| `PATCH /:id/items/:itemId` | `{ sort_order?, metadata? }` | `{ item }` | Permite reordenação e ajustes de metadata. |
| `DELETE /:id/items/:itemId` | – | `{ success: true }` | Libera `sort_order` posteriormente. |
| `PATCH /:id/items/reorder` | `{ items: { id, sort_order }[] }` | `{ items }` | Atualiza ordem em lote (opcional, usar quando drag & drop enviar lista completa). |

Autorização: reutilizar middleware existente para rotas admin (token/Session). Diferença: `updated_by` precisa receber o `user.id`.

Erros:
- 400 quando: `layout_type` ou `bg_color` fora do enum, limite < 1, CTA sem `href`, item excede limite ou tenta incluir produto sem `name/price/unit`.
- 409 para conflitos de slug ou produto duplicado.
- 422 quando dados obrigatórios ausentes.

## 4. Ajustes na homepage

### 4.1 Novo serviço
Criar `lib/homepage-sections.ts` com:
- `fetchHomepageSections({ useMockData }: { useMockData: boolean })`.
- `mapSectionToComponentProps(section)` → devolve props alinhados com `FeaturedProductsSection` ou `ProductsGridSection`.
- Fallback: quando nenhuma seção ativa é retornada, usar mocks definidos em `lib/content.ts`.

### 4.2 `app/page.tsx`
- Substituir as chamadas individuais (hero/banner mantêm) por:
  ```ts
  const sections = await fetchHomepageSections({ useMockData });
  ```
- Renderizar dinamicamente:
  ```tsx
  sections.map(section => {
    if (section.layout_type === 'featured') {
      return <FeaturedProductsSection key={section.id} {...section.props} />;
    }
    return <ProductsGridSection key={section.id} {...section.props} />;
  });
  ```
- `ImageBannerSection` permanece independente até existir seção equivalente.
- Garantir que `view_all_label` default continue sendo “Ver todos”.
- Placeholder 600×800 deve permanecer quando `image_url` estiver vazio (já é o comportamento padrão dos componentes; apenas garantir que os dados nunca forcem outra renderização).

## 5. Painel admin

### 5.1 Sidebar
- Novo item “Seções de produtos” dentro do grupo Conteúdo.
- Subitens fixos apontando para a rota com query `?sectionId=<id>` para atalhos rápidos das seções padrão.

### 5.2 Página índice (`/admin/content/sections`)
- Grid/list com todas as seções (nome, status, layout, CTA).
- Drag & drop para reordenar (`PATCH /:id/reorder`).
- Botões:
  - “Nova seção” (abre modal/form in-page).
  - Toggle de status.

### 5.3 Página de edição
- Form fields:
  - Título (text).
  - Subtítulo (textarea curta).
  - Slug (apenas leitura se for seção padrão; editável para novas).
  - Layout type (segmented control `featured`/`grid`).
  - Cor de fundo (`white` ou `gray`).
  - “Ver todos” (label + href).
  - Limite (1–6). UI deve avisar que apenas 3 cards são exibidos na home, mas o limite controla quantos podem ser selecionados (para futuras rotações).
  - Checkbox “Ativo”.
- Lista de produtos:
  - Drag & drop (envia `PATCH /:id/items/reorder`).
  - Cada item mostra: placeholder 600×800 (ou thumbnail) + nome + “A partir de R$ x / unidade”.
  - Botão remover.
- Modal “Adicionar produto”:
  - Busca paginada em `/api/admin/products?search=...`.
  - Bloqueia seleção caso `price` ou `unit` estejam vazios (mostrar tooltip).
  - Exibe prévia com placeholder se não houver imagem.
- Preview:
  - Renderizar o componente real correspondente (`FeaturedProductsSection` ou `ProductsGridSection`) passando os dados atuais.
  - Atualizar automaticamente quando o admin altera título/CTA/etc.

### 5.4 Validações UX
- Bloquear `Salvar` enquanto `title` ou `view_all_href` estiverem vazios.
- Mostrar aviso quando o limite já tiver sido atingido (“Você precisa remover um item antes de adicionar outro.”).
- Ao salvar, exibir toast de sucesso/erro.

## 6. Ajustes no módulo de produtos

- Campos obrigatórios: `name`, `price`, `unit`.
- Formatação:
  - `price` exibido como moeda (pt-BR) no painel, mas armazenado como número (centavos ou decimal).
  - `unit` deve aceitar somente opções pré-definidas (`unidade`, `m²`, `kit`, etc.) – definir lista curta e permitir “outros” via campo texto, se necessário.
- Preview do produto (tanto na listagem quanto no modal):
  - Mostrar frame 600×800 com texto “600 x 800 pixels” quando `image_url` estiver vazio.
  - Se houver imagem, exibí-la com `object-cover` mantendo o mesmo frame.
- API `/api/admin/products` deve retornar `unit` e validar esses campos no backend (422 se ausentes).

## 7. Aceite / critérios de teste

### 7.1 Backend
- [ ] Migração cria tabelas e seeds sem erros em ambiente vazio.
- [ ] Scripts convertem registros de `homepage_products` quando disponíveis.
- [ ] APIs retornam erros adequados em casos de limite, duplicidade, dados ausentes.
- [ ] Logs registram sempre que um produto sem `price`/`unit` for rejeitado.

### 7.2 Homepage
- [ ] Renderiza as seções na ordem definida por `sort_order`.
- [ ] Placeholder 600×800 permanece visível em todos os cards sem imagem.
- [ ] Títulos/CTAs refletem as alterações feitas pelo admin em até 1 minuto (respeitando `revalidate`).

### 7.3 Admin UI
- [ ] Página índice lista todas as seções e permite reorder com persistência.
- [ ] Página de edição impede salvar quando campos obrigatórios faltam.
- [ ] Preview é idêntico ao design atual da homepage (sem shifts visuais).
- [ ] Modal não deixa adicionar produtos sem `price` ou `unit`.
- [ ] Ao tentar ultrapassar o limite de itens, usuário recebe feedback e a API responde 400.

### 7.4 Cadastro de produtos
- [ ] Form não salva enquanto `price` ou `unit` estiverem vazios.
- [ ] Listagem e cartões do painel exibem placeholder correto quando a imagem não foi enviada.
- [ ] Produtos recém-criados aparecem disponíveis na modal de seleção das seções.

## 8. Itens de acompanhamento
- Documentar em `docs/` o script de migração (ex.: `supabase/migrations/<timestamp>_homepage_sections.sql`).
- Criar Seeds/Mock para ambientes locais (JSON ou SQL) alinhados com os novos modelos.
- Atualizar o README ou docs de deploy apontando a ordem de execução (migração → API → frontend).
- Considerar feature flag (`use_new_homepage_sections`) para rollback rápido.

## 9. Segurança e auditoria
- Todas as rotas devem reutilizar o middleware de autenticação/admin já aplicado às demais rotas de conteúdo.
- Sanitizar inputs:
  - `title`, `subtitle`, `view_all_label` → `trim()` + limitar a 120 caracteres.
  - `view_all_href` → aceitar apenas URLs relativas ao domínio (`/produtos...`) ou links absolutos whitelisted (ex.: `https://`).
  - `config` → filtrar somente chaves whitelisted (`badgeLabel`, `highlighted`, etc.) antes de persistir.
- Registrar operações no `ActivityLog` existente com a seguinte convenção:
  - `resource_type`: `'homepage_section'` ou `'homepage_section_item'`.
  - `action`: `'create' | 'update' | 'delete' | 'reorder'`.
  - Incluir `old_values`/`new_values` sempre que possível para facilitar auditoria.
- Garantir que `updated_by` seja preenchido com o `user.id` logado e que apenas usuários com perfil `admin`/`editor` possam alterar seções.
