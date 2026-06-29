import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

function serializeProject(p: any) {
  return {
    ...p,
    technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
  }
}

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = await params
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    })
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(serializeProject(project))
  } catch (error) {
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: any) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    if (Array.isArray(body.technologies)) body.technologies = JSON.stringify(body.technologies)
    if (Array.isArray(body.images)) body.images = JSON.stringify(body.images)

    const project = await prisma.project.update({ where: { id }, data: body })
    return Response.json(serializeProject(project))
  } catch (error) {
    return Response.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: any) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
