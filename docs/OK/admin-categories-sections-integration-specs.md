# Especificação Técnica – Integração de Categorias com Seções da Homepage

## 1. Visão Geral
- **Tema**: Vincular seções da homepage a categorias de produtos, garantindo consistência entre curadoria e catálogo.
- **Stakeholders**: Squad de Conteúdo (admin), Squad de Catálogo (produtos), QA, Operações.
- **Objetivo mensurável**: reduzir incidência de produtos fora de contexto nas seções categorizadas para < 2% no primeiro trimestre.

## 2. Requisitos Funcionais
### 2.1 Seleção de Categoria
- Administradores podem definir `category_id` ao criar/editar seção.
- Alterações no campo atualizam automaticamente o state local e os rótulos de CTAs (`view_all_label`, `view_all_href`).

### 2.2 Busca Filtrada na Modal de Produtos
- Quando a seção possui `category_id`, requisições para `/api/admin/products` incluem `?category=<category_id>`.
- UI exibe badge com o nome da categoria e um texto "Filtrando produtos por <categoria>".
- Usuário pode limpar o filtro apenas se `category_id` estiver vazio (seção custom).

### 2.3 Validação ao Adicionar Produtos
- Backend bloqueia inclusão de produtos cuja `product.category` difere de `section.category_id`.
- Mensagem de erro: "Produto pertence à categoria <categoria_produto>. Esta seção aceita apenas <categoria_secao>.".

### 2.4 Atualização automática de CTA
- Ao definir `category_id`, `view_all_href` recebe `/produtos?category=<slug_da_categoria>`.
- `view_all_label` recebe default "Ver todos os produtos <nome_categoria>" se o campo estiver vazio.
- Administrador pode sobrescrever manualmente ambos os campos.

### 2.5 Feedback ao Usuário
- Attempts bloqueadas aparecem como toast `error`.
- Inclusões válidas retornam toast `success`.

### 2.6 Compatibilidade Retroativa
- Seções sem `category_id` continuam aceitando qualquer produto.
- Dados existentes que violem a regra devem ser tratados na migração (ver seção 6).

## 3. Requisitos Não Funcionais
- **Desempenho**: chamadas de busca devem manter latência < 400 ms para 90% dos requests.
- **Confiabilidade**: validação backend deve cobrir quaisquer clientes (mesmo requests diretos via API).
- **Acessibilidade**: badge de categoria precisa de texto alternativo visível via leitor de tela.

## 4. Alterações de Interface
- `app/admin/content/sections/[sectionId]/page.tsx`
  - Inserir badge `Categoria fixada: <nome>` abaixo do seletor.
  - Modal "Adicionar produto" mostra etiqueta na barra de filtros.
  - Botão "Limpar filtro" desabilitado quando `category_id` está definido (tooltip: "Esta seção está vinculada à categoria").

## 5. Alterações de API
- `POST /api/admin/content/homepage-sections/[sectionId]/items`
  - Carregar `section.category_id` antes do insert.
  - Caso exista, validar com `product.category`.
  - Retornar `422` com payload `{ error: "CATEGORY_MISMATCH", message: ... }`.
- `PUT /api/admin/content/homepage-sections/[sectionId]`
  - Se `category_id` alterar, recalcular defaults para `view_all_href` se vazio.

## 6. Migração de Dados
1. Script único (`scripts/classify-section-items.ts`):
   - Para cada seção com `category_id` preenchido, listar itens.
   - Verificar se todos os produtos possuem `category` correspondente.
   - Gerar relatório `logs/section-category-mismatches.json`.
2. Ação manual do time de conteúdo para corrigir violações antes do deploy.

## 7. Testes
- **Unitários**: validação no handler de itens (mock do repositório de produtos).
- **E2E (Playwright)**:
  - Cenário 1: criar seção com categoria e adicionar produto compatível (deve funcionar).
  - Cenário 2: tentar adicionar produto fora da categoria (toast de erro, item não entra).
  - Cenário 3: seção sem categoria aceita qualquer produto.
- **QA manual**:
  - Alterar categoria de uma seção existente e confirmar que CTA atualiza.
  - Limpar manualmente `view_all_href` e setar custom link.

## 8. Observabilidade
- Adicionar log estruturado `section_items.category_mismatch` na API com `sectionId`, `categoryId`, `productId`.
- Atualizar dashboards para acompanhar mismatch rate semanal.

## 9. Cronograma Sugestivo
1. Dia 1-2: Backlog grooming + UX refinements.
2. Dia 3-5: Implementação backend + testes unitários.
3. Dia 6-8: Implementação frontend + testes manuais.
4. Dia 9: Execução do script de auditoria de dados.
5. Dia 10: QA integrado + deploy.

## 10. Pendências / Decisões
- Definir se exceções específicas (ex: produtos multi-categoria) serão suportadas.
- Confirmar se `category` no produto seguirá sendo campo obrigatório (impacta validador).
- Alinhar copy dos toasts com UX writer.
