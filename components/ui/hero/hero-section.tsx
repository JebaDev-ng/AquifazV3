'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import { DEFAULT_HERO_CONTENT, buildWhatsAppLink } from '@/lib/content'
import type { HeroContent } from '@/lib/types'

interface HeroSectionProps {
  content?: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  const heroContent = { ...DEFAULT_HERO_CONTENT, ...content }
  const titleLines = heroContent.title.split('\n').filter(Boolean)
  const whatsappLink = buildWhatsAppLink(heroContent.whatsapp_number, heroContent.whatsapp_message)

  return (
    <section className="relative bg-white dark:bg-black pt-32 sm:pt-40 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-3 sm:space-y-4 text-left">
              <p className="text-base sm:text-sm font-normal text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider">
                {heroContent.subtitle}
              </p>
              <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1D1D1F] dark:text-white leading-[0.95] font-normal">
                {titleLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-base md:text-lg text-[#6E6E73] dark:text-[#98989D] max-w-xl text-left"
            >
              {heroContent.description}
            </motion.p>

            <motion.div variants={fadeInUp} className="w-full sm:w-auto">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Image
                  src="/Whatsapp.svg"
                  alt="Fazer Pedido via WhatsApp"
                  width={131}
                  height={31}
                  className="h-7 w-48 sm:h-7 sm:w-54 brightness-0 invert"
                  priority
                />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 lg:mt-0"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                  <p className="text-sm sm:text-base font-semibold text-[#6E6E73] dark:text-[#98989D] mb-1">
                    1200 x 900
                  </p>
                  <p className="text-xs sm:text-sm text-[#86868B] dark:text-[#636366]">
                    pixels
                  </p>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
