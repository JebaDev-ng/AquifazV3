'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/produtos/${product.slug}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <Image
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {product.name}
              </h3>
            </div>

            <p className="text-sm text-brand-gray dark:text-gray-400 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-brand-gray dark:text-gray-400 uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/5563992731977?text=Olá!%20Tenho%20interesse%20no%20produto:%20${encodeURIComponent(product.name)}%20-%20${formatPrice(product.price)}.%20Gostaria%20de%20mais%20informações.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block w-full mt-4 py-2.5 px-4 bg-brand-dark text-white text-sm font-medium rounded-lg hover:bg-brand-medium transition-colors text-center"
            >
              Pedir no WhatsApp
            </a>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
