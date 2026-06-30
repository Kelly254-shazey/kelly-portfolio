'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import type { Testimonial } from '@/types'

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', company: '', role: '', content: '', rating: 5, photo: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    try {
      const data = await api.testimonials.list()
      setTestimonials(data)
    } catch {
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTestimonials() }, [])

  const resetForm = () => {
    setForm({ name: '', company: '', role: '', content: '', rating: 5, photo: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      company: t.company || '',
      role: t.role || '',
      content: t.content,
      rating: t.rating,
      photo: t.photo || '',
    })
    setEditingId(t.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await api.testimonials.update(editingId, form)
      } else {
        await api.testimonials.create(form)
      }
      resetForm()
      fetchTestimonials()
    } catch {} finally {
      setSaving(false)
    }
  }

  const handleToggleApproval = async (testimonial: Testimonial) => {
    try {
      await api.testimonials.update(testimonial.id, { approved: !testimonial.approved })
      setTestimonials(testimonials.map((t) =>
        t.id === testimonial.id ? { ...t, approved: !t.approved } : t
      ))
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.testimonials.delete(deleteId)
      setTestimonials(testimonials.filter((t) => t.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
      ))}
    </div>
  )

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-500 mt-1">Manage client testimonials.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} icon={<Plus className="h-4 w-4" />}>
          Add Testimonial
        </Button>
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" id="t-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Company" id="t-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Input label="Role" id="t-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <Input label="Photo URL" id="t-photo" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
          </div>
          <Textarea label="Content" id="t-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <div className="space-y-1.5">
            <label htmlFor="t-rating" className="block text-sm font-medium text-gray-300">Rating</label>
            <select
              id="t-rating"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
              className="w-full rounded-xl border border-gray-700 bg-dark-100/50 px-4 py-2.5 text-sm text-gray-100 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={resetForm}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingId ? 'Update' : 'Save'} Testimonial</Button>
          </div>
        </motion.form>
      )}

      {testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add your first client testimonial."
          action={<Button onClick={() => { resetForm(); setShowForm(true) }} icon={<Plus className="h-4 w-4" />}>Add Testimonial</Button>}
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Company</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="border-b border-gray-700/30 hover:bg-dark-200/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{testimonial.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{testimonial.company || '-'}</span>
                  </td>
                  <td className="px-6 py-4">{renderStars(testimonial.rating)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={testimonial.approved ? 'success' : 'default'}>
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(testimonial)}>
                        <Edit2 className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleApproval(testimonial)}>
                        {testimonial.approved
                          ? <XCircle className="h-4 w-4 text-yellow-400" />
                          : <CheckCircle className="h-4 w-4 text-green-400" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(testimonial.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Testimonial" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this testimonial?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
