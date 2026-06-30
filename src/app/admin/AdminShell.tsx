'use client'

import { useSession } from 'next-auth/react'
import { usePathname, redirect } from 'next/navigation'
import { useState } from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PageLoading } from '@/components/ui/Loading'
import { Menu, X } from 'lucide-react'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') return isLoginPage ? <>{children}</> : <PageLoading />
  if (status === 'unauthenticated' && !isLoginPage) redirect('/admin/login')
  if (status === 'authenticated' && isLoginPage) redirect('/admin/dashboard')

  if (isLoginPage) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:ml-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
