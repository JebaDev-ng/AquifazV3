import { ProductCard } from '@/components/ui/product-card'
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
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Impressão de alta qualidade para todas as suas necessidades
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.value ? `/produtos?category=${cat.value}` : '/produtos'}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                params.category === cat.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
