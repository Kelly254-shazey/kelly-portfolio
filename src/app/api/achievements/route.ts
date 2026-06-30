import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return Response.json(achievements)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const achievement = await prisma.achievement.create({ data: body })
    return Response.json(achievement, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}
