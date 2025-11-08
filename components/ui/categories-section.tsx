'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import { DEFAULT_PRODUCT_CATEGORIES } from '@/lib/content'
import type { ProductCategory } from '@/lib/types'

interface CategoriesSectionProps {
  categories?: ProductCategory[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const resolvedCategories =
    categories && categories.length > 0
      ? categories.filter((category) => category.active !== false)
      : DEFAULT_PRODUCT_CATEGORIES

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
          <motion.div variants={fadeInUp} className="text-left mb-6 sm:mb-8">
            {/* Espaço reservado para manter o respiro visual da versão estável */}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 md:gap-6"
          >
            {resolvedCategories.map((category) => {
              const href = `/produtos?category=${category.id}`

              return (
                <motion.div
                  key={category.id}
                  variants={fadeInUp}
                  className="flex-shrink-0 w-[9.25rem] sm:flex-shrink sm:w-auto"
                >
                  <Link
                    href={href}
                    className="group block"
                  >
                    <div className="relative aspect-square rounded-full overflow-hidden bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] mb-2 sm:mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                        <p className="text-[10px] sm:text-xs font-semibold text-[#6E6E73] dark:text-[#98989D]">
                          300 x 300
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-[#86868B] dark:text-[#636366] mt-0.5 sm:mt-1">
                          pixels
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-[11px] sm:text-xs md:text-sm font-[450] text-[#1D1D1F] dark:text-white mb-0.5 group-hover:text-[#6E6E73] dark:group-hover:text-[#98989D] transition-colors line-clamp-2 leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-[#6E6E73] dark:text-[#98989D]">
                        {category.description || 'Personalizados'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}

            <motion.div variants={fadeInUp} className="flex-shrink-0 w-[9.25rem] sm:flex-shrink sm:w-auto">
              <Link
                href="/produtos"
                className="group block h-full"
              >
                <div className="relative aspect-square rounded-full overflow-hidden bg-white dark:bg-black border-2 border-dashed border-[#D2D2D7] dark:border-[#38383A] mb-2 sm:mb-3 flex items-center justify-center group-hover:border-[#1D1D1F] dark:group-hover:border-white transition-colors duration-300">
                  <span className="text-2xl sm:text-3xl text-[#86868B] dark:text-[#636366] group-hover:text-[#1D1D1F] dark:group-hover:text-white transition-colors">
                    +
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-[11px] sm:text-xs md:text-sm font-[450] text-[#1D1D1F] dark:text-white mb-0.5 group-hover:text-[#6E6E73] dark:group-hover:text-[#98989D] transition-colors">
                    Ver todos
                  </h3>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-[#6E6E73] dark:text-[#98989D]">
                    Todos os produtos
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
