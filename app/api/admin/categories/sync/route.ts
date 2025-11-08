import { NextResponse } from 'next/server'

import { requireAdmin, logActivity } from '@/lib/admin/auth'
import { DEFAULT_PRODUCT_CATEGORIES } from '@/lib/content'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  await requireAdmin()
  const supabase = await createClient()
  const timestamp = new Date().toISOString()

  const payload = DEFAULT_PRODUCT_CATEGORIES.map((category, index) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon,
    image_url: category.image_url,
    active: category.active ?? true,
    sort_order: category.sort_order ?? index + 1,
    updated_at: timestamp,
    created_at: timestamp,
  }))

  const { data, error } = await supabase
    .from('product_categories')
    .upsert(payload, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('Erro ao sincronizar categorias:', error)
    return NextResponse.json(
      { error: 'Não foi possível sincronizar as categorias base.' },
      { status: 500 }
    )
  }

  await logActivity('category_synced', 'product_category', undefined, undefined, {
    synced: payload.map((item) => item.id),
  })

  return NextResponse.json({ categories: data ?? [] })
}
