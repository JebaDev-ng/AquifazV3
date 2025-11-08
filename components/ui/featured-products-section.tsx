'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import type { Product } from '@/lib/types'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const DEFAULT_FEATURED_PRODUCTS: Product[] = [
  {
    id: 'featured-cartoes',
    name: 'Cartões de Visita Premium',
    slug: 'cartoes-visita-premium',
    description: 'Impressão profissional',
    category: 'cartoes',
    price: 89.9,
    unit: 'unidade',
    image_url: '',
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'featured-adesivos',
    name: 'Adesivos Personalizados',
    slug: 'adesivos-personalizados',
    description: 'Personalize com sua marca',
    category: 'adesivos',
    price: 59.9,
    unit: 'unidade',
    image_url: '',
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'featured-banner',
    name: 'Banner 1x2m',
    slug: 'banner-1x2m',
    description: 'Impressão em alta qualidade',
    category: 'banners',
    price: 149.9,
    unit: 'unidade',
    image_url: '',
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

interface FeaturedProductsSectionProps {
  products?: Product[]
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const resolvedProducts = (products && products.length > 0 ? products : DEFAULT_FEATURED_PRODUCTS).slice(0, 3)

  if (!resolvedProducts.length) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-black">
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-[450] text-[#1D1D1F] dark:text-white mb-2">
                Produtos em destaque
              </h2>
              <p className="text-sm sm:text-base text-[#6E6E73] dark:text-[#98989D]">
                Confira nossos produtos mais populares
              </p>
            </div>
            <Link
              href="/produtos"
              className="text-[#1D1D1F] dark:text-white hover:text-[#6E6E73] dark:hover:text-[#98989D] transition-colors flex items-center gap-2"
            >
              <span className="hidden sm:inline">Ver todos</span>
              <span>→</span>
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            {resolvedProducts.map((product) => {
              const href = `/produtos/${product.slug}`
              const formattedPrice = currency.format(product.price ?? 0)
              const unit = product.unit || 'unidade'

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

                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-sm sm:text-base md:text-lg font-[450] text-[#1D1D1F] dark:text-white group-hover:text-[#6E6E73] dark:group-hover:text-[#98989D] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="text-[#6E6E73] dark:text-[#98989D]">
                        <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">A partir de</p>
                        <p className="text-base sm:text-lg md:text-xl font-[450] text-[#1D1D1F] dark:text-white">
                          {formattedPrice}
                          <span className="text-xs sm:text-sm font-normal text-[#6E6E73] dark:text-[#98989D] ml-1">
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
