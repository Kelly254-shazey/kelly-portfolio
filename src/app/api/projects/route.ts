import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'

function serializeProject(p: any) {
  return {
    ...p,
    technologies: typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
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

    const projects = await prisma.project.findMany({ where, orderBy: { order: 'asc' } })

    return Response.json(projects.map(serializeProject))
  } catch (error) {
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const slug = slugify(body.title)

    const data: any = { ...body, slug }
    if (Array.isArray(data.technologies)) data.technologies = JSON.stringify(data.technologies)
    if (Array.isArray(data.images)) data.images = JSON.stringify(data.images)

    const project = await prisma.project.create({ data })

    return Response.json(serializeProject(project), { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
