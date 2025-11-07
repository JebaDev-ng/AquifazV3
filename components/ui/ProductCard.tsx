import Link from 'next/link'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
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
  )
}
