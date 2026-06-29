'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Mail, Trash2, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PageLoading } from '@/components/ui/Loading'
import { EmptyState } from '@/components/ui/EmptyState'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Message } from '@/types'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      const data = await api.messages.list()
      setMessages(data)
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await api.messages.markRead(id)
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)))
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.messages.delete(deleteId)
      setMessages(messages.filter((m) => m.id !== deleteId))
    } catch {}
    setDeleteId(null)
  }

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}.`
              : 'All messages are read.'}
          </p>
        </div>
      </motion.div>

      {messages.length === 0 ? (
        <EmptyState title="No messages yet" description="Messages from your contact form will appear here." />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass-card overflow-hidden transition-all ${!msg.read ? 'border-primary-500/20' : ''}`}
            >
              <button
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left"
              >
                <div className={`rounded-full p-2 ${msg.read ? 'bg-dark-300' : 'bg-primary-500/20'}`}>
                  <Mail className={`h-4 w-4 ${msg.read ? 'text-gray-500' : 'text-primary-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${msg.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                      {msg.name}
                    </span>
                    {!msg.read && <Badge variant="primary">New</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.subject || '(No subject)'}</p>
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                <div className="text-gray-500">
                  {expandedId === msg.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {expandedId === msg.id && (
                <div className="px-6 pb-4 pt-0 border-t border-gray-700/30">
                  <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-300">{msg.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subject</p>
                      <p className="text-sm text-gray-300">{msg.subject || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-dark-100/50 p-4">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    {!msg.read && (
                      <Button variant="secondary" size="sm" onClick={() => handleMarkRead(msg.id)}>
                        <CheckCheck className="h-4 w-4 mr-1" /> Mark as Read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(msg.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Message" size="sm">
        <p className="text-gray-400 mb-6">Are you sure you want to delete this message?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
