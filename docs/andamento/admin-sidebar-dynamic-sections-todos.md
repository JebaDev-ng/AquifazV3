# To-dos: Sidebar Dinâmica de Seções da Homepage

## Preparação
- [x] Revisar o spec em `docs/admin-sidebar-dynamic-sections-spec.md`.
- [x] Validar resposta e permissões do endpoint `/api/admin/content/homepage-sections`.
- [x] Decidir biblioteca de cache (SWR confirmada?).

## Hook `useHomepageSections`
- [x] Criar diretório `components/admin/hooks` (se necessário).
- [x] Implementar `useHomepageSections.ts` com cache compartilhado (estilo SWR).
- [x] Garantir ordenação por `sort_order`.
- [x] Tratar estados `loading` e `error` com fallback adequado.
- [x] Exportar `mutateHomepageSections` (wrapper de `mutate`).

## Atualizar Páginas de Gestão
- [x] Refatorar `app/admin/content/sections/page.tsx` para usar o hook.
- [x] Ajustar ações (toggle, reorder, refresh) para chamar `mutateHomepageSections` após sucesso.
- [x] Refatorar `app/admin/content/sections/[sectionId]/page.tsx` para consumir o hook ou aceitar callback de atualização.
- [x] Disparar `mutateHomepageSections` após salvar/renomear/adicionar/remover itens.

## Refatorar Sidebar
- [x] Atualizar `components/admin/layout/admin-sidebar.tsx` para usar os dados do hook.
- [x] Renderizar itens dinâmicos ordenados como filhos de "Seções de produtos".
- [x] Indicar visualmente seções com `is_active === false`.
- [x] Implementar placeholders de carregamento e fallback em caso de erro.
- [x] Manter comportamento do modo colapsado e animações existentes.

## Sincronização Global
- [x] Garantir reuso do cache SWR entre componentes.
- [x] Revisar chamadas às APIs para sempre acionar `mutateHomepageSections`.

## Testes
- [ ] Criar seção e verificar atualização automática no sidebar.
- [ ] Renomear seção e validar label no menu.
- [ ] Reordenar seções e confirmar ordem no menu.
- [ ] Desativar seção e observar estilo/indicador.
- [ ] Remover seção e confirmar remoção do item no menu.
- [ ] Simular falha da API e validar fallback/erro discreto.
- [ ] Testar navegação com sidebar colapsado.

## Documentação
- [ ] Atualizar README/docs com a nova arquitetura do sidebar.
- [ ] Registrar mudanças no CHANGELOG.
- [ ] Criar checklist rápida de QA/regressão para futuras releases.
