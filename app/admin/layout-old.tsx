// SUPABASE IMPORTS - Comentado para desenvolvimento local
// import { requireEditor } from '@/lib/admin/auth'

// LOCAL IMPORTS - Para desenvolvimento local
import { requireEditor } from '@/lib/admin/auth-local'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { AdminHeader } from '@/components/admin/layout/admin-header'
import { Suspense } from 'react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar permissões antes de renderizar o layout
  await requireEditor()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Painel Administrativo - AquiFaz',
  description: 'Painel de controle para gerenciar produtos e conteúdo',
}