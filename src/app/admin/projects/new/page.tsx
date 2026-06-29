'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { api } from '@/lib/api'

const categories = ['Web', 'AI/ML', 'Robotics', 'Mobile', 'DevOps', 'Research']

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    status: 'draft',
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.projects.create({
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      })
      router.push('/admin/projects')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">New Project</h1>
          <p className="text-gray-500 mt-1">Add a new project to your portfolio.</p>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-6"
      >
        <Input
          label="Title"
          id="title"
          placeholder="My Awesome Project"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <Textarea
          label="Description"
          id="description"
          placeholder="Brief description of the project"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <Textarea
          label="Content"
          id="content"
          placeholder="Full project content (rich text)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="min-h-[200px]"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-dark-100/50 px-4 py-2.5 text-sm text-gray-100 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-dark-100/50 px-4 py-2.5 text-sm text-gray-100 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <Input
          label="Technologies"
          id="technologies"
          placeholder="React, Node.js, TypeScript"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="GitHub URL"
            id="githubUrl"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          />
          <Input
            label="Live URL"
            id="liveUrl"
            placeholder="https://..."
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-gray-700 bg-dark-100 text-primary-500 focus:ring-primary-500/20"
          />
          <span className="text-sm text-gray-300">Featured project</span>
        </label>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
          <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={loading} icon={<Save className="h-4 w-4" />}>Save Project</Button>
        </div>
      </motion.form>
    </div>
  )
}
