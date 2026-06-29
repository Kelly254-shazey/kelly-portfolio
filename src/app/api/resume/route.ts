import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(resumes)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch resumes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const version = (formData.get('version') as string) || '1.0'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const resume = await prisma.resume.create({
      data: {
        name: file.name,
        url: `/uploads/${file.name}`,
        version,
      },
    })

    return Response.json(resume, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to upload resume' }, { status: 500 })
  }
}
