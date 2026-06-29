'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Upload, Trash2, File, Image, Film, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Media } from '@/types'

const fileIcons: Record<string, React.ReactNode> = {
  image: <Image className="h-8 w-8 text-green-400" />,
  video: <Film className="h-8 w-8 text-purple-400" />,
  application: <FileText className="h-8 w-8 text-blue-400" />,
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = async () => {
    try {
      const data = await api.media.list(folder || undefined)
      setMedia(data)
    } catch {
      setMedia([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMedia() }, [folder])

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append('files', file))
      if (folder) formData.append('folder', folder)
      await fetch('/api/media/upload', { method: 'POST', body: formData })
      fetchMedia()
    } catch {} finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.media.delete(deleteId)
      setMedia(media.filter((m) => m.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  const getIcon = (type: string) => {
    const category = type.split('/')[0]
    return fileIcons[category] || <File className="h-8 w-8 text-gray-400" />
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-gray-500 mt-1">Upload and manage media files.</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} loading={uploading} icon={<Upload className="h-4 w-4" />}>
          Upload Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Input
          label="Filter by folder"
          id="folder-filter"
          placeholder="folder-name"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
      </motion.div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
          dragOver ? 'border-primary-500 bg-primary-500/5' : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <Upload className="mx-auto h-10 w-10 text-gray-500 mb-3" />
        <p className="text-sm text-gray-400">
          Drag and drop files here, or{' '}
          <button onClick={() => fileInputRef.current?.click()} className="text-primary-400 hover:underline">
            browse
          </button>
        </p>
        <p className="text-xs text-gray-600 mt-1">Supports images, videos, and PDFs</p>
      </div>

      {media.length === 0 ? (
        <EmptyState title="No media files" description="Upload your first file to get started." />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {media.map((file) => (
            <Card key={file.id}>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  {file.type.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="h-32 w-full object-cover rounded-xl mb-3" />
                  ) : (
                    <div className="h-32 flex items-center justify-center mb-3">{getIcon(file.type)}</div>
                  )}
                  <p className="text-sm font-medium text-white truncate w-full">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{file.type}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{formatDate(file.createdAt)}</p>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(file.id)} className="mt-2">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete File" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this file?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
