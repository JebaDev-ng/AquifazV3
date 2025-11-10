# Tasks: Slug Automático com Toggle Manual

## Implementação
- [x] Definir helper `slugifyTitle(title: string)` seguindo regra `^[a-z0-9-]+$` (pode reutilizar `slugifyId`).
- [x] Adicionar estado `autoSlugEnabled` em `app/admin/content/sections/[sectionId]/page.tsx` (true se `isCreating`).
- [x] Renderizar toggle "Gerar slug automaticamente" com instruções de uso.
- [x] Sincronizar `form.id` via `useEffect` quando toggle ativo e seção nova (usar helper para evitar loops).
- [x] Desabilitar input de slug quando toggle ativo; habilitar com foco quando desativado.
- [x] Ajustar `handleInputChange` e `handleSaveSection` para respeitar o estado do toggle e validar slug.
- [x] Exibir mensagens de validação amigáveis quando slug inválido.

## Testes Manuais
- [ ] Criar seção apenas digitando título → slug auto gerado e salva sem erro.
- [ ] Desativar toggle, editar slug manual válido → salvar com sucesso.
- [ ] Desativar toggle, informar slug inválido → receber aviso e impedir envio.
- [ ] Reativar toggle após edição manual → slug volta a acompanhar título.
- [ ] Confirmar no Supabase (consulta `SELECT id FROM homepage_sections WHERE id = '<slug>'`) que registros são persistidos conforme esperado.

## Documentação
- [ ] Atualizar `docs/admin-sections-slug-toggle-plan.md` com status/conclusões após implementação.
- [ ] Vincular spec/tarefas ao README ou docs do painel admin conforme necessário.
