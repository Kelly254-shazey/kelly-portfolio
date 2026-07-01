import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio/resume', resource_type: 'auto' },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      stream.end(buffer)
    })

    const resume = await prisma.resume.create({
      data: {
        name: file.name,
        url: result.secure_url,
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
