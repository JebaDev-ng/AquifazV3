import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporariamente desabilitado para desenvolvimento local
  // Middleware de auth será configurado depois
  
  return NextResponse.next()
}
            )
          },
        },
      }
    )

    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirecionar para login se não estiver autenticado
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url))
    }

    // Verificar se tem permissões administrativas
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      // Redirecionar para página de acesso negado
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}