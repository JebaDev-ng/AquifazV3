# Plano: Slug Automático com Toggle Manual

## Objetivo
Implementar no painel admin a geração automática do identificador (slug) das seções da homepage, mantendo a possibilidade de edição manual por meio de um toggle sempre ativado por padrão.

## Escopo
- Abrange apenas a UI e lógica cliente em `app/admin/content/sections/[sectionId]/page.tsx`.
- Não altera o schema do Supabase; as sections continuam persistidas na tabela `homepage_sections`.
- Garante compatibilidade com o endpoint existente `POST /api/admin/content/homepage-sections`.

## Requisitos Funcionais
1. **Toggle de Controle**
   - Exibir controle "Gerar slug automaticamente" ligado por padrão em novas seções.
   - Ao desativar, o campo de slug torna-se editável manualmente.
   - Ao reativar, sincronizar novamente com o título atual.

2. **Sincronização Automática**
   - Enquanto o toggle estiver ativo, atualizar `form.id` automaticamente sempre que o título mudar.
   - Utilizar sanitização compatível com `createSectionSchema` (`^[a-z0-9-]+$`).

3. **Persistência**
   - Payload enviado no `handleSaveSection` deve usar o slug atual (auto ou manual).
   - Inserções continuam registrando na tabela `homepage_sections` do Supabase sem migration adicional.

4. **Feedback ao Usuário**
   - Campo de slug mostra estado desabilitado quando automático.
   - Mensagem de ajuda indicando que o identificador é derivado do título e pode ser editado ao desativar o toggle.

## Requisitos Técnicos
- Criar helper `slugifyTitle(title: string)` (ou reutilizar util existente) para gerar slug minúsculo com hífens.
- Introduzir estado `autoSlugEnabled` iniciando `true` quando `isCreating`.
- Adicionar `useEffect` que atualiza `form.id` quando `autoSlugEnabled` e `isCreating` forem verdadeiros.
- Ajustar `handleInputChange` para respeitar o toggle ao lidar com o campo de slug.
- Garantir que `handleSaveSection` sempre chama `trim()` e validações básicas antes do fetch.

## Testes Recomendados
1. Criar nova seção com título contendo espaços, acentos e caracteres especiais → slug auto deve normalizar e salvar.
2. Desativar toggle, editar slug manualmente com hífens válidos → salvar com sucesso.
3. Desativar toggle, inserir slug inválido → backend retorna erro e UI mostra feedback.
4. Reativar toggle após edição manual → slug volta a acompanhar o título.
5. Verificar no Supabase (select em `homepage_sections`) se a nova seção foi criada com o slug esperado.

## Documentação Futuras
- Atualizar specs/todos com referência a este plano após implementação.
- Registrar no README do admin a regra do toggle para treinamento da equipe.
