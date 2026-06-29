import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(media)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: `/uploads/${file.name}`,
        type: file.type,
        size: file.size,
      },
    })

    return Response.json(media, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to upload media' }, { status: 500 })
  }
}
