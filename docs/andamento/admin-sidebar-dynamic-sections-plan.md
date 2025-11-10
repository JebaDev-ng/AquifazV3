# Plano de Implementação: Sidebar Dinâmica de Seções da Homepage

## 1. Preparação
- Revisar o spec em `docs/admin-sidebar-dynamic-sections-spec.md` e alinhar critérios de aceite.
- Validar endpoint `/api/admin/content/homepage-sections` (campos necessários e ACL).
- Definir estratégia de cache (SWR com chave `'/api/admin/content/homepage-sections'`).

## 2. Infraestrutura de Dados
- [x] Criar diretório `components/admin/hooks/` se ainda não existir.
- [x] Implementar `useHomepageSections.ts` com:
  - Fetch client-side usando SWR.
  - Ordenação por `sort_order`.
  - Retorno `{ sections, isLoading, error, mutate }`.
  - Tratamento de erros (console + retorno de fallback opcional).

## 3. Atualização das Páginas de Conteúdo
- [ ] Refatorar `app/admin/content/sections/page.tsx` para consumir o hook.
  - Substituir lógica local de fetch por chamadas ao hook.
  - Usar `mutate` após toggles, reorder e criação de novas seções.
- [ ] Refatorar `app/admin/content/sections/[sectionId]/page.tsx`.
  - Sincronizar após salvar/renomear/adicionar produtos via `mutate` (importar do hook via contexto ou callback). 
  - Garantir que placeholders continuam funcionando.

## 4. Refatorar `AdminSidebar`
- [x] Atualizar `components/admin/layout/admin-sidebar.tsx`:
  - Consumir `useHomepageSections()`.
  - Renderizar itens dinâmicos como children de "Seções de produtos".
  - Mantê-los ordenados; indicar se `is_active === false` (badge/estilo).
  - Adicionar estados de carregamento/erro conforme spec.
- [x] Garantir compatibilidade com modo colapsado e animações existentes.

## 5. Sincronização Global
- [ ] Centralizar instância do hook para compartilhar cache (ex.: exportar `useHomepageSections` diretamente e importar onde necessário; SWR lida com cache global).
- [ ] Adicionar chamadas `mutate()` nas respostas de sucesso dos endpoints de criação/edição (ex.: após `fetch` com PUT/POST/PATCH` em seções).

## 6. Testes
- [ ] Manual: criação → item aparece no sidebar sem reload.
- [ ] Renomear → label atualiza imediatamente.
- [ ] Reordenar → sidebar reordena.
- [ ] Desativar → item estilizado/indicado como inativo.
- [ ] Remover → item some do menu.
- [ ] Verificar comportamento offline/erro (fallback para atalhos default + aviso discreto).
- [ ] Testar navegação com sidebar colapsado.

## 7. Documentação e Entrega
- [ ] Atualizar README ou docs relevantes com a nova arquitetura do sidebar.
- [ ] Registrar mudanças no CHANGELOG (se houver).
- [ ] Criar checklist de QA rápida para regressão futura.

## 8. Pós-Entrega (Opcional)
- [ ] Avaliar hook para breadcrumbs dinâmicos.
- [ ] Considerar outras métricas (badge com contador de produtos por seção).
