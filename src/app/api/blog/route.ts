import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'

function serializePost(p: any) {
  return {
    ...p,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (status) where.status = status
    if (search) where.title = { contains: search }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { comments: true },
    })

    return Response.json(posts.map(serializePost))
  } catch (error) {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const slug = slugify(body.title)

    const data: any = { ...body, slug, authorId: session.user.id }
    if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags)
    if (body.status === 'published') data.publishedAt = new Date()

    const post = await prisma.blogPost.create({ data })
    return Response.json(serializePost(post), { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
