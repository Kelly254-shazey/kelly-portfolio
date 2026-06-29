'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={300} refetchWhenOffline={false}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
