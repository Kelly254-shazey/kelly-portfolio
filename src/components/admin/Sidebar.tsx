'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FolderKanban, FileText, BarChart3, Settings,
  MessageSquare, Image, FileUp, LogOut, ChevronLeft, Star, GraduationCap, Trophy, X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/skills', label: 'Skills', icon: GraduationCap },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/resume', label: 'Resume', icon: FileUp },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-gray-800 bg-dark-100 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          'max-lg:fixed max-lg:z-30',
          open ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          {!collapsed && (
            <Link href="/admin/dashboard" className="text-lg font-bold">
              <span className="text-gradient">K</span>
              <span className="text-white">elvin</span>
              <span className="text-gradient">.</span>
              <span className="ml-1 text-xs text-gray-500">Admin</span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 hover:text-white hover:bg-dark-200 transition-all lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-1.5 text-gray-500 hover:text-white hover:bg-dark-200 transition-all max-lg:hidden"
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-800 p-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-dark-200 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
