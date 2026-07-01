'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Upload, Trash2, Download, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Resume } from '@/types'

export default function AdminResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchResumes = async () => {
    try {
      const data = await api.resume.list()
      setResumes(data)
    } catch {
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const data = await api.resume.list()
        setResumes(data)
      } catch {
        setResumes([])
      } finally {
        setLoading(false)
      }
    }

    void loadResumes()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.resume.upload(formData)
      fetchResumes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleToggleActive = async (resume: Resume) => {
    try {
      await api.resume.update(resume.id, { active: !resume.active })
      setResumes(resumes.map((r) => (r.id === resume.id ? { ...r, active: !r.active } : r)))
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.resume.delete(deleteId)
      setResumes(resumes.filter((r) => r.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resume</h1>
          <p className="text-gray-500 mt-1">Manage your CV/resume files.</p>
        </div>
        <div>
          <label htmlFor="resume-upload" className="sr-only">
            Upload resume file
          </label>
          <input
            id="resume-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} loading={uploading} icon={<Upload className="h-4 w-4" />}>
            Upload New CV
          </Button>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {resumes.length === 0 ? (
        <EmptyState
          title="No resumes uploaded"
          description="Upload your CV to make it available for download."
          action={
            <Button onClick={() => fileInputRef.current?.click()} icon={<Upload className="h-4 w-4" />}>
              Upload CV
            </Button>
          }
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Version</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Downloads</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Active</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Uploaded</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id} className="border-b border-gray-700/30 hover:bg-dark-200/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{resume.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{resume.version}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Download className="h-3 w-3" /> {resume.downloads}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleActive(resume)}>
                      {resume.active
                        ? <CheckCircle className="h-5 w-5 text-green-400" />
                        : <XCircle className="h-5 w-5 text-gray-600" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{formatDate(resume.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(resume.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Resume" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this resume file?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
