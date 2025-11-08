'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/admin/ui/button'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/content'
import type { HomepageSettings } from '@/lib/types'

export default function ContentDashboardPage() {
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/content/settings')
      if (response.ok) {
        const payload = await response.json()
        setHomepageSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...payload })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/content/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_mock_data: homepageSettings.use_mock_data }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar configuração de mock data')
      }
    } catch (error) {
      console.error('Erro ao salvar configuração de mock data:', error)
      alert('Não foi possível salvar o modo mock data. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-1/3 rounded-lg bg-[#E5E5EA] animate-pulse" />
        <div className="h-32 rounded-2xl bg-[#F5F5F5] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm text-[#6E6E73] mb-2">Homepage</p>
        <h1 className="text-3xl font-normal text-[#1D1D1F]">Gestão de Conteúdo da Página Inicial</h1>
        <p className="text-[#6E6E73] mt-2 max-w-3xl">
          Ative ou desative o modo mock data para testar a homepage com segurança. As áreas específicas
          (Hero e Banners) estão disponíveis em abas dedicadas no menu lateral.
        </p>
      </header>

      <section className="rounded-2xl border border-[#E5E5EA] bg-white p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] mb-1">Plano de segurança</p>
            <h2 className="text-2xl font-normal text-[#1D1D1F]">Modo mock data da homepage</h2>
            <p className="text-sm text-[#6E6E73] max-w-2xl mt-2">
              Use este modo para forçar a homepage pública a consumir apenas os dados fictícios.
              Ideal para validações rápidas sem impactar os visitantes.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-[#D2D2D7] px-4 py-3">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
              checked={homepageSettings.use_mock_data}
              onChange={(event) =>
                setHomepageSettings((prev) => ({ ...prev, use_mock_data: event.target.checked }))
              }
            />
            <div>
              <p className="text-sm font-medium text-[#1D1D1F]">
                {homepageSettings.use_mock_data ? 'Mocks ativados' : 'Mocks desativados'}
              </p>
              <p className="text-xs text-[#6E6E73]">
                {homepageSettings.use_mock_data
                  ? 'Homepage exibindo apenas dados fictícios.'
                  : 'Homepage usando dados reais do painel.'}
              </p>
            </div>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={saveSettings} loading={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar configuração'}
          </Button>
          <p className="text-xs text-[#6E6E73]">
            Recomendado apenas para testes rápidos ou emergências. Pode levar até 1 minuto para refletir
            no site público devido ao cache.
          </p>
        </div>
      </section>
    </div>
  )
}
