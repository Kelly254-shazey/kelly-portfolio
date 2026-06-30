import { prisma } from '@/lib/prisma'
import type { BlogPost } from '@/types'
import { BlogPageClient } from './BlogPageClient'

function parseJson(val: unknown) {
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return val }
  }
  return val ?? []
}

function toStr(d: Date | null | undefined): string | undefined {
  return d ? d.toISOString() : undefined
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    include: { comments: true },
  })

  const serialized = posts.map(p => ({
    ...p,
    excerpt: p.excerpt ?? undefined,
    coverImage: p.coverImage ?? undefined,
    publishedAt: toStr(p.publishedAt),
    tags: parseJson(p.tags) as string[],
    status: p.status as BlogPost['status'],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    comments: (p.comments ?? []).map(c => ({
      ...c,
      email: c.email ?? undefined,
      createdAt: c.createdAt.toISOString(),
    })),
    readTime: `${Math.ceil(p.content.length / 1000)} min read`,
  })) as (BlogPost & { readTime: string })[]

  return <BlogPageClient posts={serialized} />
}
