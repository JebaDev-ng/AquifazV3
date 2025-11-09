'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { DragEvent } from 'react'

import { Button } from '@/components/admin/ui/button'
import type { HomepageSectionWithItems } from '@/lib/types'

interface SectionsResponse {
  sections: HomepageSectionWithItems[]
}

export default function AdminSectionsIndexPage() {
  const [sections, setSections] = useState<HomepageSectionWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/content/homepage-sections')
      if (!response.ok) {
        throw new Error('Não foi possível carregar as seções.')
      }
      const payload = (await response.json()) as SectionsResponse
      setSections(payload.sections ?? [])
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Falha ao carregar seções.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (section: HomepageSectionWithItems, checked: boolean) => {
    setActionId(section.id)
    try {
      const payload = {
        title: section.title,
        subtitle: section.subtitle,
        layout_type: section.layout_type,
        bg_color: section.bg_color,
        limit: section.limit,
        view_all_label: section.view_all_label,
        view_all_href: section.view_all_href,
        category_id: section.category_id,
        sort_order: section.sort_order,
        is_active: checked,
        config: section.config ?? {},
      }

      const response = await fetch(`/api/admin/content/homepage-sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Não foi possível atualizar a seção.')
      }

      setSections((prev) =>
        prev.map((item) => (item.id === section.id ? { ...item, is_active: checked } : item)),
      )
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao atualizar seção.')
    } finally {
      setActionId(null)
    }
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>, sectionId: string) => {
    event.dataTransfer.effectAllowed = 'move'
    setDraggedId(sectionId)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
  }

  const handleDropSection = async (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault()
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      return
    }

    const fromIndex = sections.findIndex((item) => item.id === draggedId)
    const toIndex = sections.findIndex((item) => item.id === targetId)
    if (fromIndex === -1 || toIndex === -1) {
      setDraggedId(null)
      return
    }

    const reordered = [...sections]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    const normalized = reordered.map((item, index) => ({ ...item, sort_order: index + 1 }))
    setSections(normalized)

    setActionId(draggedId)
    try {
      const response = await fetch(
        `/api/admin/content/homepage-sections/${draggedId}/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: toIndex + 1 }),
        },
      )

      if (!response.ok) {
        throw new Error('Não foi possível reordenar a seção.')
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao reordenar.')
      loadSections()
    } finally {
      setActionId(null)
      setDraggedId(null)
    }
  }

  const allowDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

const sortedSections = useMemo(
    () => [...sections].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [sections],
  )

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#6E6E73] mb-2">Conteúdo</p>
          <h1 className="text-3xl font-normal text-[#1D1D1F]">Seções da homepage</h1>
          <p className="text-[#6E6E73] mt-2 max-w-3xl">
            Organize os blocos exibidos na homepage pública. Arrume a ordem, ative/desative e edite o
            conteúdo de cada bloco sem alterar o layout estabelecido.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={loadSections} disabled={isLoading}>
            Atualizar lista
          </Button>
          <Link href="/admin/content/sections/new">
            <Button>Nova seção</Button>
          </Link>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-[#E5E5EA] bg-white p-6 space-y-4">
          <div className="h-6 w-1/3 rounded bg-[#F5F5F5] animate-pulse" />
          <div className="h-32 rounded bg-[#F5F5F5] animate-pulse" />
          <div className="h-32 rounded bg-[#F5F5F5] animate-pulse" />
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={(event) => handleDragStart(event, section.id)}
              onDragOver={allowDrop}
              onDrop={(event) => handleDropSection(event, section.id)}
              onDragEnd={handleDragEnd}
              className={`rounded-2xl border border-[#E5E5EA] bg-white p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between cursor-move ${
                draggedId === section.id ? 'opacity-50' : ''
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#6E6E73] uppercase tracking-[0.2em]">
                    #{section.sort_order ?? index + 1}
                  </span>
                  <span className="text-xs text-[#98989D]">
                    Layout: {section.layout_type === 'featured' ? 'Produtos em destaque' : 'Grade'}
                  </span>
                </div>
                <h2 className="text-xl font-normal text-[#1D1D1F]">{section.title}</h2>
                {section.subtitle && (
                  <p className="text-sm text-[#6E6E73]">{section.subtitle}</p>
                )}
                <div className="text-xs text-[#86868B] flex flex-wrap gap-3">
                  <span>CTA: {section.view_all_label || 'Ver todos'}</span>
                  <span>Link: {section.view_all_href}</span>
                  <span>Itens: {section.items?.length ?? 0}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-[#1D1D1F]">Ativo</label>
                  <input
                    type="checkbox"
                    checked={section.is_active !== false}
                    onChange={(event) => handleToggleActive(section, event.target.checked)}
                    className="h-4 w-4 rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/content/sections/${section.id}`}>
                    <Button size="sm">Editar</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#D2D2D7] bg-white p-10 text-center text-[#6E6E73]">
              Nenhuma seção configurada até o momento.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
