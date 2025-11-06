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
  const bgClass = bgColor === 'white' 
    ? 'bg-white dark:bg-gray-800' 
    : 'bg-gray-50 dark:bg-gray-900'

  return (
    <section className={`py-16 ${bgClass}`}>
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2"
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
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <p className="text-base font-bold text-gray-700 dark:text-gray-300">
                        600 x 800
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        pixels
                      </p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-gray-600 dark:text-gray-400">
                      <p className="text-sm mb-1">A partir de</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
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
