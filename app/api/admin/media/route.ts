import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: media, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(media || [])
  } catch (error) {
    console.error('Erro ao buscar mídia:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mídia' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',') || []

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum ID fornecido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Buscar arquivos para deletar do storage
    const { data: mediaItems } = await supabase
      .from('media')
      .select('filename')
      .in('id', ids)

    // Deletar do banco
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .in('id', ids)

    if (dbError) {
      throw dbError
    }

    // Deletar arquivos do storage
    if (mediaItems && mediaItems.length > 0) {
      const filenames = mediaItems.map(item => item.filename)
      await supabase.storage
        .from('media')
        .remove(filenames)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar mídia:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar mídia' },
      { status: 500 }
    )
  }
}