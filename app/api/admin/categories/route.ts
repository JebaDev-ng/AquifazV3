import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireAdmin, requireEditor, logActivity } from '@/lib/admin/auth'
import { DEFAULT_PRODUCT_CATEGORIES, slugifyId } from '@/lib/content'
import { createClient } from '@/lib/supabase/server'

const imageSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .refine(
    (value) => !value || value.startsWith('/') || /^https?:\/\//.test(value),
    'Informe uma URL completa (https://) ou um caminho relativo iniciando com /.'
  )

const baseCategorySchema = z.object({
  id: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras, números e hífens'),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(200).optional(),
  icon: z.string().trim().max(80).optional(),
  image_url: imageSchema,
  storage_path: z.string().optional(),
  sort_order: z.number().int().min(0).max(100).optional(),
  active: z.boolean().optional(),
})

const createCategorySchema = baseCategorySchema.partial({ id: true })

export async function GET(request: NextRequest) {
  await requireEditor()
  const supabase = await createClient()
  const { searchParams } = request.nextUrl
  const activeParam = searchParams.get('active')
  const includeDefaults = searchParams.get('with_defaults') === 'true'

  let query = supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (activeParam === 'true') {
    query = query.eq('active', true)
  } else if (activeParam === 'false') {
    query = query.eq('active', false)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Não foi possível carregar as categorias' },
      { status: 500 }
    )
  }

  if ((!data || data.length === 0) && includeDefaults) {
    return NextResponse.json({ categories: DEFAULT_PRODUCT_CATEGORIES })
  }

  return NextResponse.json({ categories: data ?? [] })
}

export async function POST(request: NextRequest) {
  await requireAdmin()

  try {
    const body = await request.json()
    const parsed = createCategorySchema.parse(body)

    const id = slugifyId(parsed.id ?? parsed.name)
    const now = new Date().toISOString()

    const supabase = await createClient()
    const payload = {
      id,
      name: parsed.name,
      description: parsed.description,
      icon: parsed.icon,
      image_url: parsed.image_url,
      storage_path: parsed.storage_path || null,
      sort_order: parsed.sort_order ?? DEFAULT_PRODUCT_CATEGORIES.length + 1,
      active: parsed.active ?? true,
      created_at: now,
      updated_at: now,
    }

    const { data, error } = await supabase
      .from('product_categories')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar categoria:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    await logActivity('category_created', 'product_category', id, undefined, payload)

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Erro inesperado ao criar categoria:', error)
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
