'use client'

import { motion } from 'framer-motion'

import { DEFAULT_BANNER_CONTENT } from '@/lib/content'
import type { BannerContent } from '@/lib/types'

interface ImageBannerSectionProps {
  banner?: BannerContent | null
  href?: string
}

export function ImageBannerSection({
  banner = DEFAULT_BANNER_CONTENT,
  href,
}: ImageBannerSectionProps) {
  if (!banner.enabled) {
    return null
  }

  const destination = href || banner.link
  const headline = banner.title || 'Banner Promocional'
  const description = banner.description || 'Resolução ideal para banner full-width'

  const BannerContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full aspect-[16/9] sm:aspect-[21/7] md:aspect-[21/6] rounded-xl sm:rounded-2xl overflow-hidden bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="text-[#86868B] dark:text-[#636366] mb-3">
          <svg
            className="w-20 h-20 mx-auto mb-4"
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
        <p className="text-[#1D1D1F] dark:text-white font-[550] text-base sm:text-xl mb-2">
          {headline}
        </p>
        <p className="text-[#6E6E73] dark:text-[#98989D] font-semibold text-sm sm:text-lg mb-1">
          1920 × 500 pixels
        </p>
        <p className="text-[#86868B] dark:text-[#636366] text-xs sm:text-sm">
          {description}
        </p>
        <p className="text-[#86868B] dark:text-[#636366] text-[10px] sm:text-xs mt-3 sm:mt-4">
          Formatos: JPG, PNG, WEBP • Máx: 3MB
        </p>
        <p className="text-[#86868B] dark:text-[#636366] text-[10px] sm:text-xs mt-1 sm:mt-2">
          Mínimo: 1600×400px para manter qualidade
        </p>
      </div>
    </motion.div>
  )

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {destination ? (
          <a
            href={destination}
            target={destination.startsWith('http') ? '_blank' : undefined}
            rel={destination.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block transition-transform hover:scale-[1.02] duration-300"
          >
            <BannerContent />
          </a>
        ) : (
          <BannerContent />
        )}
      </div>
    </section>
  )
}
