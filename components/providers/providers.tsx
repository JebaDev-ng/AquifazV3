'use client'

import { ThemeProvider } from 'next-themes'
import { LayoutContent } from './layout-content'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      disableTransitionOnChange
    >
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  )
}
