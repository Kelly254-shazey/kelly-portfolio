'use client'

import { useSession } from 'next-auth/react'
import { usePathname, redirect } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { PageLoading } from '@/components/ui/Loading'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (status === 'loading') return isLoginPage ? <>{children}</> : <PageLoading />
  if (status === 'unauthenticated' && !isLoginPage) redirect('/admin/login')
  if (status === 'authenticated' && isLoginPage) redirect('/admin/dashboard')

  if (isLoginPage) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
