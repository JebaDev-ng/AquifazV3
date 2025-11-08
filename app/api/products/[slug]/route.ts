import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Por enquanto retorna dados mockados
    const product = null

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar produto' },
      { status: 500 }
    )
  }
}
