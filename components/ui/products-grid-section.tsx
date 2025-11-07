'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import type { Product } from '@/lib/types'

interface ProductsGridSectionProps {
  title: string
  products: Product[]
  viewAllHref?: string
  bgColor?: 'white' | 'gray'
}

export function ProductsGridSection({ 
  title, 
  products, 
  viewAllHref,
  bgColor = 'white' 
}: ProductsGridSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-[550] text-[#1D1D1F] dark:text-white mb-2">
                {title}
              </h2>
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-[#1D1D1F] dark:text-white hover:text-[#6E6E73] dark:hover:text-[#98989D] transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Ver todos</span>
                <span>→</span>
              </Link>
            )}
          </motion.div>

          {/* Products Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.slice(0, 4).map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <Link
                  href={`/produtos/${product.slug}`}
                  className="group block"
                >
                  {/* 
                    IMAGEM DO PRODUTO
                    - RESOLUÇÃO IDEAL: 600x800 pixels (3:4)
                    - FORMATO: JPG, PNG ou WEBP
                    - TAMANHO: Máximo 400KB
                  */}
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

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-[550] text-[#1D1D1F] dark:text-white group-hover:text-[#6E6E73] dark:group-hover:text-[#98989D] transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-[#6E6E73] dark:text-[#98989D]">
                      <p className="text-sm mb-1">A partir de</p>
                      <p className="text-xl font-[550] text-[#1D1D1F] dark:text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
