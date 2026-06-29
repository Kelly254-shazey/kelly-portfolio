import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const resume = await prisma.resume.update({ where: { id }, data: body })
    return Response.json(resume)
  } catch (error) {
    return Response.json({ error: 'Failed to update resume' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.resume.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}
