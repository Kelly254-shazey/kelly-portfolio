import { Navigation } from '@/components/public/Navigation'
import { Footer } from '@/components/public/Footer'
import { Providers } from '@/components/layout/Providers'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-white dark:bg-dark">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    </Providers>
  )
}
