import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const files = formData.getAll('files') as File[]
    const folder = (formData.get('folder') as string) || 'portfolio'

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('upload_preset', uploadPreset)
        uploadFormData.append('folder', folder)

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: 'POST', body: uploadFormData }
        )

        if (!uploadRes.ok) {
          const errBody = await uploadRes.text()
          throw new Error(`Cloudinary: ${errBody}`)
        }

        const result = await uploadRes.json()

        return prisma.media.create({
          data: {
            name: file.name,
            url: result.secure_url,
            type: file.type,
            size: file.size,
            folder,
          },
        })
      })
    )

    return Response.json(uploaded, { status: 201 })
  } catch (error) {
    console.error('Media upload error:', error)
    let details = String(error)
    try {
      if (error instanceof Error) details = error.message
      else if (typeof error === 'object' && error !== null) details = JSON.stringify(error, Object.getOwnPropertyNames(error))
    } catch {}
    return Response.json({ error: 'Failed to upload files', details }, { status: 500 })
  }
}
