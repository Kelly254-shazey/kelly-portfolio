'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types'

const categories = ['All', 'AI/ML', 'Robotics', 'Web', 'Mobile', 'DevOps', 'Research']

export function ProjectsPageClient({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies as string[]).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Projects</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Explore my work and side projects.</p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-200/50 pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-200 border border-gray-300 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200/50 dark:border-white/5 bg-white/60 dark:bg-dark-200/50 p-6 transition-all duration-300 hover:border-primary-500/30 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="primary" size="sm">{project.category}</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(project.createdAt).getFullYear()}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {(project.technologies as string[]).map((tech) => (
                    <Badge key={tech} variant="default" size="sm">{tech}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <GithubIcon className="h-3.5 w-3.5" /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
