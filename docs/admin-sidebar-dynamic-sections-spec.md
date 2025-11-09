# Admin Sidebar: Seções de Produtos Dinâmicas

## Objetivo
Transformar a entrada **Seções de produtos** do painel admin em um nó dinâmico que reflete, em tempo real, as seções cadastradas para a homepage. O sidebar deve atuar como extensão do painel de gerenciamento, garantindo que criação, renomeação, ordenação e ativação de blocos sejam percebidas imediatamente na navegação lateral.

## Escopo
- Atualizar somente a experiência do painel admin (rotas sob `/admin`).
- Manter intactos os componentes públicos da homepage; a mudança é apenas na camada de administração.
- Reaproveitar os componentes existentes de listagem/edição de seções.

## Requisitos Funcionais
1. **Hierarquia da Sidebar**
   - Dentro do grupo "Conteúdo", a ordem fixa deve ser: `Hero Section`, `Banners`, `Seções de produtos` (nó pai dinâmico), seguido dos demais itens já existentes (ex.: `Banners & Fachadas`).
   - `Seções de produtos` expande para mostrar cada seção cadastrada, respeitando `sort_order` e exibindo o título atual.

2. **Sincronização Dinâmica**
   - Ao carregar o sidebar, buscar `/api/admin/content/homepage-sections` para obter `{ id, title, sort_order, is_active }`.
   - Manter cache compartilhado (SWR ou equivalente) entre sidebar e páginas de gestão para evitar requisições redundantes.
   - Após ações que alterem seções (criar, editar título/subtítulo, reordenar, ativar/desativar, remover), invalidar/mutar o cache para refletir as mudanças no sidebar sem recarregar a página.

3. **Rotas dos Itens Dinâmicos**
   - Cada child deve apontar para `/admin/content/sections/{id}`.
   - O item correspondente deve ser marcado como ativo quando a URL atual começar com a rota.

4. **Fallbacks e Estados**
   - Enquanto a lista carrega, mostrar placeholders (ex.: skeletons ou itens em cinza) para indicar carregamento.
   - Em caso de erro na consulta, exibir os atalhos padrão (Produtos em destaque, Mais vendidos, etc.) com um ícone/tooltip de aviso mínimo e registrar erro no console.
   - Se não existirem seções cadastradas, mostrar apenas o item pai "Seções de produtos" sem filhos.

5. **Acessibilidade e UX**
   - Manter suporte ao modo colapsado já existente na sidebar.
   - Garantir que os itens dinâmicos sejam acessíveis via teclado e tenham estados de foco/hover consistentes com o restante do menu.

## Requisitos Técnicos
- Criar helper/hook `useHomepageSections()` em `components/admin/hooks` (ou diretório similar) responsável por:
  - Executar a requisição e ordenar as seções.
  - Expor `sections`, `isLoading`, `error`, `mutate`.
  - Opcional: aceitar opção para incluir/excluir seções inativas na navegação (por padrão incluir todas, mas indicar visualmente quando estiverem desativadas).
- Refatorar `components/admin/layout/admin-sidebar.tsx` para consumir o hook e montar o submenu dinamicamente.
- Atualizar páginas `app/admin/content/sections/page.tsx` e `app/admin/content/sections/[sectionId]/page.tsx` para reutilizar o hook e chamar `mutate()` após ações mutáveis.
- Garantir que `fetch`/SWR use credenciais adequadas (sessão atual) e trate `401`/`403` exibindo mensagem amigável.

## Critérios de Aceite
- Criar nova seção pela UI adiciona automaticamente o novo item no submenu após salvar, sem reload manual.
- Renomear uma seção atualiza o label no submenu imediatamente.
- Reordenar seções altera a ordem do submenu.
- Desativar uma seção exibe o item com indicação (ex.: badge "Inativa") ou estilo desabilitado, mas ainda acessível para edição.
- Remover seção retira o item do submenu.
- Nenhum erro uncaught no console durante os fluxos principais.

## Testes Recomendados
- Smoke manual cobrindo os critérios de aceite.
- Testar usuário sem permissão de admin para garantir que o endpoint respeite ACL.
- Verificar comportamento com conexão ausente/offline (fallback para labels padrão).
- Testar navegação com sidebar colapsado para assegurar que o tooltip ou label continue correto.

## Futuro
- Avaliar se o mesmo hook pode alimentar breadcrumbs e breadcrumbs dinâmicos.
- Considerar badge com contagem de produtos vinculados diretamente no menu.
