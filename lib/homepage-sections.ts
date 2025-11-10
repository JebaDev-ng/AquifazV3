import type { HomepageSectionItem, HomepageSectionWithItems, Product } from './types'
import { mockProducts } from './mock-data'
import { hasSupabaseConfig } from './supabase/env'
import { createServiceClient } from './supabase/service'

export interface HomepageRenderableSection {
  id: string
  layout: 'featured' | 'grid'
  title: string
  subtitle?: string | null
  viewAllLabel: string
  viewAllHref: string
  bgColor: 'white' | 'gray'
  products: Product[]
}

const hasSupabase = hasSupabaseConfig()
const HOMEPAGE_VISIBLE_PRODUCT_COUNT = 3

async function getSupabaseClient() {
  if (!hasSupabase) {
    return null
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      return createServiceClient()
    } catch (error) {
      console.error('Erro ao inicializar Supabase com service role:', error)
    }
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    return await createClient()
  } catch (error) {
    console.error('Erro ao inicializar Supabase (homepage sections):', error)
    return null
  }
}

function normalizeHref(href?: string | null) {
  if (!href) {
    return '/produtos'
  }

  const trimmed = href.trim()
  if (trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return '/produtos'
}

function mapItemProductToProduct(item: HomepageSectionItem): Product | null {
  const summary = item.product
  if (!summary) {
    return null
  }

  const fallbackId = item.product_id || item.id
  const fallbackSlug = summary.slug || summary.id || fallbackId

  return {
    id: summary.id || fallbackId,
    name: summary.name || 'Produto destacado',
    slug: fallbackSlug,
    description: summary.description || '',
    category: summary.category || 'diversos',
    price: Number(summary.price ?? 0),
    original_price: summary.original_price ? Number(summary.original_price) : undefined,
    discount_percent: summary.discount_percent ? Number(summary.discount_percent) : undefined,
    unit: summary.unit || 'unidade',
    image_url: summary.image_url || '',
    storage_path: summary.storage_path || undefined,
    created_at: new Date().toISOString(),
  }
}

function mapSectionToRenderable(section: HomepageSectionWithItems): HomepageRenderableSection | null {
  const limit = HOMEPAGE_VISIBLE_PRODUCT_COUNT
  const normalizedProducts = section.items
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapItemProductToProduct)
    .filter((product): product is Product => Boolean(product))
    .slice(0, limit)

  if (!normalizedProducts.length) {
    return null
  }

  return {
    id: section.id,
    layout: section.layout_type === 'featured' ? 'featured' : 'grid',
    title: section.title || 'Produtos',
    subtitle: section.subtitle || null,
    viewAllLabel: section.view_all_label || 'Ver todos',
    viewAllHref: normalizeHref(section.view_all_href),
    bgColor: section.bg_color === 'gray' ? 'gray' : 'white',
    products: normalizedProducts,
  }
}

function mapSectionRecord(row: any): HomepageSectionWithItems {
  const items = Array.isArray(row?.items) ? row.items.map(mapSectionItemRecord) : []
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? null,
    layout_type: row.layout_type || 'grid',
    bg_color: row.bg_color || 'white',
    limit: HOMEPAGE_VISIBLE_PRODUCT_COUNT,
    view_all_label: row.view_all_label || 'Ver todos',
    view_all_href: row.view_all_href || '/produtos',
    category_id: row.category_id ?? null,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
    config: row.config ?? {},
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
    updated_by: row.updated_by ?? undefined,
    items,
  }
}

function mapSectionItemRecord(row: any): HomepageSectionItem {
  return {
    id: row.id,
    section_id: row.section_id,
    product_id: row.product_id,
    sort_order: row.sort_order ?? 0,
    metadata: row.metadata ?? {},
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
    updated_by: row.updated_by ?? undefined,
    product: row.product
      ? {
          id: row.product.id,
          name: row.product.name,
          slug: row.product.slug,
          description: row.product.description,
          category: row.product.category,
          price: row.product.price,
          original_price: row.product.original_price,
          discount_percent: row.product.discount_percent,
          unit: row.product.unit,
          image_url: row.product.image_url,
          storage_path: row.product.storage_path,
        }
      : undefined,
  }
}

function ensureProductDefaults(product: Product): Product {
  return {
    ...product,
    unit: product.unit || 'unidade',
    image_url: product.image_url || '',
    created_at: product.created_at || new Date().toISOString(),
  }
}

function buildMockSection(params: {
  id: string
  layout: 'featured' | 'grid'
  title: string
  subtitle?: string
  viewAllHref: string
  bgColor: 'white' | 'gray'
  products: Product[]
}): HomepageRenderableSection {
  return {
    id: params.id,
    layout: params.layout,
    title: params.title,
    subtitle: params.subtitle,
    viewAllLabel: 'Ver todos',
    viewAllHref: normalizeHref(params.viewAllHref),
    bgColor: params.bgColor,
    products: params.products.map(ensureProductDefaults).slice(0, HOMEPAGE_VISIBLE_PRODUCT_COUNT),
  }
}

function buildMockSections(): HomepageRenderableSection[] {
  const featured = mockProducts.filter((product) => product.featured).slice(0, 3)
  const bestSellers = mockProducts.slice(0, 3)
  const printProducts = mockProducts.filter((product) => product.category === 'print').slice(0, 3)
  const stickerProducts = mockProducts.filter((product) => product.category === 'adesivos').slice(0, 3)
  const bannerProducts = mockProducts.filter((product) => product.category === 'banners').slice(0, 3)

  return [
    buildMockSection({
      id: 'featured_showcase',
      layout: 'featured',
      title: 'Produtos em destaque',
      subtitle: 'Confira nossos produtos mais populares',
      viewAllHref: '/produtos',
      bgColor: 'white',
      products: featured.length ? featured : bestSellers,
    }),
    buildMockSection({
      id: 'best_sellers',
      layout: 'grid',
      title: 'Mais vendidos',
      viewAllHref: '/produtos',
      bgColor: 'white',
      products: bestSellers,
    }),
    buildMockSection({
      id: 'print',
      layout: 'grid',
      title: 'Impressão',
      viewAllHref: '/produtos?category=print',
      bgColor: 'gray',
      products: printProducts.length ? printProducts : bestSellers,
    }),
    buildMockSection({
      id: 'sticker',
      layout: 'grid',
      title: 'Adesivos',
      viewAllHref: '/produtos?category=adesivos',
      bgColor: 'white',
      products: stickerProducts.length ? stickerProducts : bestSellers,
    }),
    buildMockSection({
      id: 'banners_fachadas',
      layout: 'grid',
      title: 'Banners & Fachadas',
      viewAllHref: '/produtos?category=banners',
      bgColor: 'gray',
      products: bannerProducts.length ? bannerProducts : bestSellers,
    }),
  ]
}

export async function fetchHomepageSections(
  options: { useMockData?: boolean } = {},
): Promise<HomepageRenderableSection[]> {
  if (options.useMockData) {
    return buildMockSections()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return buildMockSections()
  }

  try {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select(`
        *,
        items:homepage_section_items(
          id,
          section_id,
          product_id,
          sort_order,
          metadata,
          created_at,
          updated_at,
          updated_by,
          product:products(
            id,
            name,
            slug,
            description,
            category,
            price,
            original_price,
            discount_percent,
            unit,
            image_url,
            storage_path
          )
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('sort_order', { ascending: true, foreignTable: 'homepage_section_items' })

    if (error) {
      throw error
    }

    return (data ?? [])
      .map(mapSectionRecord)
      .map(mapSectionToRenderable)
      .filter((section): section is HomepageRenderableSection => Boolean(section))
  } catch (error) {
    console.error('Erro ao buscar seções da homepage:', error)
    return buildMockSections()
  }
}
