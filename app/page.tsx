import { HeroSection } from '@/components/ui/hero/hero-section'
import { CategoriesSection } from '@/components/ui/categories-section'
import { FeaturedProductsSection } from '@/components/ui/featured-products-section'
import { ProductsGridSection } from '@/components/ui/products-grid-section'
import { ImageBannerSection } from '@/components/ui/image-banner-section'
import { PricingSection } from '@/components/ui/pricing/pricing-section'
import { mockProducts } from '@/lib/mock-data'

export const revalidate = 3600 // Revalidate every hour

async function getProducts() {
  // Check if Supabase is configured
  const hasSupabase = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

  if (!hasSupabase) {
    // Return mock data for development
    return mockProducts.slice(0, 12)
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching products:', error)
      return mockProducts.slice(0, 12)
    }

    return products || mockProducts.slice(0, 12)
  } catch (error) {
    console.error('Supabase error:', error)
    return mockProducts.slice(0, 12)
  }
}

async function getProductsByCategory(category: string) {
  // Check if Supabase is configured
  const hasSupabase = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'

  if (!hasSupabase) {
    // Return mock data for development
    return mockProducts.filter(p => p.category === category).slice(0, 8)
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error(`Error fetching ${category} products:`, error)
      return mockProducts.filter(p => p.category === category).slice(0, 8)
    }

    return products || mockProducts.filter(p => p.category === category).slice(0, 8)
  } catch (error) {
    console.error('Supabase error:', error)
    return mockProducts.filter(p => p.category === category).slice(0, 8)
  }
}

export default async function Home() {
  const [
    featuredProducts,
    printProducts,
    stickerProducts,
    bannerProducts,
  ] = await Promise.all([
    getProducts(),
    getProductsByCategory('print'),
    getProductsByCategory('adesivos'),
    getProductsByCategory('banners'),
  ])

  return (
    <>
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Featured Products Grid */}
      <FeaturedProductsSection />

      {/* More Products */}
      <ProductsGridSection
        title="Mais vendidos"
        products={featuredProducts}
        viewAllHref="/produtos"
        bgColor="white"
      />

      {/* Print Products */}
      {printProducts.length > 0 && (
        <ProductsGridSection
          title="Impressão"
          products={printProducts}
          viewAllHref="/produtos?category=print"
          bgColor="gray"
        />
      )}

      {/* Stickers */}
      {stickerProducts.length > 0 && (
        <ProductsGridSection
          title="Adesivos"
          products={stickerProducts}
          viewAllHref="/produtos?category=adesivos"
          bgColor="white"
        />
      )}

      {/* Image Banner */}
      <ImageBannerSection href="https://wa.me/5563992731977?text=Olá!%20Vi%20o%20banner%20promocional%20no%20site%20e%20gostaria%20de%20mais%20informações." />

      {/* Banners */}
      {bannerProducts.length > 0 && (
        <ProductsGridSection
          title="Banners & Fachadas"
          products={bannerProducts}
          viewAllHref="/produtos?category=banners"
          bgColor="gray"
        />
      )}

      {/* Pricing */}
      <PricingSection />
    </>
  )
}
