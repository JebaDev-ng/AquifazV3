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
    <div className="min-h-screen bg-white dark:bg-black pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1D1D1F] dark:text-white leading-tight font-normal mb-2 sm:mb-3 md:mb-4">
            Nossos Produtos
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#6E6E73] dark:text-[#98989D]">
            Impressão de alta qualidade para todas as suas necessidades
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 md:mb-12">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.value ? `/produtos?category=${cat.value}` : '/produtos'}
              className={`inline-flex items-center justify-center h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                params.category === cat.value
                  ? 'bg-[#2d2736] dark:bg-white text-white dark:text-[#1D1D1F]'
                  : 'bg-[#F5F5F5] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white hover:bg-[#E5E5EA] dark:hover:bg-[#2C2C2E]'
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Products Grid - Padrão da Home */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
                  <div className="relative aspect-[3/4] bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] rounded-lg overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {/* Badge de desconto na imagem */}
                    {product.discount_percent && product.original_price && product.original_price > product.price && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-block text-xs font-semibold text-white bg-green-600 px-3 py-1.5 rounded-lg shadow-md">
                          {product.discount_percent}% OFF
                        </span>
                      </div>
                    )}
                    
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
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-[550] text-[#1D1D1F] dark:text-white group-hover:text-[#6E6E73] dark:group-hover:text-[#98989D] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="text-[#6E6E73] dark:text-[#98989D]">
                      <p className="text-xs sm:text-sm mb-0.5 sm:mb-1">A partir de</p>
                      
                      {/* Preço com desconto */}
                      {product.original_price && product.original_price > product.price ? (
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm text-[#86868B] dark:text-[#636366] line-through">
                            R$ {product.original_price.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-base sm:text-lg md:text-xl font-[550] text-[#1D1D1F] dark:text-white">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-base sm:text-lg md:text-xl font-[550] text-[#1D1D1F] dark:text-white">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#6E6E73] dark:text-[#98989D] text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
