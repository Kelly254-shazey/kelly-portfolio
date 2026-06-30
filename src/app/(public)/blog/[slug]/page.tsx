import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

function formatDate(date: Date | string | null | undefined) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  })

  if (!post) notFound()

  const readTime = `${Math.ceil(post.content.length / 1000)} min read`

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <article>
          <div className="mb-4 flex gap-2">
            <Badge variant="primary">{post.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            {post.title}
          </h1>
          <div className="mb-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(post.publishedAt ?? post.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {readTime}</span>
          </div>

          <div className="max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            {post.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold text-gray-900 dark:text-white mt-8">{paragraph.replace('## ', '')}</h2>
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold text-gray-900 dark:text-white mt-6">{paragraph.replace('### ', '')}</h3>
              }
              if (paragraph.startsWith('```')) {
                return null
              }
              if (paragraph.trim() === '') return <br key={i} />
              const isCode = paragraph.startsWith('  ') || paragraph.startsWith('\t')
              if (isCode) {
                return <pre key={i} className="rounded-xl bg-gray-100 dark:bg-dark-300 p-4 overflow-x-auto"><code className="text-sm text-gray-800 dark:text-gray-200">{paragraph}</code></pre>
              }
              return <p key={i}>{paragraph}</p>
            })}
          </div>
        </article>
      </div>
    </div>
  )
}
