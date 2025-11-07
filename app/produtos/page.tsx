import Link from 'next/link'
import { mockProducts } from '@/lib/mock-data'

export const revalidate = 3600

interface SearchParams {
  category?: string
}

async function getProducts(category?: string) {
  // Check if Supabase is configured
  const hasSupabase = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

  if (!hasSupabase) {
    // Return mock data for development
    if (category) {
      return mockProducts.filter(p => p.category === category)
    }
    return mockProducts
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return category ? mockProducts.filter(p => p.category === category) : mockProducts
    }

    return products || (category ? mockProducts.filter(p => p.category === category) : mockProducts)
  } catch (error) {
    console.error('Supabase error:', error)
    return category ? mockProducts.filter(p => p.category === category) : mockProducts
  }
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const products = await getProducts(params.category)

  const categories = [
    { label: 'Todos', value: undefined },
    { label: 'Impressão', value: 'print' },
    { label: 'Adesivos', value: 'adesivos' },
    { label: 'Banners', value: 'banners' },
    { label: 'Cartões', value: 'cartoes' },
    { label: 'Flyers', value: 'flyers' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nossos Produtos
          </h1>
          <p className="text-lg text-brand-gray dark:text-gray-400">
            Impressão de alta qualidade para todas as suas necessidades
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.value ? `/produtos?category=${cat.value}` : '/produtos'}
              className={`inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded-md transition-all duration-200 ${
                params.category === cat.value
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Products Grid - Padrão da Home */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id}>
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-medium transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-brand-gray dark:text-gray-400">
                      <p className="text-sm mb-1">A partir de</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-brand-gray dark:text-gray-400 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
