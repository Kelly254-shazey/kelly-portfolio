import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.media.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
