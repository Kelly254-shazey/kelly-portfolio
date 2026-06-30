import { Navigation } from '@/components/public/Navigation'
import { Footer } from '@/components/public/Footer'
import { PublicProviders } from '@/components/layout/PublicProviders'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicProviders>
      <div className="min-h-screen bg-white dark:bg-dark">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    </PublicProviders>
  )
}
