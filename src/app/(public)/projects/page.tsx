'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Search, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Badge'
import { api } from '@/lib/api'
import type { Project } from '@/types'

const categories = ['All', 'AI/ML', 'Robotics', 'Web', 'Mobile', 'DevOps', 'Research']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.projects.list()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchCategory && matchSearch
  })

  if (loading) return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500 pt-20">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            My <span className="text-gradient">Projects</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl">
            A collection of projects spanning AI, robotics, web development, and research.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-gray-400 hover:text-white border border-transparent hover:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-dark-100/50 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group glass-card p-6 transition-all duration-300 hover:border-primary-500/30"
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="primary">{project.category}</Badge>
                <span className="text-xs text-gray-500">{project.createdAt?.split('T')[0]?.split('-')[0]}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
              <p className="mb-4 text-sm text-gray-400 line-clamp-2">{project.description}</p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <Badge key={tech} size="sm">{tech}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                    <GithubIcon className="h-3.5 w-3.5" /> Source
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
