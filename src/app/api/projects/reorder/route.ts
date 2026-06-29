import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { items } = await req.json()

    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to reorder projects' }, { status: 500 })
  }
}
