'use client'

import { useSession } from 'next-auth/react'
import { Bell, ExternalLink, Menu } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-800 bg-dark-100/80 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          title="Open navigation menu"
          className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-dark-200 transition-all lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-dark-200 transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="max-sm:hidden">View Site</span>
        </Link>
        <button
          aria-label="View notifications"
          title="View notifications"
          className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-dark-200 transition-all"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right max-sm:hidden">
            <p className="text-sm font-medium text-white">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <Avatar name={session?.user?.name || 'Admin'} src={session?.user?.image} size="sm" />
        </div>
      </div>
    </header>
  )
}
