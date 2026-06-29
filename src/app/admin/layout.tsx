import { Providers } from '@/components/layout/Providers'
import { AdminShell } from './AdminShell'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AdminShell>{children}</AdminShell>
    </Providers>
  )
}
