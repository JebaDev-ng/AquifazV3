'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import SingleImageUpload from '@/components/admin/ui/single-image-upload'
import { HeroSection } from '@/components/ui/hero/hero-section'
import {
  DEFAULT_HERO_CONTENT,
  HERO_SECTION_ID,
} from '@/lib/content'
import type { HeroContent } from '@/lib/types'
import type { UploadedImageMeta } from '@/lib/uploads'

const textareaClass =
  'w-full rounded-lg border border-[#D2D2D7] bg-white px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:border-[#007AFF] transition-colors'

export default function HeroContentPage() {
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT)
  const [promoImage, setPromoImage] = useState<UploadedImageMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadHero()
  }, [])

  const loadHero = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/content/hero')
      if (response.ok) {
        const payload = await response.json()
        setHeroContent({ ...DEFAULT_HERO_CONTENT, ...payload })
        setPromoImage(
          payload.promo_image_url
            ? { url: payload.promo_image_url, storagePath: payload.promo_storage_path || '' }
            : null,
        )
      }
    } catch (error) {
      console.error('Erro ao carregar hero:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveHero = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...heroContent,
          promo_image_url: heroContent.promo_image_url || undefined,
          promo_storage_path: heroContent.promo_storage_path || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar hero')
      }
    } catch (error) {
      console.error('Erro ao salvar hero:', error)
      alert('Não foi possível salvar o hero. Tente novamente.')
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
        <h1 className="text-3xl font-normal text-[#1D1D1F]">Hero Section</h1>
        <p className="text-[#6E6E73] mt-2 max-w-3xl">
          Configure título, descrição, CTA e destaque visual exibidos na abertura da homepage.
        </p>
      </header>

      <section className="bg-white border border-[#E5E5EA] rounded-2xl p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] mb-1">Hero principal</p>
            <h2 className="text-2xl font-normal text-[#1D1D1F]">Conteúdo da abertura</h2>
          </div>
          <Button onClick={saveHero} loading={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar hero'}
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <Input
              label="Subtítulo"
              value={heroContent.subtitle}
              onChange={(event) =>
                setHeroContent((prev) => ({ ...prev, subtitle: event.target.value }))
              }
              placeholder="A sua gráfica em Araguaína"
            />
            <Input
              label="Título principal"
              value={heroContent.title}
              onChange={(event) => setHeroContent((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Aquifaz trabalha com diversos serviços"
            />

            <div className="space-y-2">
              <label className="text-sm text-[#1D1D1F]">Descrição</label>
              <textarea
                rows={3}
                className={textareaClass}
                value={heroContent.description}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="WhatsApp (somente números)"
                value={heroContent.whatsapp_number}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, whatsapp_number: event.target.value }))
                }
                placeholder="5563992731977"
              />
              <SingleImageUpload
                label="Imagem promocional"
                value={promoImage}
                onChange={(image) => {
                  setPromoImage(image)
                  setHeroContent((prev) => ({
                    ...prev,
                    promo_image_url: image?.url || '',
                    promo_storage_path: image?.storagePath || '',
                  }))
                }}
                bucket="content_sections"
                entity="hero"
                entityId={HERO_SECTION_ID}
                helperText="Recomendado: 1200 x 900 px"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#1D1D1F]">Mensagem do WhatsApp</label>
              <textarea
                rows={2}
                className={textareaClass}
                value={heroContent.whatsapp_message}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, whatsapp_message: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Título do destaque"
                value={heroContent.promo_title || ''}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, promo_title: event.target.value }))
                }
                placeholder="Promoção especial"
              />
              <Input
                label="Descrição do destaque"
                value={heroContent.promo_subtitle || ''}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, promo_subtitle: event.target.value }))
                }
                placeholder="Clique para saber mais"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E5EA] bg-white overflow-hidden">
            <div className="p-6 sm:p-8">
              <HeroSection
                content={heroContent}
                className="pt-0 pb-0"
                layout="preview"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
