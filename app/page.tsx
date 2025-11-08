import { HeroSection } from '@/components/ui/hero/hero-section'
import { CategoriesSection } from '@/components/ui/categories-section'
import { FeaturedProductsSection } from '@/components/ui/featured-products-section'
import { ProductsGridSection } from '@/components/ui/products-grid-section'
import { ImageBannerSection } from '@/components/ui/image-banner-section'
import { PricingSection } from '@/components/ui/pricing/pricing-section'
import {
  DEFAULT_BANNER_CONTENT,
  DEFAULT_HERO_CONTENT,
  HERO_SECTION_ID,
  BANNER_SECTION_ID,
  DEFAULT_PRODUCT_CATEGORIES,
  DEFAULT_HOMEPAGE_SETTINGS,
  HOMEPAGE_SETTINGS_ID,
} from '@/lib/content'
import { readLocalHomepageSettings } from '@/lib/homepage-settings'
import { mockProducts } from '@/lib/mock-data'
import type { BannerContent, HeroContent, HomepageSettings, Product, ProductCategory } from '@/lib/types'
import { hasSupabaseConfig } from '@/lib/supabase/env'

export const revalidate = 3600

const hasSupabase = hasSupabaseConfig()

type HomepageProductRow = {
  id: string
  name: string
  slug: string
  description?: string | null
  category_id: string
  price?: number | null
  unit?: string | null
  image_url?: string | null
  gallery?: string[] | null
  featured?: boolean | null
  show_on_home?: boolean | null
  show_on_featured?: boolean | null
  sort_order?: number | null
  created_at?: string | null
  updated_at?: string | null
}

async function getSupabaseClient() {
  if (!hasSupabase) {
    return null
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    return await createClient()
  } catch (error) {
    console.error('Erro ao inicializar Supabase:', error)
    return null
  }
}

function mapHomepageProduct(row: HomepageProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    category: row.category_id,
    price: Number(row.price ?? 0),
    unit: row.unit || 'unidade',
    image_url: row.image_url || '',
    images: row.gallery || [],
    featured: Boolean(row.featured),
    show_on_home: Boolean(row.show_on_home ?? true),
    show_on_featured: Boolean(row.show_on_featured),
    sort_order: row.sort_order ?? 0,
    active: true,
    created_at: row.created_at || new Date().toISOString(),
  }
}

async function getHomepageSettings(): Promise<HomepageSettings> {
  const supabase = await getSupabaseClient()
  if (!supabase) {
    return readLocalHomepageSettings()
  }

  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('data')
      .eq('id', HOMEPAGE_SETTINGS_ID)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return {
      ...DEFAULT_HOMEPAGE_SETTINGS,
      use_mock_data: data?.data?.use_mock_data ?? DEFAULT_HOMEPAGE_SETTINGS.use_mock_data,
    }
  } catch (error) {
    console.warn('Configurações da homepage indisponíveis, usando fallback local.', error)
    return readLocalHomepageSettings()
  }
}

async function getHeroContent(useMockData = false): Promise<HeroContent> {
  if (useMockData) {
    return DEFAULT_HERO_CONTENT
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return DEFAULT_HERO_CONTENT
  }

  try {
    const { data, error } = await supabase
      .from('homepage_hero_content')
      .select('*')
      .eq('id', HERO_SECTION_ID)
      .maybeSingle()

    if (!error && data) {
      return {
        subtitle: data.subtitle || DEFAULT_HERO_CONTENT.subtitle,
        title: data.title || DEFAULT_HERO_CONTENT.title,
        description: data.description || DEFAULT_HERO_CONTENT.description,
        whatsapp_number: data.whatsapp_number || DEFAULT_HERO_CONTENT.whatsapp_number,
        whatsapp_message: data.whatsapp_message || DEFAULT_HERO_CONTENT.whatsapp_message,
        promo_image_url: data.promo_image_url || DEFAULT_HERO_CONTENT.promo_image_url,
        promo_title: data.promo_title || DEFAULT_HERO_CONTENT.promo_title,
        promo_subtitle: data.promo_subtitle || DEFAULT_HERO_CONTENT.promo_subtitle,
      }
    }
  } catch (error) {
    console.warn('Hero homepage content indisponível, tentando content_sections…', error)
  }

  try {
    const { data } = await supabase
      .from('content_sections')
      .select('*')
      .eq('id', HERO_SECTION_ID)
      .eq('active', true)
      .maybeSingle()

    if (data) {
      return {
        subtitle: data.subtitle || DEFAULT_HERO_CONTENT.subtitle,
        title: data.title || DEFAULT_HERO_CONTENT.title,
        description: data.description || DEFAULT_HERO_CONTENT.description,
        whatsapp_number: data.data?.whatsapp_number || DEFAULT_HERO_CONTENT.whatsapp_number,
        whatsapp_message: data.data?.whatsapp_message || DEFAULT_HERO_CONTENT.whatsapp_message,
        promo_image_url: data.image_url || DEFAULT_HERO_CONTENT.promo_image_url,
        promo_title: data.data?.promo_title || DEFAULT_HERO_CONTENT.promo_title,
        promo_subtitle: data.data?.promo_subtitle || DEFAULT_HERO_CONTENT.promo_subtitle,
      }
    }
  } catch (error) {
    console.error('Erro ao carregar hero (fallback):', error)
  }

  return DEFAULT_HERO_CONTENT
}

async function getBannerContent(useMockData = false): Promise<BannerContent> {
  if (useMockData) {
    return DEFAULT_BANNER_CONTENT
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return DEFAULT_BANNER_CONTENT
  }

  try {
    const { data } = await supabase
      .from('homepage_banner_sections')
      .select('*')
      .eq('id', BANNER_SECTION_ID)
      .maybeSingle()

    if (data) {
      return {
        id: data.id,
        enabled: data.active ?? DEFAULT_BANNER_CONTENT.enabled,
        title: data.title || DEFAULT_BANNER_CONTENT.title,
        description: data.description || DEFAULT_BANNER_CONTENT.description,
        text: data.text || DEFAULT_BANNER_CONTENT.text,
        background_color: data.background_color || DEFAULT_BANNER_CONTENT.background_color,
        text_color: data.text_color || DEFAULT_BANNER_CONTENT.text_color,
        link: data.link || DEFAULT_BANNER_CONTENT.link,
        image_url: data.image_url || DEFAULT_BANNER_CONTENT.image_url,
      }
    }
  } catch (error) {
    console.warn('Banner homepage table indisponível, tentando content_sections…', error)
  }

  try {
    const { data } = await supabase
      .from('content_sections')
      .select('*')
      .eq('id', BANNER_SECTION_ID)
      .maybeSingle()

    if (data) {
      return {
        id: data.id,
        enabled: data.active ?? DEFAULT_BANNER_CONTENT.enabled,
        title: data.title || DEFAULT_BANNER_CONTENT.title,
        description: data.description || DEFAULT_BANNER_CONTENT.description,
        text: data.data?.text || DEFAULT_BANNER_CONTENT.text,
        background_color: data.data?.background_color || DEFAULT_BANNER_CONTENT.background_color,
        text_color: data.data?.text_color || DEFAULT_BANNER_CONTENT.text_color,
        link: data.data?.link || DEFAULT_BANNER_CONTENT.link,
        image_url: data.image_url || data.data?.image_url || DEFAULT_BANNER_CONTENT.image_url,
      }
    }
  } catch (error) {
    console.error('Erro ao carregar banner (fallback):', error)
  }

  return DEFAULT_BANNER_CONTENT
}

async function getProductCategories(useMockData = false): Promise<ProductCategory[]> {
  if (useMockData) {
    return DEFAULT_PRODUCT_CATEGORIES
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return DEFAULT_PRODUCT_CATEGORIES
  }

  try {
    const { data } = await supabase
      .from('homepage_categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (data && data.length > 0) {
      return data
    }
  } catch (error) {
    console.warn('Categorias homepage indisponíveis, tentando legacy…', error)
  }

  try {
    const { data } = await supabase
      .from('product_categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (data && data.length > 0) {
      return data
    }
  } catch (error) {
    console.error('Erro ao carregar categorias (fallback):', error)
  }

  return DEFAULT_PRODUCT_CATEGORIES
}

async function getHomepageProductData(
  filter: { featured?: boolean; showOnHome?: boolean; showOnFeatured?: boolean; category?: string } = {},
  limit = 12,
  useMockData = false
): Promise<Product[] | null> {
  if (useMockData) {
    return null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) return null

  try {
    let query = supabase
      .from<HomepageProductRow>('homepage_products')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (filter.featured !== undefined) {
      query = query.eq('featured', filter.featured)
    }
    if (filter.showOnHome !== undefined) {
      query = query.eq('show_on_home', filter.showOnHome)
    }
    if (filter.showOnFeatured !== undefined) {
      query = query.eq('show_on_featured', filter.showOnFeatured)
    }
    if (filter.category) {
      query = query.eq('category_id', filter.category)
    }
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return null
    }

    return data.map(mapHomepageProduct)
  } catch (error) {
    console.error('Erro ao buscar homepage_products:', error)
    return null
  }
}

async function fetchLegacyFeaturedProducts(): Promise<Product[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) {
    return mockProducts.filter((product) => product.featured).slice(0, 6)
  }

  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .order('updated_at', { ascending: false })
      .limit(6)

    if (data && data.length > 0) {
      return data
    }

    const { data: fallback } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('updated_at', { ascending: false })
      .limit(6)

    return fallback || mockProducts.filter((product) => product.featured).slice(0, 6)
  } catch (error) {
    console.error('Erro ao buscar destaques legacy:', error)
    return mockProducts.filter((product) => product.featured).slice(0, 6)
  }
}

async function fetchLegacyProducts(limit = 12): Promise<Product[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) {
    return mockProducts.slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('show_on_home', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return data || mockProducts.slice(0, limit)
  } catch (error) {
    console.error('Erro ao buscar produtos legacy:', error)
    return mockProducts.slice(0, limit)
  }
}

async function fetchLegacyProductsByCategory(category: string, limit = 8): Promise<Product[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) {
    return mockProducts.filter((product) => product.category === category).slice(0, limit)
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('active', true)
      .eq('show_on_home', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    if (data) {
      return data
    }

    return mockProducts.filter((product) => product.category === category).slice(0, limit)
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${category} (legacy):`, error)
    return mockProducts.filter((product) => product.category === category).slice(0, limit)
  }
}

async function getFeaturedShowcaseProducts(useMockData = false): Promise<Product[]> {
  if (useMockData) {
    return mockProducts.filter((product) => product.featured).slice(0, 6)
  }

  const homepageProducts = await getHomepageProductData({ featured: true }, 6, useMockData)
  if (homepageProducts) {
    return homepageProducts
  }

  return fetchLegacyFeaturedProducts()
}

async function getProducts(useMockData = false): Promise<Product[]> {
  if (useMockData) {
    return mockProducts.slice(0, 12)
  }

  const homepageProducts = await getHomepageProductData({ showOnHome: true }, 12, useMockData)
  if (homepageProducts) {
    return homepageProducts
  }

  return fetchLegacyProducts(12)
}

async function getProductsByCategory(category: string, useMockData = false): Promise<Product[]> {
  if (useMockData) {
    return mockProducts.filter((product) => product.category === category).slice(0, 8)
  }

  const homepageProducts = await getHomepageProductData({ category, showOnHome: true }, 8, useMockData)
  if (homepageProducts) {
    return homepageProducts
  }

  return fetchLegacyProductsByCategory(category, 8)
}

export default async function Home() {
  const homepageSettings = await getHomepageSettings()
  const useMockData = homepageSettings.use_mock_data || !hasSupabase

  const [
    heroContent,
    bannerContent,
    categories,
    showcaseProducts,
    featuredProducts,
    printProducts,
    stickerProducts,
    bannerProducts,
  ] = await Promise.all([
    getHeroContent(useMockData),
    getBannerContent(useMockData),
    getProductCategories(useMockData),
    getFeaturedShowcaseProducts(useMockData),
    getProducts(useMockData),
    getProductsByCategory('print', useMockData),
    getProductsByCategory('adesivos', useMockData),
    getProductsByCategory('banners', useMockData),
  ])

  return (
    <>
      <HeroSection content={heroContent} />

      <CategoriesSection categories={categories} />

      <FeaturedProductsSection products={showcaseProducts} />

      <ProductsGridSection
        title="Mais vendidos"
        products={featuredProducts}
        viewAllHref="/produtos"
        bgColor="white"
      />

      {printProducts.length > 0 && (
        <ProductsGridSection
          title="Impressão"
          products={printProducts}
          viewAllHref="/produtos?category=print"
          bgColor="gray"
        />
      )}

      {stickerProducts.length > 0 && (
        <ProductsGridSection
          title="Adesivos"
          products={stickerProducts}
          viewAllHref="/produtos?category=adesivos"
          bgColor="white"
        />
      )}

      <ImageBannerSection banner={bannerContent} />

      {bannerProducts.length > 0 && (
        <ProductsGridSection
          title="Banners & Fachadas"
          products={bannerProducts}
          viewAllHref="/produtos?category=banners"
          bgColor="gray"
        />
      )}

      <PricingSection />
    </>
  )
}
