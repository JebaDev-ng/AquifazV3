import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'
import { mockProducts } from '@/lib/mock-data'

export const revalidate = 3600

async function getProduct(slug: string) {
  // Check if Supabase is configured
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

  if (!hasSupabase) {
    // Return mock data for development
    return mockProducts.find(p => p.slug === slug) || null
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !product) {
      return mockProducts.find(p => p.slug === slug) || null
    }

    return product
  } catch (error) {
    console.error('Supabase error:', error)
    return mockProducts.find(p => p.slug === slug) || null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return {
    title: `${product.name} - PrintShop`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name} - ${formatPrice(product.price)}. Gostaria de mais informações.`
  )

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          {/* 
            IMAGEM DO PRODUTO
            - RESOLUÇÃO IDEAL: 1200x1200 pixels (1:1)
            - RESOLUÇÃO MÍNIMA: 800x800 pixels
            - FORMATO: JPG, PNG ou WEBP
            - TAMANHO: Máximo 500KB
          */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                1200 x 1200
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                pixels
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  /unidade
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Características:
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Alta qualidade de impressão</li>
                <li>• Entrega rápida</li>
                <li>• Diversos tamanhos disponíveis</li>
                <li>• Acabamento profissional</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 items-center">
              <a
                href={`https://wa.me/5563992731977?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 h-14 px-10 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
              >
                <MessageCircle className="w-6 h-6" />
                Fazer Pedido via WhatsApp
              </a>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Fale conosco para fazer seu pedido personalizado
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Informações de Entrega
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Entrega em todo o Brasil. Prazo de produção: 3-7 dias úteis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
