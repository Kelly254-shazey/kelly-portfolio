'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit2, Trash2, Star, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import type { Project } from '@/types'

const statusVariant: Record<string, 'default' | 'success' | 'warning'> = {
  draft: 'default',
  published: 'success',
  archived: 'warning',
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = view === 'table' ? 8 : 9

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter
      const data = await api.projects.list(params)
      setProjects(data)
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects(); setPage(1) }, [search, categoryFilter, statusFilter])

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = await api.projects.update(project.id, { featured: !project.featured })
      setProjects(projects.map((p) => (p.id === project.id ? updated : p)))
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.projects.delete(deleteId)
      setProjects(projects.filter((p) => p.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  const categories = [...new Set(projects.map((p) => p.category))]
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize))
  const paginatedProjects = projects.slice((page - 1) * pageSize, page * pageSize)

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={() => router.push('/admin/projects/new')} icon={<Plus className="h-4 w-4" />}>
          New Project
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-dark-100/50 pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-700 bg-dark-100/50 px-4 py-2.5 text-sm text-gray-100 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-700 bg-dark-100/50 px-4 py-2.5 text-sm text-gray-100 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <div className="flex rounded-xl border border-gray-700 overflow-hidden">
          <button
            onClick={() => setView('table')}
            className={`p-2.5 ${view === 'table' ? 'bg-dark-300 text-primary-400' : 'bg-dark-100/50 text-gray-500 hover:text-gray-300'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-2.5 ${view === 'grid' ? 'bg-dark-300 text-primary-400' : 'bg-dark-100/50 text-gray-500 hover:text-gray-300'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Get started by creating your first project."
          action={<Button onClick={() => router.push('/admin/projects/new')} icon={<Plus className="h-4 w-4" />}>New Project</Button>}
        />
      ) : view === 'table' ? (
        <motion.div variants={container} initial="hidden" animate="show" className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Featured</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((project) => (
                <motion.tr
                  key={project.id}
                  variants={item}
                  className="border-b border-gray-700/30 hover:bg-dark-200/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{project.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{project.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[project.status] || 'default'}>{project.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-1 rounded-lg transition-colors ${project.featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      <Star className="h-4 w-4" fill={project.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/projects/${project.id}`)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(project.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={statusVariant[project.status] || 'default'}>{project.status}</Badge>
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-1 rounded-lg ${project.featured ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      <Star className="h-4 w-4" fill={project.featured ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{project.category}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/projects/${project.id}`)}>
                      <Edit2 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(project.id)}>
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <motion.div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl border border-gray-700 bg-dark-100/50 p-2 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'border border-gray-700 bg-dark-100/50 text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl border border-gray-700 bg-dark-100/50 p-2 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
