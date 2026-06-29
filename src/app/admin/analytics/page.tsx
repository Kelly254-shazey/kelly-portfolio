'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FolderKanban, FileText, MessageSquare, Eye, TrendingUp, Users, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { PageLoading } from '@/components/ui/Loading'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { DashboardStats } from '@/types'

const statCards = [
  { label: 'Total Projects', key: 'totalProjects', icon: FolderKanban, color: 'from-blue-500/20 to-blue-600/20', textColor: 'text-blue-400' },
  { label: 'Blog Posts', key: 'totalBlogPosts', icon: FileText, color: 'from-purple-500/20 to-purple-600/20', textColor: 'text-purple-400' },
  { label: 'Messages', key: 'totalMessages', icon: MessageSquare, color: 'from-green-500/20 to-green-600/20', textColor: 'text-green-400' },
  { label: 'Page Views', key: 'pageViews', icon: Eye, color: 'from-orange-500/20 to-orange-600/20', textColor: 'text-orange-400' },
  { label: 'Skills', key: 'totalSkills', icon: TrendingUp, color: 'from-pink-500/20 to-pink-600/20', textColor: 'text-pink-400' },
  { label: 'Testimonials', key: 'totalTestimonials', icon: Users, color: 'from-yellow-500/20 to-yellow-600/20', textColor: 'text-yellow-400' },
]

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    api.analytics.get().then(setStats).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 mt-1">Overview of your portfolio performance.</p>
      </motion.div>

      {!stats ? (
        <PageLoading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
                  <CardContent className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">
                          {String(stats[stat.key as keyof DashboardStats] ?? 0)}
                        </p>
                      </div>
                      <div className={`rounded-xl ${stat.color} p-3 ${stat.textColor}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                {stats.recentMessages && stats.recentMessages.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3 rounded-xl bg-dark-200/50 p-3">
                        <div className={`rounded-full p-2 ${msg.read ? 'bg-gray-700' : 'bg-primary-500/20'}`}>
                          <Activity className={`h-4 w-4 ${msg.read ? 'text-gray-500' : 'text-primary-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{msg.name}</p>
                          <p className="text-xs text-gray-500 truncate">New message received</p>
                        </div>
                        <span className="text-xs text-gray-600">{formatDate(msg.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity to display.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  )
}
