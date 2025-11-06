'use client'

import { Navbar } from '@/components/ui/header/navbar'
import { Footer } from '@/components/ui/footer/footer'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
