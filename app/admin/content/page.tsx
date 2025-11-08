'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import type { BannerContent, HeroContent, HomepageSettings } from '@/lib/types'
import {
  DEFAULT_BANNER_CONTENT,
  DEFAULT_HERO_CONTENT,
  DEFAULT_HOMEPAGE_SETTINGS,
  buildWhatsAppLink,
} from '@/lib/content'

type SavingSection = 'hero' | 'banner' | 'settings' | null

const textareaClass =
  'w-full rounded-lg border border-[#D2D2D7] bg-white px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:border-[#007AFF] transition-colors'

export default function ContentEditorPage() {
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT)
  const [bannerContent, setBannerContent] = useState<BannerContent>(DEFAULT_BANNER_CONTENT)
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState<SavingSection>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const heroWhatsappLink = useMemo(
    () => buildWhatsAppLink(heroContent.whatsapp_number, heroContent.whatsapp_message),
    [heroContent.whatsapp_number, heroContent.whatsapp_message]
  )

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const [heroResponse, bannerResponse, settingsResponse] = await Promise.all([
        fetch('/api/admin/content/hero'),
        fetch('/api/admin/content/banner'),
        fetch('/api/admin/content/settings'),
      ])

      if (heroResponse.ok) {
        const heroData = await heroResponse.json()
        setHeroContent({ ...DEFAULT_HERO_CONTENT, ...heroData })
      }

      if (bannerResponse.ok) {
        const bannerData = await bannerResponse.json()
        setBannerContent({ ...DEFAULT_BANNER_CONTENT, ...bannerData })
      }

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setHomepageSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...settingsData })
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveHeroContent = async () => {
    setSaving('hero')
    try {
      const response = await fetch('/api/admin/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroContent),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar conteúdo do hero')
      }
    } catch (error) {
      console.error('Erro ao salvar conteúdo do hero:', error)
      alert('Não foi possível salvar o hero. Tente novamente.')
    } finally {
      setSaving(null)
    }
  }

  const saveBannerContent = async () => {
    setSaving('banner')
    try {
      const { enabled, text, background_color, text_color, link, image_url, title, description } =
        bannerContent

      const response = await fetch('/api/admin/content/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          text,
          background_color,
          text_color,
          link,
          image_url,
          title,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar banner')
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
      alert('Não foi possível salvar o banner. Tente novamente.')
    } finally {
      setSaving(null)
    }
  }

  const saveHomepageSettings = async () => {
    setSaving('settings')
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
      setSaving(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-1/3 rounded-lg bg-[#E5E5EA] animate-pulse" />
        <div className="h-64 rounded-2xl bg-[#F5F5F5] animate-pulse" />
        <div className="h-64 rounded-2xl bg-[#F5F5F5] animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm text-[#6E6E73] mb-2">Homepage</p>
        <h1 className="text-3xl font-normal text-[#1D1D1F]">
          Gestão de Conteúdo da Página Inicial
        </h1>
        <p className="text-[#6E6E73] mt-2 max-w-3xl">
          Atualize os textos, links e destaques visíveis para os visitantes na homepage. Todas as
          mudanças são aplicadas imediatamente após salvar.
        </p>
      </header>

      <section className="rounded-2xl border border-[#E5E5EA] bg-white p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73] mb-1">
              Plano de segurança
            </p>
            <h2 className="text-2xl font-normal text-[#1D1D1F]">Modo mock data da homepage</h2>
            <p className="text-sm text-[#6E6E73] max-w-2xl mt-2">
              Ative este modo para forçar a homepage pública a usar os mock data locais. Útil para
              validar rapidamente o layout quando houver alguma instabilidade no painel ou na
              base real.
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
          <Button onClick={saveHomepageSettings} loading={saving === 'settings'}>
            {saving === 'settings' ? 'Salvando...' : 'Salvar configuração'}
          </Button>
          <p className="text-xs text-[#6E6E73]">
            Recomendado apenas para testes rápidos ou emergências. Pode levar até 1 minuto para refletir no
            site público devido ao cache.
          </p>
        </div>
      </section>

      <section className="bg-white border border-[#E5E5EA] rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[#6E6E73] mb-1">Hero principal</p>
            <h2 className="text-2xl font-normal text-[#1D1D1F]">Conteúdo da abertura</h2>
          </div>
          <Button onClick={saveHeroContent} loading={saving === 'hero'}>
            Salvar hero
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

            <div className="space-y-2">
              <label className="text-sm text-[#1D1D1F]">Título principal</label>
              <textarea
                rows={2}
                className={textareaClass}
                value={heroContent.title}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>

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
              <Input
                label="Imagem promocional (URL)"
                value={heroContent.promo_image_url || ''}
                onChange={(event) =>
                  setHeroContent((prev) => ({ ...prev, promo_image_url: event.target.value }))
                }
                placeholder="https://..."
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-[#E5E5EA] bg-[#FAFAFA] p-6 space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73]">Preview</p>
              <h3 className="text-lg font-normal text-[#1D1D1F]">Como aparecerá na homepage</h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-[#6E6E73]">{heroContent.subtitle}</p>
              <h4 className="text-3xl font-normal text-[#1D1D1F] whitespace-pre-line">
                {heroContent.title}
              </h4>
              <p className="text-[#6E6E73]">{heroContent.description}</p>

              <a
                href={heroWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="rounded-xl border border-dashed border-[#D2D2D7] bg-white h-64 relative overflow-hidden flex items-center justify-center">
              {heroContent.promo_image_url ? (
                <Image
                  src={heroContent.promo_image_url}
                  alt={heroContent.promo_title || 'Imagem promocional'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center text-sm text-[#6E6E73]">
                  <p className="font-medium">{heroContent.promo_title || 'Imagem promocional'}</p>
                  <p>{heroContent.promo_subtitle || '1200 × 900 px'}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border border-[#E5E5EA] rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[#6E6E73] mb-1">Banner promocional</p>
            <h2 className="text-2xl font-normal text-[#1D1D1F]">Faixa intermediária</h2>
          </div>
          <Button variant="secondary" onClick={saveBannerContent} loading={saving === 'banner'}>
            Salvar banner
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

            <Input
              label="Imagem de fundo (opcional)"
              value={bannerContent.image_url || ''}
              onChange={(event) =>
                setBannerContent((prev) => ({ ...prev, image_url: event.target.value }))
              }
              placeholder="https://..."
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
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/7] md:aspect-[21/6] rounded-2xl overflow-hidden bg-[#F5F5F5] border border-[#D2D2D7] flex items-center justify-center text-center p-6">
                  <div className="text-[#86868B] mb-3">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1D1D1F] font-[550] text-base sm:text-xl mb-2">
                      Banner Promocional
                    </p>
                    <p className="text-[#6E6E73] font-semibold text-sm sm:text-lg mb-1">
                      1920 × 500 pixels
                    </p>
                    <p className="text-[#86868B] text-xs sm:text-sm">
                      Resolução ideal para banner full-width
                    </p>
                    <p className="text-[#86868B] text-[10px] sm:text-xs mt-3">
                      Formatos: JPG, PNG, WEBP • Máx: 3MB
                    </p>
                    <p className="text-[#86868B] text-[10px] sm:text-xs mt-1">
                      Mínimo: 1600×400px para manter qualidade
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
