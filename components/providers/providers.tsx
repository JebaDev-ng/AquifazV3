'use client'

import { ThemeProvider } from './theme-provider'
import { LayoutContent } from './layout-content'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  )
}
