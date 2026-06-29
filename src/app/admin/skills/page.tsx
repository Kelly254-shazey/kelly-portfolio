'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import type { Skill } from '@/types'

const categories = ['Languages', 'Frameworks & Libraries', 'Tools & Platforms', 'Domains']

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState({ name: '', proficiency: 50, category: '', order: 0 })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchSkills = async () => {
    try {
      const data = await api.skills.list()
      setSkills(data.sort((a, b) => a.order - b.order))
    } catch {
      setSkills([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSkills() }, [])

  const resetForm = () => {
    setForm({ name: '', proficiency: 50, category: '', order: 0 })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (skill: Skill) => {
    setForm({ name: skill.name, proficiency: skill.proficiency, category: skill.category, order: skill.order })
    setEditing(skill)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.skills.update(editing.id, form)
        setSkills(skills.map((s) => (s.id === editing.id ? updated : s)))
      } else {
        const created = await api.skills.create(form)
        setSkills([...skills, created])
      }
      resetForm()
    } catch {} finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.skills.delete(deleteId)
      setSkills(skills.filter((s) => s.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-gray-500 mt-1">Manage your technical skills.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} icon={<Plus className="h-4 w-4" />}>
          Add Skill
        </Button>
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit Skill' : 'Add New Skill'}</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            <Input
              label="Name"
              id="skill-name"
              placeholder="TypeScript"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Proficiency (0-100)"
              id="skill-proficiency"
              type="number"
              min={0}
              max={100}
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) || 0 })}
              required
            />
            <div className="space-y-1.5">
              <label htmlFor="skill-category" className="block text-sm font-medium text-gray-300">Category</label>
              <select
                id="skill-category"
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
            <Input
              label="Order"
              id="skill-order"
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" type="button" onClick={resetForm}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Save'} Skill</Button>
          </div>
        </motion.form>
      )}

      {skills.length === 0 ? (
        <EmptyState
          title="No skills added yet"
          description="Add your technical skills to showcase them."
          action={<Button onClick={() => { resetForm(); setShowForm(true) }} icon={<Plus className="h-4 w-4" />}>Add Skill</Button>}
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Proficiency</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Order</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-gray-700/30 hover:bg-dark-200/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{skill.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{skill.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 max-w-[200px]">
                      <div className="flex-1 h-2 rounded-full bg-dark-300 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{skill.order}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                        <span className="text-gray-400 text-sm">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(skill.id)}>
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

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Skill" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this skill?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
