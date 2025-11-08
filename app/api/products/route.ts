import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Por enquanto retorna dados mockados
    const products: any[] = []

    return NextResponse.json({ 
      products,
      total: products.length 
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao carregar produtos' },
      { status: 500 }
    )
  }
}
