'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface ImageBannerSectionProps {
  imageSrc?: string
  imageAlt?: string
  href?: string
}

export function ImageBannerSection({
  imageSrc = '/images/banner-promo.jpg',
  imageAlt = 'Banner promocional',
  href
}: ImageBannerSectionProps) {
  const BannerContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full aspect-[21/9] md:aspect-[21/6] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900"
    >
      {/* Placeholder with resolution info */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="text-neutral-400 mb-3">
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
        <p className="text-neutral-900 dark:text-white font-bold text-xl mb-2">
          Banner Promocional
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 font-semibold text-lg mb-1">
          1920 × 500 pixels
        </p>
        <p className="text-neutral-500 dark:text-neutral-500 text-sm">
          Resolução ideal para banner full-width
        </p>
        <p className="text-neutral-400 dark:text-neutral-600 text-xs mt-4">
          Formatos: JPG, PNG, WEBP • Máx: 3MB
        </p>
        <p className="text-neutral-400 dark:text-neutral-600 text-xs mt-2">
          Mínimo: 1600×400px para manter qualidade
        </p>
      </div>

      {/* Actual Image (uncomment when you have the image) */}
      {/* <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      /> */}
    </motion.div>
  )

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        {href ? (
          <a
            href={href}
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
