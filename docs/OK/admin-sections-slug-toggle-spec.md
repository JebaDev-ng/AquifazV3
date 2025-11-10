# Spec: Slug Automático com Toggle Manual nas Seções da Homepage

## Visão Geral
Fornecer aos administradores um fluxo intuitivo para criação de seções da homepage, gerando automaticamente o identificador (slug) a partir do título enquanto o toggle "Gerar slug automaticamente" estiver ativado. O administrator pode optar por desligar o toggle e ajustar o slug manualmente quando necessário.

## Fluxo do Usuário
1. Usuário acessa `/admin/content/sections/new`.
2. Campo "Gerar slug automaticamente" aparece ligado (toggle ativo) logo acima do campo de identificador.
3. Enquanto o toggle está ativo, o identificador é preenchido e atualizado com base no título digitado.
4. Usuário pode salvar a seção sem jamais tocar no campo de slug.
5. Caso queira um slug customizado, usuário desativa o toggle; o campo é desbloqueado e pode ser editado.
6. Usuário salva a seção; o payload enviado ao endpoint utiliza o slug atual (automático ou manual).

## Requisitos Funcionais
- Toggle renderizado para todas as seções: ativo por padrão apenas quando `isCreating` é true; em edições existentes o toggle inicia desligado para preservar o slug atual.
- Campo de slug bloqueado (readonly/disabled) quando toggle ativo; exibido com ícone de cadeado ou mensagem de ajuda.
- Atualização automática ocorre em tempo real conforme `form.title` muda (apply debounced 150ms opcional).
- Reativar o toggle após edição manual recalcula slug a partir do título corrente, substituindo o valor editado.
- Validação client-side impede envio quando slug vazio ou fora da regex (`^[a-z0-9-]+$`).

## Requisitos Técnicos
- Helper `slugifyTitle(title: string)` reutiliza `slugifyId` de `lib/content` se disponível; garante:
  - Conversão para minúsculas;
  - Substituição de espaços e caracteres inválidos por hífen;
  - Compressão de múltiplos hífens;
  - Trim de hífens nas extremidades.
- Novo estado React `autoSlugEnabled` armazenado em `form` reducer ou state local; definir `true` quando `isCreating`, `false` caso contrário.
- `useEffect` monitora `[form.title, autoSlugEnabled, isCreating]` e atualiza `form.id` quando apropriado (evitar loops quando valor já é igual).
- Ao desligar o toggle, preservar slug atual e focar campo para edição.
- `handleSaveSection` usa `const slug = form.id?.trim()`; caso `autoSlugEnabled` + `isCreating`, reexecuta sanitização antes do fetch.
- Backend permanece inalterado; `createSectionSchema` continua validando.

## Estados de UI
- **Automático ativo**: input disabled, texto cinza, tooltip "Gerado automaticamente a partir do título".
- **Manual ativo**: input habilitado, toggle off; mensagem "Edite com letras minúsculas e hífens".
- **Erro de validação**: exibir mensagem inline sob o campo (ex.: "Use apenas letras minúsculas, números e hífens").

## Data & Persistência
- Nenhuma migration adicional; registros inseridos via `POST /api/admin/content/homepage-sections`.
- `created_at`, `updated_at`, `updated_by` continuam preenchidos via triggers.

## Métricas de Sucesso
- Administradores conseguem criar novas seções sem modificar slug manualmente.
- Redução de erros 400 por slug inválido para zero nos logs após rollout.
- Feedback positivo da equipe de conteúdo sobre facilidade do fluxo.

## Considerações Futuras
- Possibilidade de exibir pré-visualização do slug nas breadcrumbs ou URLs públicas.
- Implementar verificação de unicidade client-side chamando endpoint após digitação manual (ex.: slug checker).