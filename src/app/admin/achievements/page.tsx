'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Trophy, Award, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import type { Achievement } from '@/types'

const categories = ['certification', 'achievement', 'publication', 'honor', 'milestone']

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [form, setForm] = useState({ title: '', description: '', issuer: '', date: '', category: 'certification', icon: '', url: '', order: 0 })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      const data = await api.achievements.list()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const resetForm = () => {
    setForm({ title: '', description: '', issuer: '', date: '', category: 'certification', icon: '', url: '', order: 0 })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (item: Achievement) => {
    setForm({
      title: item.title,
      description: item.description || '',
      issuer: item.issuer || '',
      date: item.date ? item.date.split('T')[0] : '',
      category: item.category,
      icon: item.icon || '',
      url: item.url || '',
      order: item.order,
    })
    setEditing(item)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        description: form.description || undefined,
        issuer: form.issuer || undefined,
        icon: form.icon || undefined,
        url: form.url || undefined,
      }
      if (editing) {
        const updated = await api.achievements.update(editing.id, payload)
        setItems(items.map((i) => (i.id === editing.id ? updated : i)))
      } else {
        const created = await api.achievements.create(payload)
        setItems([...items, created])
      }
      resetForm()
    } catch {} finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.achievements.delete(deleteId)
      setItems(items.filter((i) => i.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements & Certifications</h1>
          <p className="text-gray-500 mt-1">Showcase your accomplishments and credentials.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} icon={<Plus className="h-4 w-4" />}>
          Add Item
        </Button>
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Item' : 'Add New Item'}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" id="ac-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Issuer" id="ac-issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
            <Input label="Date" id="ac-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <div className="space-y-1.5">
              <label htmlFor="ac-category" className="block text-sm font-medium text-gray-300">Category</label>
              <select
                id="ac-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-dark-100/50 px-4 py-2.5 text-sm text-gray-100 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <Input label="URL" id="ac-url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            <Input label="Order" id="ac-order" type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
          </div>
          <Textarea label="Description" id="ac-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" type="button" onClick={resetForm}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Save'} Item</Button>
          </div>
        </motion.form>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          description="Add your certifications and accomplishments."
          action={<Button onClick={() => { resetForm(); setShowForm(true) }} icon={<Plus className="h-4 w-4" />}>Add Item</Button>}
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Issuer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-700/30 hover:bg-dark-200/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.category === 'certification' ? <Award className="h-4 w-4 text-blue-400" /> : <Trophy className="h-4 w-4 text-yellow-400" />}
                      <span className="text-sm font-medium text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">{item.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{item.issuer || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-gray-500 hover:text-primary-400 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <span className="text-gray-400 text-sm">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
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

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Item" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this item?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
