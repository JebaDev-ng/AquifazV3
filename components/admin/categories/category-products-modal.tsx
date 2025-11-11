'use client'

import { useEffect, useState } from 'react'
import { X, ArrowRight, Loader2, Unlink, Trash2, Plus } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import type { ProductCategory } from '@/lib/types'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  active: boolean
  image_url?: string
}

interface CategoryProductsModalProps {
  category: ProductCategory
  allCategories: ProductCategory[]
  isOpen: boolean
  onClose: () => void
  onProductsMoved?: () => void
}

export default function CategoryProductsModal({
  category,
  allCategories,
  isOpen,
  onClose,
  onProductsMoved,
}: CategoryProductsModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [targetCategoryId, setTargetCategoryId] = useState<string>('')
  const [moving, setMoving] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [loadingAvailable, setLoadingAvailable] = useState(false)
  const [selectedToAdd, setSelectedToAdd] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadProducts()
      setSelectedProducts(new Set())
      setTargetCategoryId('')
      setError(null)
      setShowAddProducts(false)
      setSelectedToAdd(new Set())
      setSearchQuery('')
    }
  }, [isOpen, category.id])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/categories/${category.id}/products`)
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableProducts = async () => {
    setLoadingAvailable(true)
    setError(null)
    try {
      // Buscar produtos de outras categorias
      const response = await fetch('/api/admin/products?exclude_category=' + category.id)
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos disponíveis')
      }
      const data = await response.json()
      // Filtrar produtos que já estão na categoria atual
      const currentProductIds = new Set(products.map((p) => p.id))
      const filtered = (data.products || []).filter((p: Product) => !currentProductIds.has(p.id))
      setAvailableProducts(filtered)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos disponíveis')
    } finally {
      setLoadingAvailable(false)
    }
  }

  const handleShowAddProducts = () => {
    setShowAddProducts(true)
    setSearchQuery('')
    loadAvailableProducts()
  }

  const handleAddProducts = async () => {
    if (selectedToAdd.size === 0) {
      return
    }

    if (
      !confirm(
        `Adicionar ${selectedToAdd.size} produto(s) a "${category.name}"?\n\nEles serão movidos de suas categorias atuais.`
      )
    ) {
      return
    }

    setMoving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/categories/products/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: Array.from(selectedToAdd),
          target_category_id: category.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao adicionar produtos')
      }

      const data = await response.json()
      alert(`✓ ${data.moved} produto(s) adicionado(s) com sucesso.`)

      // Recarregar lista e voltar para visualização principal
      setShowAddProducts(false)
      setSelectedToAdd(new Set())
      setSearchQuery('')
      await loadProducts()
      onProductsMoved?.()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produtos')
    } finally {
      setMoving(false)
    }
  }

  // Filtrar produtos disponíveis pela busca
  const filteredAvailableProducts = availableProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const handleToggleProductToAdd = (productId: string) => {
    setSelectedToAdd((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(products.map((p) => p.id)))
    }
  }

  const handleSelectAllToAdd = () => {
    if (selectedToAdd.size === filteredAvailableProducts.length && filteredAvailableProducts.length > 0) {
      setSelectedToAdd(new Set())
    } else {
      setSelectedToAdd(new Set(filteredAvailableProducts.map((p) => p.id)))
    }
  }

  const handleMoveProducts = async () => {
    if (selectedProducts.size === 0 || !targetCategoryId) {
      return
    }

    const targetCategory = allCategories.find((cat) => cat.id === targetCategoryId)
    if (
      !confirm(
        `Mover ${selectedProducts.size} produto(s) para "${targetCategory?.name}"?\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      return
    }

    setMoving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/categories/products/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: Array.from(selectedProducts),
          target_category_id: targetCategoryId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao mover produtos')
      }

      const data = await response.json()
      alert(`✓ ${data.moved} produto(s) movido(s) com sucesso.`)

      // Recarregar lista e notificar componente pai
      await loadProducts()
      setSelectedProducts(new Set())
      setTargetCategoryId('')
      onProductsMoved?.()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao mover produtos')
    } finally {
      setMoving(false)
    }
  }

  const handleUnlinkProducts = async () => {
    if (selectedProducts.size === 0) {
      return
    }

    if (
      !confirm(
        `Desvincular ${selectedProducts.size} produto(s) desta categoria?\n\nOs produtos serão movidos para "Sem Categoria".\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      return
    }

    setUnlinking(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/categories/products/unlink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ids: Array.from(selectedProducts),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao desvincular produtos')
      }

      const data = await response.json()
      alert(`✓ ${data.unlinked} produto(s) desvinculado(s) com sucesso.`)

      // Recarregar lista e notificar componente pai
      await loadProducts()
      setSelectedProducts(new Set())
      onProductsMoved?.()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao desvincular produtos')
    } finally {
      setUnlinking(false)
    }
  }

  if (!isOpen) return null

  const otherCategories = allCategories.filter((cat) => cat.id !== category.id && cat.active)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5EA]">
          <div>
            <h2 className="text-xl font-normal text-[#1D1D1F]">
              Produtos vinculados
            </h2>
            <p className="text-sm text-[#6E6E73] mt-1">
              Categoria: <span className="font-medium">{category.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" />
            </div>
          ) : showAddProducts ? (
            // Visualização de adicionar produtos
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[#1D1D1F]">
                  Selecione produtos para adicionar
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddProducts(false)
                    setSelectedToAdd(new Set())
                    setSearchQuery('')
                  }}
                >
                  Voltar
                </Button>
              </div>

              {loadingAvailable ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" />
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="text-center py-12 text-[#6E6E73] border border-dashed border-[#E5E5EA] rounded-xl">
                  Nenhum produto disponível em outras categorias.
                </div>
              ) : (
                <>
                  {/* Barra de pesquisa */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Pesquisar produtos por nome ou slug..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E5EA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                    />
                    {searchQuery && (
                      <p className="text-xs text-[#6E6E73] mt-2">
                        {filteredAvailableProducts.length} produto(s) encontrado(s)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm text-[#1D1D1F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filteredAvailableProducts.length > 0 && selectedToAdd.size === filteredAvailableProducts.length}
                        onChange={handleSelectAllToAdd}
                        className="rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                        disabled={filteredAvailableProducts.length === 0}
                      />
                      Selecionar todos ({filteredAvailableProducts.length})
                    </label>
                    {selectedToAdd.size > 0 && (
                      <span className="text-sm text-[#007AFF] font-medium">
                        {selectedToAdd.size} selecionado(s)
                      </span>
                    )}
                  </div>

                  {filteredAvailableProducts.length === 0 ? (
                    <div className="text-center py-8 text-[#6E6E73] border border-dashed border-[#E5E5EA] rounded-xl">
                      Nenhum produto encontrado com &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
                      {filteredAvailableProducts.map((product) => (
                        <label
                          key={product.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E5EA] hover:bg-[#F5F5F7] cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedToAdd.has(product.id)}
                            onChange={() => handleToggleProductToAdd(product.id)}
                            className="rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                          />
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1D1D1F]">{product.name}</p>
                            <p className="text-xs text-[#6E6E73]">
                              Categoria atual: {allCategories.find(c => c.id === product.category)?.name || product.category}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              product.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {product.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={handleAddProducts}
                    disabled={selectedToAdd.size === 0 || moving}
                    loading={moving}
                    icon={<Plus className="w-4 h-4" />}
                    className="w-full"
                  >
                    Adicionar {selectedToAdd.size} produto(s) a esta categoria
                  </Button>
                </>
              )}
            </>
          ) : products.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-12 text-[#6E6E73] border border-dashed border-[#E5E5EA] rounded-xl">
                <p className="mb-4">Nenhum produto vinculado a esta categoria.</p>
                <Button
                  onClick={handleShowAddProducts}
                  icon={<Plus className="w-4 h-4" />}
                  variant="secondary"
                >
                  Adicionar produtos
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm text-[#1D1D1F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === products.length}
                    onChange={handleSelectAll}
                    className="rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                  />
                  Selecionar todos ({products.length})
                </label>
                <div className="flex items-center gap-2">
                  {selectedProducts.size > 0 && (
                    <span className="text-sm text-[#007AFF] font-medium">
                      {selectedProducts.size} selecionado(s)
                    </span>
                  )}
                  <Button
                    onClick={handleShowAddProducts}
                    icon={<Plus className="w-4 h-4" />}
                    variant="ghost"
                    size="sm"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {products.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E5EA] hover:bg-[#F5F5F7] cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleToggleProduct(product.id)}
                      className="rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                    />
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1D1D1F]">{product.name}</p>
                      <p className="text-xs text-[#6E6E73]">{product.slug}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                ))}
              </div>

              {selectedProducts.size > 0 && (
                <div className="border-t border-[#E5E5EA] pt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleUnlinkProducts}
                      disabled={unlinking}
                      loading={unlinking}
                      variant="secondary"
                      icon={<Unlink className="w-4 h-4" />}
                      className="flex-1"
                    >
                      Desvincular {selectedProducts.size} produto(s)
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E5E5EA]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-2 text-[#6E6E73]">ou mover para outra categoria</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="target-category" className="block text-sm font-medium text-[#1D1D1F] mb-2">
                      Mover para categoria:
                    </label>
                    <select
                      id="target-category"
                      value={targetCategoryId}
                      onChange={(e) => setTargetCategoryId(e.target.value)}
                      className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
                      disabled={moving || unlinking}
                    >
                      <option value="">Selecione uma categoria...</option>
                      {otherCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={handleMoveProducts}
                    disabled={!targetCategoryId || moving || unlinking}
                    loading={moving}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="w-full"
                  >
                    Mover {selectedProducts.size} produto(s)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E5EA]">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
