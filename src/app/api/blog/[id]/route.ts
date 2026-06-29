import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

function serializePost(p: any) {
  return {
    ...p,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  }
}

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const post = await prisma.blogPost.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { comments: true },
    })
    if (!post) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(serializePost(post))
  } catch (error) {
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: any) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    if (Array.isArray(body.tags)) body.tags = JSON.stringify(body.tags)
    if (body.status === 'published') body.publishedAt = new Date()

    const post = await prisma.blogPost.update({ where: { id }, data: body })
    return Response.json(serializePost(post))
  } catch (error) {
    return Response.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.blogPost.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
