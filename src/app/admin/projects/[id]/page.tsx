'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { PageLoading } from '@/components/ui/Loading'
import { api } from '@/lib/api'

const categories = ['Web', 'AI/ML', 'Robotics', 'Mobile', 'DevOps', 'Research']

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    technologies: '',
    images: '',
    videoUrl: '',
    githubUrl: '',
    liveUrl: '',
    status: 'draft',
    featured: false,
  })

  useEffect(() => {
    api.projects.get(params.id as string).then((project) => {
      setForm({
        title: project.title,
        description: project.description,
        content: project.content || '',
        category: project.category,
        technologies: project.technologies.join(', '),
        images: (project.images as string[]).join(', '),
        videoUrl: project.videoUrl || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        status: project.status,
        featured: project.featured,
      })
    }).catch(() => router.push('/admin/projects')).finally(() => setLoading(false))
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.projects.update(params.id as string, {
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images.split(',').map((u) => u.trim()).filter(Boolean),
      })
      router.push('/admin/projects')
    } catch {
      setSaving(false)
    }
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          <p className="text-gray-500 mt-1">Update project details.</p>
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
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <Textarea
          label="Description"
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <Textarea
          label="Content"
          id="content"
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
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
        />

        <Input
          label="Image URLs (comma-separated)"
          id="images"
          placeholder="https://res.cloudinary.com/..., https://..."
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
        />

        <Input
          label="Video URL"
          id="videoUrl"
          placeholder="https://res.cloudinary.com/... or https://youtube.com/..."
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="GitHub URL"
            id="githubUrl"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          />
          <Input
            label="Live URL"
            id="liveUrl"
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
          <Button variant="secondary" type="button" onClick={() => router.push('/admin/projects')}>Cancel</Button>
          <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>Update Project</Button>
        </div>
      </motion.form>
    </div>
  )
}
