'use client'

import { motion } from 'framer-motion'
import { Trophy, Award, ExternalLink, Calendar } from 'lucide-react'
import type { Achievement } from '@/types'

const categoryIcons: Record<string, React.ElementType> = {
  certification: Award,
  achievement: Trophy,
}

const categoryColors: Record<string, string> = {
  certification: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  achievement: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10',
  publication: 'text-green-600 dark:text-green-400 bg-green-500/10',
  honor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  milestone: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
}

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) return null

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-dark-100/50 overflow-hidden">
      <div className="section-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Achievements & <span className="text-gradient-animate">Certifications</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Milestones and credentials from my journey.</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, i) => {
              const Icon = categoryIcons[item.category] || Trophy
              const colorClass = categoryColors[item.category] || categoryColors.achievement

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass-card hover-lift p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      {item.issuer && (
                        <p className="mt-0.5 text-xs text-gray-500">{item.issuer}</p>
                      )}
                      {item.description && (
                        <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        {item.date && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </span>
                        )}
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
