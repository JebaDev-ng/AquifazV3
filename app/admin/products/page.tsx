'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/admin/ui/button'
import { Product, ProductCategory } from '@/lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  
  const PRODUCTS_PER_PAGE = 12

  // Carregar produtos
  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories?active=true&with_defaults=true')
        if (response.ok) {
          const payload = await response.json()
          setCategories(payload.categories || [])
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Filtrar produtos
  useEffect(() => {
    // Garantir que products é um array
    if (!Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    let filtered = products

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, selectedCategory, searchTerm])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        // A API retorna { products: [], pagination: {} }
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setProducts([]) // Garantir que seja sempre um array
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Garantir que products é um array antes de usar filter
        if (Array.isArray(products)) {
          setProducts(products.filter(p => p.id !== productId))
        }
      } else {
        alert('Erro ao excluir produto')
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto')
    }
  }



  useEffect(() => {

    if (

      selectedCategory !== 'Todos' &&

      categories.length > 0 &&

      !categories.some((category) => category.id === selectedCategory)

    ) {

      setSelectedCategory('Todos')

    }

  }, [categories, selectedCategory])



  // Paginação - garantir que filteredProducts é um array
  const totalPages = Math.ceil((filteredProducts?.length || 0) / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = Array.isArray(filteredProducts) 
    ? filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
    : []

  const categoryMap = useMemo(
    () =>
      categories.reduce<Record<string, ProductCategory>>((acc, category) => {
        acc[category.id] = category
        return acc
      }, {}),
    [categories]
  )

  const categoryFilters = ['Todos', ...categories.map((category) => category.id)]

  const getCategoryLabel = (categoryId: string) => {
    if (categoryId === 'Todos') return 'Todos'
    return categoryMap[categoryId]?.name || categoryId
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produtos</h1>
          <p className="text-gray-600">
            Gerencie o catálogo de produtos da AquiFaz
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
            + Novo Produto
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>
          
          {/* Toggle de visualização */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Visualização em grade"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Visualização em lista"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          {/* Categorias */}
          <div className="flex flex-wrap gap-2 items-center">
            {categoryFilters.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
            {categoriesLoading && (
              <span className="text-xs text-gray-500">Carregando categorias...</span>
            )}
          </div>
        </div>
        
        {/* Estatísticas */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-600">
          <span>Total: <strong>{products.length}</strong> produtos</span>
          <span>Filtrados: <strong>{filteredProducts.length}</strong></span>
          <span>Ativos: <strong>{products.filter(p => p.active).length}</strong></span>
          <span>Em destaque: <strong>{products.filter(p => p.featured).length}</strong></span>
        </div>
      </div>

      {/* Lista de produtos */}
      {paginatedProducts.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  {/* Imagem */}
                  <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#6E6E73]">
                        <p className="text-base font-semibold">600 x 800</p>
                        <p className="text-sm text-[#86868B]">pixels</p>
                      </div>
                    )}
                    
                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.featured && (
                        <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-full font-medium">
                          Destaque
                        </span>
                      )}
                      {!product.active && (
                        <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full font-medium">
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {getCategoryLabel(product.category)}
                    </p>
                    
                    {/* Preços */}
                    <div className="mb-3">
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          R$ {product.original_price.toLocaleString('pt-BR')}
                        </div>
                      )}
                      <div className="text-lg font-bold text-green-600">
                        R$ {product.price.toLocaleString('pt-BR')}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium text-center hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 mb-8">
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Imagem */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#6E6E73]">
                          <p className="text-[10px] font-semibold">600x800</p>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {getCategoryLabel(product.category)}
                      </p>
                    </div>

                    {/* Status badges */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      {product.featured && (
                        <span className="bg-yellow-500 text-white px-2 py-0.5 text-[10px] rounded-full font-medium">
                          Destaque
                        </span>
                      )}
                      {!product.active && (
                        <span className="bg-red-500 text-white px-2 py-0.5 text-[10px] rounded-full font-medium">
                          Inativo
                        </span>
                      )}
                    </div>

                    {/* Preços */}
                    <div className="text-right flex-shrink-0 min-w-[80px]">
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-[10px] text-gray-500 line-through">
                          R$ {product.original_price.toLocaleString('pt-BR')}
                        </div>
                      )}
                      <div className="text-sm font-bold text-green-600">
                        R$ {product.price.toLocaleString('pt-BR')}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Editar produto"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </Button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>
              
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
            📦
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'Todos' 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando o primeiro produto'}
          </p>
          <Link href="/admin/products/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors">
              + Adicionar Produto
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

