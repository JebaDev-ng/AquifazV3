import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import { requireEditor, logActivity } from '@/lib/admin/auth'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_BUCKETS = new Set(['media', 'products', 'categories', 'banners', 'content_sections', 'hero'])

function sanitizeSegment(value: string, fallback: string) {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9-_]/g, '')
  return cleaned || fallback
}

export async function POST(request: NextRequest) {
  try {
    await requireEditor()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = (formData.get('category') as string) || 'general'
    const altText = (formData.get('alt_text') as string) || ''
    const bucket = (formData.get('bucket') as string) || 'media'
    const entity = (formData.get('entity') as string) || bucket
    const entityId = (formData.get('entity_id') as string) || uuidv4()
    const fileRole = (formData.get('file_role') as string) || uuidv4()

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: 'Bucket inválido' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const image = sharp(buffer)
    const metadata = await image.metadata()

    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const sanitizedEntity = sanitizeSegment(entity, bucket)
    const sanitizedEntityId = sanitizeSegment(entityId, uuidv4())
    const sanitizedRole = sanitizeSegment(fileRole, uuidv4())
    const fileName = `${sanitizedRole}.${extension}`
    const storagePath = `${sanitizedEntity}/${sanitizedEntityId}/${fileName}`

    let optimizedBuffer: Buffer
    if (file.type === 'image/gif') {
      optimizedBuffer = buffer
    } else {
      optimizedBuffer = await image
        .resize(2000, 2000, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer()
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, optimizedBuffer, {
        contentType: file.type === 'image/gif' ? file.type : 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json({ error: 'Erro no upload do arquivo' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath)

    const { data: mediaRecord, error: dbError } = await supabase
      .from('media')
      .insert({
        filename: fileName,
        original_name: file.name,
        url: publicUrl,
        storage_path: storagePath,
        size: optimizedBuffer.length,
        mime_type: file.type === 'image/gif' ? file.type : 'image/jpeg',
        width: metadata.width,
        height: metadata.height,
        alt_text: altText,
        category,
        uploaded_by: user?.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      await supabase.storage.from(bucket).remove([storagePath])
      console.error('Erro ao salvar metadados:', dbError)
      return NextResponse.json({ error: 'Erro ao salvar arquivo' }, { status: 500 })
    }

    await logActivity('media_uploaded', 'media', mediaRecord.id, undefined, {
      filename: fileName,
      original_name: file.name,
      size: optimizedBuffer.length,
      category,
      bucket,
    })

    return NextResponse.json({
      id: mediaRecord.id,
      url: publicUrl,
      storagePath,
      bucket,
      filename: fileName,
      original_name: file.name,
      size: optimizedBuffer.length,
      width: metadata.width,
      height: metadata.height,
      alt_text: altText,
      category,
      entity: sanitizedEntity,
      entityId: sanitizedEntityId,
    })
  } catch (error: any) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireEditor()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('media')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: media, error, count } = await query

    if (error) {
      console.error('Erro ao buscar mídia:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error('Erro na API de mídia:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
