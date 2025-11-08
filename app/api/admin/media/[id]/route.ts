import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const supabase = await createClient()
    
    // Buscar arquivo para deletar do storage
    const { data: mediaItem } = await supabase
      .from('media')
      .select('filename')
      .eq('id', id)
      .single()

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Deletar do banco
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw dbError
    }

    // Deletar arquivo do storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([mediaItem.filename])

    if (storageError) {
      console.error('Erro ao deletar arquivo do storage:', storageError)
      // Não falhar a operação se o arquivo não existir no storage
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