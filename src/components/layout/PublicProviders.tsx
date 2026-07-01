'use client'

import { ThemeProvider } from './ThemeProvider'

export function PublicProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider forceTheme="light">{children}</ThemeProvider>
}
