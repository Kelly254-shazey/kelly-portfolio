import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const folder = (formData.get('folder') as string) || 'portfolio'

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (err, result) => (err ? reject(err) : resolve(result))
          )
          stream.end(buffer)
        })

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
