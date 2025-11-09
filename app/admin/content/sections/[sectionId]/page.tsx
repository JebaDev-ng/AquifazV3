'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Modal } from '@/components/admin/ui/modal'
import { FeaturedProductsSection } from '@/components/ui/featured-products-section'
import { ProductsGridSection } from '@/components/ui/products-grid-section'
import type {
  HomepageSectionItem,
  HomepageSectionProductSummary,
  HomepageSectionWithItems,
  Product,
} from '@/lib/types'

interface SectionResponse {
  section: HomepageSectionWithItems
}

interface SectionsResponse {
  section: HomepageSectionWithItems
}

interface ProductsResponse {
  products: Product[]
  pagination?: {
    page: number
    pages: number
  }
}

const LAYOUT_OPTIONS = [
  { value: 'featured', label: 'Produtos em destaque' },
  { value: 'grid', label: 'Grade' },
]

const BG_OPTIONS = [
  { value: 'white', label: 'Fundo branco' },
  { value: 'gray', label: 'Fundo cinza' },
]

const DEFAULT_FORM = {
  id: '',
  title: '',
  subtitle: '',
  layout_type: 'grid' as 'grid' | 'featured',
  bg_color: 'white' as 'white' | 'gray',
  limit: 3,
  view_all_label: 'Ver todos',
  view_all_href: '/produtos',
  category_id: '',
  sort_order: 999,
  is_active: true,
}

export default function AdminSectionDetailPage() {
  const params = useParams<{ sectionId: string }>()
  const router = useRouter()
  const sectionId = params?.sectionId || 'new'
  const isCreating = sectionId === 'new'

  const [form, setForm] = useState(DEFAULT_FORM)
  const [items, setItems] = useState<HomepageSectionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productResults, setProductResults] = useState<Product[]>([])
  const [productQuery, setProductQuery] = useState('')
  const [isSearchingProducts, setIsSearchingProducts] = useState(false)
  const [productPage, setProductPage] = useState(1)
  const [productHasMore, setProductHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (pageNumber = 1, append = false) => {
    if (!productQuery.trim()) {
      setProductResults([])
      setProductHasMore(false)
      return
    }

    setIsSearchingProducts(true)
    try {
      const response = await fetch(
        `/api/admin/products?search=${encodeURIComponent(
          productQuery.trim(),
        )}&limit=10&page=${pageNumber}`,
      )
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos.')
      }

      const payload = (await response.json()) as ProductsResponse
      const nextProducts = payload.products ?? []
      setProductResults((prev) => (append ? [...prev, ...nextProducts] : nextProducts))
      setProductPage(pageNumber)
      if (payload.pagination) {
        setProductHasMore(payload.pagination.page < payload.pagination.pages)
      } else {
        setProductHasMore(false)
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao buscar produtos.')
    } finally {
      setIsSearchingProducts(false)
    }
  }

  const loadSection = useCallback(async () => {
    if (isCreating) {
      setForm(DEFAULT_FORM)
      setItems([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/content/homepage-sections/${sectionId}`)
      if (!response.ok) {
        throw new Error('Não foi possível carregar a seção.')
      }
      const payload = (await response.json()) as SectionResponse
      const data = payload.section

      setForm({
        id: data.id,
        title: data.title,
        subtitle: data.subtitle ?? '',
        layout_type: data.layout_type,
        bg_color: data.bg_color,
        limit: data.limit ?? 3,
        view_all_label: data.view_all_label || 'Ver todos',
        view_all_href: data.view_all_href || '/produtos',
        category_id: data.category_id ?? '',
        sort_order: data.sort_order ?? 1,
        is_active: data.is_active ?? true,
      })
      setItems(data.items ?? [])
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar seção.')
    } finally {
      setIsLoading(false)
    }
  }, [sectionId, isCreating])

  useEffect(() => {
    loadSection()
  }, [loadSection])

  const handleInputChange = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSection = async () => {
    if (!form.title.trim()) {
      alert('Informe um título para a seção.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        id: form.id.trim() || undefined,
        title: form.title.trim(),
        subtitle: form.subtitle?.trim() || undefined,
        layout_type: form.layout_type,
        bg_color: form.bg_color,
        limit: Number(form.limit) || 3,
        view_all_label: form.view_all_label.trim() || 'Ver todos',
        view_all_href: form.view_all_href.trim() || '/produtos',
        category_id: form.category_id?.trim() || undefined,
        sort_order: form.sort_order,
        is_active: form.is_active,
      }

      const endpoint = isCreating
        ? '/api/admin/content/homepage-sections'
        : `/api/admin/content/homepage-sections/${form.id}`
      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'Não foi possível salvar a seção.')
      }

      const { section } = (await response.json()) as SectionsResponse
      if (isCreating) {
        router.replace(`/admin/content/sections/${section.id}`)
      }
      setForm((prev) => ({ ...prev, id: section.id }))
      setItems(section.items ?? items)
      alert('Seção salva com sucesso.')
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao salvar seção.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!form.id) return
    try {
      const response = await fetch(
        `/api/admin/content/homepage-sections/${form.id}/items/${itemId}`,
        {
          method: 'DELETE',
        },
      )
      if (!response.ok) {
        throw new Error('Não foi possível remover o produto.')
      }
      setItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao remover produto.')
    }
  }

  const handleMoveItem = async (itemId: string, direction: number) => {
    if (!form.id) return
    const index = items.findIndex((item) => item.id === itemId)
    const targetIndex = index + direction
    if (index === -1 || targetIndex < 0 || targetIndex >= items.length) return

    const reordered = [...items]
    const [removed] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, removed)
    setItems(reordered)

    try {
      const payload = {
        items: reordered.map((item, position) => ({
          id: item.id,
          sort_order: position + 1,
        })),
      }

      const response = await fetch(
        `/api/admin/content/homepage-sections/${form.id}/items/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      if (!response.ok) {
        throw new Error('Não foi possível reordenar os produtos.')
      }
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao reordenar produtos.')
    }
  }

  const handleSearchProducts = async () => {
    await fetchProducts(1, false)
  }

  const handleLoadMoreProducts = async () => {
    if (productHasMore && !isSearchingProducts) {
      await fetchProducts(productPage + 1, true)
    }
  }

  const handleAddProductToSection = async (product: Product) => {
    if (!form.id) {
      alert('Salve a seção antes de adicionar produtos.')
      return
    }
    if (!isProductUsable(product)) {
      alert('O produto precisa de preço e unidade antes de ser exibido na homepage.')
      return
    }
    try {
      const response = await fetch(`/api/admin/content/homepage-sections/${form.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'Erro ao adicionar produto.')
      }

      const payload = await response.json()
      const newItem = payload.item as HomepageSectionItem
      setItems((prev) => [...prev, newItem])
      alert('Produto adicionado.')
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Erro ao adicionar produto.')
    }
  }

  const isProductUsable = (product: Product) =>
    Boolean(product.unit && product.unit.trim().length > 0 && product.price !== null && product.price !== undefined)

  const previewProducts: Product[] = useMemo(() => {
    const resolved = items
      .map((item) => mapItemToProduct(item))
      .filter((product): product is Product => Boolean(product))
      .slice(0, form.limit || 3)

    if (resolved.length === 0) {
      return PREVIEW_PLACEHOLDER_PRODUCTS.slice(0, form.limit || 3)
    }

    return resolved
  }, [items, form.limit])

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#6E6E73] mb-2">
            {isCreating ? 'Nova seção' : `Editando seção #${form.sort_order ?? ''}`}
          </p>
          <h1 className="text-3xl font-normal text-[#1D1D1F]">
            {isCreating ? 'Criar seção da homepage' : form.title || 'Seção'}
          </h1>
          <p className="text-[#6E6E73] mt-2 max-w-3xl">
            Configure os textos, CTA e produtos exibidos neste bloco. A prévia usa o mesmo componente da
            homepage pública para garantir fidelidade visual.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/content/sections">
            <Button variant="secondary">Voltar</Button>
          </Link>
          <Button onClick={handleSaveSection} loading={isSaving}>
            {isCreating ? 'Criar seção' : 'Salvar alterações'}
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6 space-y-4">
          <div className="h-6 w-1/3 rounded bg-[#F5F5F5] animate-pulse" />
          <div className="h-32 rounded bg-[#F5F5F5] animate-pulse" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[60%_40%]">
          <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6 space-y-6">
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Identificador (slug)"
                  value={form.id}
                  onChange={(event) => handleInputChange('id', event.target.value)}
                  placeholder="ex.: featured_showcase"
                  disabled={!isCreating}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1D1D1F]">Layout</label>
                  <select
                    value={form.layout_type}
                    onChange={(event) =>
                      handleInputChange('layout_type', event.target.value as 'grid' | 'featured')
                    }
                    className="w-full rounded-lg border border-[#D2D2D7] bg-white px-4 py-2 text-sm text-[#1D1D1F]"
                  >
                    {LAYOUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                label="Título"
                value={form.title}
                onChange={(event) => handleInputChange('title', event.target.value)}
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1D1D1F]">Subtítulo</label>
                <textarea
                  className="w-full rounded-lg border border-[#D2D2D7] bg-white px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF] focus-visible:border-[#007AFF]"
                  rows={2}
                  value={form.subtitle ?? ''}
                  onChange={(event) => handleInputChange('subtitle', event.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Texto do link"
                  value={form.view_all_label}
                  onChange={(event) => handleInputChange('view_all_label', event.target.value)}
                />
                <Input
                  label="URL do link"
                  value={form.view_all_href}
                  onChange={(event) => handleInputChange('view_all_href', event.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Quantidade máxima de produtos"
                  type="number"
                  min={1}
                  max={12}
                  value={form.limit}
                  onChange={(event) =>
                    handleInputChange('limit', Number(event.target.value) || form.limit)
                  }
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1D1D1F]">Fundo</label>
                  <select
                    value={form.bg_color}
                    onChange={(event) =>
                      handleInputChange('bg_color', event.target.value as 'white' | 'gray')
                    }
                    className="w-full rounded-lg border border-[#D2D2D7] bg-white px-4 py-2 text-sm text-[#1D1D1F]"
                  >
                    {BG_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Categoria vinculada (opcional)"
                  value={form.category_id}
                  onChange={(event) => handleInputChange('category_id', event.target.value)}
                  placeholder="ex.: banners"
                  helper="Usado apenas para controle interno."
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#1D1D1F]">Seção ativa</label>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => handleInputChange('is_active', event.target.checked)}
                  className="h-4 w-4 rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-[#1D1D1F]">Produtos da seção</h2>
                  <p className="text-sm text-[#6E6E73]">
                    {form.id
                      ? 'Arraste para reordenar ou adicione novos produtos por meio da busca.'
                      : 'Salve a seção para liberar a seleção de produtos.'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(true)}
                  disabled={!form.id}
                >
                  Adicionar produto
                </Button>
              </div>

              <div className="space-y-3">
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#D2D2D7] p-6 text-center text-sm text-[#6E6E73]">
                    Nenhum produto vinculado ainda.
                  </div>
                )}

                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[#E5E5EA] bg-[#FAFAFA] p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1F]">
                        {item.product?.name || 'Produto removido'}
                      </p>
                      <p className="text-xs text-[#6E6E73]">
                        Ordem #{index + 1} · {item.product?.category || 'categoria desconhecida'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMoveItem(item.id, -1)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMoveItem(item.id, 1)}
                        disabled={index === items.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="rounded-2xl border border-[#E5E5EA] bg-white p-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#6E6E73]">Preview</p>
              <h2 className="text-lg font-medium text-[#1D1D1F]">Visual da homepage</h2>
            </div>
            {form.layout_type === 'featured' ? (
              <FeaturedProductsSection
                products={previewProducts}
                title={form.title || 'Produtos em destaque'}
                subtitle={form.subtitle || undefined}
                viewAllHref={form.view_all_href}
                viewAllLabel={form.view_all_label}
                bgColor={form.bg_color}
              />
            ) : (
              <ProductsGridSection
                products={previewProducts}
                title={form.title || 'Produtos'}
                subtitle={form.subtitle || undefined}
                viewAllHref={form.view_all_href}
                viewAllLabel={form.view_all_label}
                bgColor={form.bg_color}
              />
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar produto"
        description="Busque produtos cadastrados e vincule a esta seção."
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Buscar por nome ou descrição"
              value={productQuery}
              onChange={(event) => setProductQuery(event.target.value)}
            />
            <Button variant="secondary" onClick={handleSearchProducts} loading={isSearchingProducts}>
              Buscar
            </Button>
          </div>
          <div className="space-y-3 max-h-96 overflow-auto">
            {productResults.map((product) => {
              const isValidProduct = isProductUsable(product)
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-[#E5E5EA] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]">{product.name}</p>
                    <p className="text-xs text-[#6E6E73]">
                      {product.category || 'categoria desconhecida'} · {product.unit || 'unidade'}
                    </p>
                    {!isValidProduct && (
                      <p className="text-xs text-red-500 mt-1">
                        Defina preço e unidade no cadastro do produto para habilitar.
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddProductToSection(product)}
                    disabled={!isValidProduct}
                    title={
                      isValidProduct
                        ? undefined
                        : 'Produto precisa de preço e unidade para aparecer na homepage.'
                    }
                  >
                    Adicionar
                  </Button>
                </div>
              )
            })}
            {productResults.length === 0 && !isSearchingProducts && (
              <p className="text-sm text-[#6E6E73]">Nenhum produto encontrado.</p>
            )}
            {productHasMore && (
              <div className="text-center">
                <Button
                  variant="secondary"
                  onClick={handleLoadMoreProducts}
                  loading={isSearchingProducts}
                >
                  Carregar mais
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

function mapItemToProduct(item: HomepageSectionItem): Product | null {
  if (!item.product) return null
  const summary = item.product as HomepageSectionProductSummary
  return {
    id: summary.id,
    name: summary.name,
    slug: summary.slug,
    description: summary.description || '',
    category: summary.category || 'diversos',
    price: Number(summary.price ?? 0),
    unit: summary.unit || 'unidade',
    image_url: summary.image_url || '',
    storage_path: summary.storage_path || undefined,
    created_at: new Date().toISOString(),
  }
}
const PREVIEW_PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: 'preview-1',
    name: 'Cartões de Visita Premium',
    slug: 'cartoes-visita-preview',
    description: 'Produto demonstrativo',
    category: 'preview',
    price: 89.9,
    unit: 'unidade',
    image_url: '',
    created_at: new Date().toISOString(),
  },
  {
    id: 'preview-2',
    name: 'Adesivos Personalizados',
    slug: 'adesivos-preview',
    description: 'Produto demonstrativo',
    category: 'preview',
    price: 59.9,
    unit: 'unidade',
    image_url: '',
    created_at: new Date().toISOString(),
  },
  {
    id: 'preview-3',
    name: 'Banner 1x2m',
    slug: 'banner-preview',
    description: 'Produto demonstrativo',
    category: 'preview',
    price: 149.9,
    unit: 'unidade',
    image_url: '',
    created_at: new Date().toISOString(),
  },
]
