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

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    return Response.json({ error: 'Cloudinary not configured' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const version = (formData.get('version') as string) || '1.0'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', uploadPreset)
    uploadFormData.append('folder', 'portfolio/resume')

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: 'POST', body: uploadFormData }
    )

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text()
      return Response.json({ error: 'Cloudinary upload failed', details: errBody }, { status: 500 })
    }

    const result = await uploadRes.json()

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
