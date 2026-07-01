import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes')

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(resumes, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch resumes' }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
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

    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = path.extname(file.name) || '.pdf'
    const fileName = `${randomUUID()}${extension}`
    await fs.mkdir(uploadsDir, { recursive: true })
    await fs.writeFile(path.join(uploadsDir, fileName), buffer)

    const resume = await prisma.resume.create({
      data: {
        name: file.name,
        url: `/uploads/resumes/${fileName}`,
        version,
      },
    })

    return Response.json(resume, { status: 201 })
  } catch (error) {
    console.error('Resume upload error:', error)
    let details = String(error)
    try {
      if (error instanceof Error) details = error.message
      else if (typeof error === 'object' && error !== null) details = JSON.stringify(error, Object.getOwnPropertyNames(error))
    } catch {}
    return Response.json({ error: 'Failed to upload resume', details }, { status: 500 })
  }
}
