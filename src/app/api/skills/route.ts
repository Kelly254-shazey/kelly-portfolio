import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    })
    return Response.json(skills)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const skill = await prisma.skill.create({ data: body })
    return Response.json(skill, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
