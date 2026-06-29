import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(messages)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = await prisma.message.create({ data: body })
    return Response.json(message, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
