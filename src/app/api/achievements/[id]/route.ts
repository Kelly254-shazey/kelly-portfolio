import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const achievement = await prisma.achievement.update({ where: { id }, data: body })
    return Response.json(achievement)
  } catch (error) {
    return Response.json({ error: 'Failed to update achievement' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.achievement.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete achievement' }, { status: 500 })
  }
}
