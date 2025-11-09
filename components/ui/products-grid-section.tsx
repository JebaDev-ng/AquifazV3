'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import type { Product } from '@/lib/types'

interface ProductsGridSectionProps {
  title: string
  subtitle?: string | null
  products: Product[]
  viewAllHref?: string
  viewAllLabel?: string
  bgColor?: 'white' | 'gray'
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function ProductsGridSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel,
  bgColor = 'white',
}: ProductsGridSectionProps) {
  if (!products || products.length === 0) {
    return null
  }

  const sectionBg = bgColor === 'gray' ? 'bg-[#FAFAFA] dark:bg-black' : 'bg-white dark:bg-black'
  const resolvedViewAllLabel = viewAllLabel || 'Ver todos'

  return (
    <section className={`py-12 sm:py-16 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-[450] text-[#1D1D1F] dark:text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm sm:text-base text-[#6E6E73] dark:text-[#98989D]">
                  {subtitle}
                </p>
              )}
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-[#1D1D1F] dark:text-white hover:text-[#6E6E73] dark:hover:text-[#98989D] transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">{resolvedViewAllLabel}</span>
                <span>&rarr;</span>
              </Link>
            )}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            {products.slice(0, 3).map((product) => {
              const formattedPrice = currency.format(product.price ?? 0)
              const unit = product.unit || 'unidade'
              const href = `/produtos/${product.slug}`

              return (
                <motion.div key={product.id} variants={fadeInUp}>
                  <Link href={href} className="group block">
                    <div className="relative aspect-[3/4] bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-lg overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-base font-semibold text-[#6E6E73] dark:text-[#98989D]">
                          600 x 800
                        </p>
                        <p className="text-sm text-[#86868B] dark:text-[#636366] mt-1">
                          pixels
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-[450] text-[#1D1D1F] dark:text-white group-hover:text-[#6E6E73] dark:group-hover:text-[#98989D] transition-colors">
                        {product.name}
                      </h3>
                      <div className="text-[#6E6E73] dark:text-[#98989D]">
                        <p className="text-sm mb-1">A partir de</p>
                        <p className="text-xl font-[450] text-[#1D1D1F] dark:text-white">
                          {formattedPrice}
                          <span className="text-xs font-normal text-[#6E6E73] dark:text-[#98989D] ml-1">
                            / {unit}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
