'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import SingleImageUpload from '@/components/admin/ui/single-image-upload'
import { DEFAULT_BANNER_CONTENT, BANNER_SECTION_ID } from '@/lib/content'
import type { BannerContent } from '@/lib/types'
import type { UploadedImageMeta } from '@/lib/uploads'

const textareaClass =
  'w-full rounded-lg border border-[#D2D2D7] bg-white px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:border-[#007AFF] transition-colors'

export default function BannerContentPage() {
  const [bannerContent, setBannerContent] = useState<BannerContent>(DEFAULT_BANNER_CONTENT)
  const [bannerImage, setBannerImage] = useState<UploadedImageMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/content/banner')
      if (response.ok) {
        const payload = await response.json()
        setBannerContent({ ...DEFAULT_BANNER_CONTENT, ...payload })
        setBannerImage(
          payload.image_url ? { url: payload.image_url, storagePath: payload.storage_path || '' } : null,
        )
      }
    } catch (error) {
      console.error('Erro ao carregar banner:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveBanner = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/content/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bannerContent,
          image_url: bannerContent.image_url || undefined,
          storage_path: bannerContent.storage_path || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar banner')
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
      alert('Não foi possível salvar o banner. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-1/3 rounded-lg bg-[#E5E5EA] animate-pulse" />
        <div className="h-64 rounded-2xl bg-[#F5F5F5] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm text-[#6E6E73] mb-2">Conteúdo</p>
        <h1 className="text-3xl font-normal text-[#1D1D1F]">Banners</h1>
        <p className="text-[#6E6E73] mt-2 max-w-3xl">
          Configure a faixa promocional exibida no meio da homepage, com textos, cores, link e imagem.
        </p>
      </header>

      <section className="rounded-2xl border border-[#E5E5EA] bg-white p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] mb-1">Banner promocional</p>
            <h2 className="text-2xl font-normal text-[#1D1D1F]">Faixa intermediária</h2>
          </div>
          <Button onClick={saveBanner} loading={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar banner'}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                checked={bannerContent.enabled}
                onChange={(event) =>
                  setBannerContent((prev) => ({ ...prev, enabled: event.target.checked }))
                }
              />
              <span className="text-sm text-[#1D1D1F]">Exibir banner na homepage</span>
            </label>

            <Input
              label="Título"
              value={bannerContent.title || ''}
              onChange={(event) =>
                setBannerContent((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Solicite um orçamento rápido"
            />

            <div className="space-y-2">
              <label className="text-sm text-[#1D1D1F]">Descrição curta</label>
              <textarea
                rows={2}
                className={textareaClass}
                value={bannerContent.description || ''}
                onChange={(event) =>
                  setBannerContent((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#1D1D1F]">Texto principal</label>
              <textarea
                rows={3}
                className={textareaClass}
                value={bannerContent.text}
                onChange={(event) =>
                  setBannerContent((prev) => ({ ...prev, text: event.target.value }))
                }
              />
            </div>

            <Input
              label="Link do banner"
              value={bannerContent.link || ''}
              onChange={(event) =>
                setBannerContent((prev) => ({ ...prev, link: event.target.value }))
              }
              placeholder="https://wa.me/..."
            />

            <SingleImageUpload
              label="Imagem de fundo"
              value={bannerImage}
              onChange={(image) => {
                setBannerImage(image)
                setBannerContent((prev) => ({
                  ...prev,
                  image_url: image?.url || '',
                  storage_path: image?.storagePath || '',
                }))
              }}
              bucket="banners"
              entity="banners"
              entityId={BANNER_SECTION_ID}
              helperText="Recomendado: 1920 x 500 px"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Cor de fundo"
                value={bannerContent.background_color}
                onChange={(event) =>
                  setBannerContent((prev) => ({ ...prev, background_color: event.target.value }))
                }
                placeholder="#1D1D1F"
              />
              <Input
                label="Cor do texto"
                value={bannerContent.text_color}
                onChange={(event) =>
                  setBannerContent((prev) => ({ ...prev, text_color: event.target.value }))
                }
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E5EA] bg-[#FAFAFA] p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73]">Preview</p>
              <h3 className="text-lg font-normal text-[#1D1D1F]">Banner intermediário</h3>
            </div>

            {bannerContent.enabled ? (
              <>
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/7] md:aspect-[21/6] rounded-2xl overflow-hidden border border-[#D2D2D7]">
                  {bannerImage && (
                    <img
                      src={bannerImage.url}
                      alt={bannerContent.title || 'Prévia do banner'}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#6E6E73]">
                      {bannerContent.title || 'Banner Promocional'}
                    </p>
                    <p className="text-lg font-semibold text-[#1D1D1F]">
                      {bannerContent.description || 'Converse com nossa equipe criativa e receba propostas personalizadas.'}
                    </p>
                    <p className="text-sm text-[#6E6E73] max-w-xl">
                      {bannerContent.text || 'Prontos para criar sua próxima peça? Clique e fale com a AquiFaz pelo WhatsApp.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-[#E5E5EA] p-4 text-xs text-[#6E6E73] space-y-2">
                  <p><strong>Título:</strong> {bannerContent.title || '—'}</p>
                  <p><strong>Descrição:</strong> {bannerContent.description || '—'}</p>
                  <p><strong>Texto principal:</strong> {bannerContent.text || '—'}</p>
                  <p><strong>Link:</strong> {bannerContent.link || '—'}</p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[#D2D2D7] p-10 text-center text-sm text-[#6E6E73]">
                Banner desativado
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
