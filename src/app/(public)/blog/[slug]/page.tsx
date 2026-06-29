'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { BlogPost } from '@/types'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    api.blog.get(slug)
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  const readTime = post ? `${Math.ceil(post.content.length / 1000)} min read` : ''

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center text-gray-500 pt-20">Loading...</div>
    </div>
  )

  if (error || !post) return null

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 flex gap-2">
            <Badge variant="primary">{post.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            {post.title}
          </h1>
          <div className="mb-8 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(post.publishedAt || post.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {readTime}</span>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
            {post.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold text-white mt-8">{paragraph.replace('## ', '')}</h2>
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold text-white mt-6">{paragraph.replace('### ', '')}</h3>
              }
              if (paragraph.startsWith('```')) {
                return null
              }
              if (paragraph.trim() === '') return <br key={i} />
              const isCode = paragraph.startsWith('  ') || paragraph.startsWith('\t')
              if (isCode) {
                return <pre key={i} className="rounded-xl bg-dark-300 p-4 overflow-x-auto"><code className="text-sm">{paragraph}</code></pre>
              }
              return <p key={i}>{paragraph}</p>
            })}
          </div>
        </motion.article>
      </div>
    </div>
  )
}
