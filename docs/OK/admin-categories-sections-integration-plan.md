# Plano – Integração de Categorias com Seções da Homepage

## Objetivo
Alinhar o cadastro de categorias (`product_categories`) com o gerenciamento de seções da homepage (`homepage_sections`), garantindo que cada seção baseada em categoria exiba apenas produtos compatíveis e ofereça fluxo de manutenção coerente.

## 1. Diagnóstico Atual
- Produtos possuem o campo obrigatório `category` selecionado no formulário do painel (`ProductForm`).
- A tela de seções armazena um `category_id`, porém não usa esse valor para filtrar ou validar produtos na composição da seção.
- Modal "Adicionar produto" aceita qualquer item retornado por `/api/admin/products`, exigindo filtragem manual.

## 2. Escopo da Integração
1. **Busca guiada por categoria**: quando a seção tiver `category_id`, a listagem inicial da modal deve aplicar `?category=<id>` na busca.
2. **Validação backend**: bloco de inserção de itens (`POST /api/admin/content/homepage-sections/[sectionId]/items`) deve recusar produtos fora da categoria quando a seção é categorizada.
3. **UX explícita**: informar na UI que a seção está travada à categoria escolhida, permitindo remover o filtro apenas quando `category_id` estiver vazio.
4. **Defaults coerentes**: ao selecionar/alterar `category_id`, atualizar automaticamente `view_all_href` (`/produtos?category=<id>`) e label padrão.

## 3. Entregáveis Técnicos
- Atualização de `app/admin/content/sections/[sectionId]/page.tsx`:
  - Aplicar filtro por categoria ao chamar `/api/admin/products`.
  - Adicionar badge/tooltip exibindo a categoria e controle para limpar ou reforçar o filtro.
  - Mensagens de feedback ao tentar adicionar produto inválido.
- Ajuste em `app/api/admin/content/homepage-sections/[sectionId]/items/route.ts`:
  - Verificar `section.category_id` e comparar com `product.category` antes de inserir.
  - Retornar erro amigável quando houver incompatibilidade.
- Revisão de `lib/admin/homepage-sections.ts` e helpers:
  - Garantir que `category_id` persista em caches/stores e atualize `view_all_href` quando aplicável.
- Testes manuais e/ou automatizados cobrindo fluxo positivo e recusas.

## 4. Sequência Proposta
1. **Planejamento UX**: decidir se o filtro pode ser desligado pelo usuário e como sinalizar a restrição na modal.
2. **Back-end primeiro**: implementar validação para impedir inconsistências caso a UI ainda não esteja pronta.
3. **Camada de busca**: modificar o hook/modal para usar o filtro e exibir alerta quando o usuário buscar fora da categoria.
4. **Atualização do formulário**: ao alterar `category_id`, regenerar CTA e avisar o usuário.
5. **QA**:
   - Criar seção amarrada a `adesivos` e verificar que apenas produtos `adesivos` entram.
   - Testar seções sem categoria para confirmar comportamento livre.
   - Garantir que categorias antigas (sem filtro) continuam funcionando.

## 5. Comunicação & Migração
- Notificar o time que seções categorizadas exigem produtos com categoria correspondente.
- Revisar dados atuais: identificar seções com `category_id` preenchido e validar se todos os itens existentes já obedecem à regra (ajustar manualmente caso contrário).

## 6. Riscos & Mitigações
- **Produtos legados sem categoria**: garantir que API retorne erro claro indicando necessidade de preenchimento.
- **Seções customizadas**: permitir que sigam livres escolhendo `category_id` vazio.
- **Cache do hook**: confirmar que `useHomepageSections` sincroniza `category_id` corretamente após as mudanças.

## 7. Próximos Passos
- Validar este plano com o time.
- Abrir tickets específicos (backend, frontend seção, frontend modal, QA).
- Agendar janela para atualizar dados existentes.
