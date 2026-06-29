import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const approved = searchParams.get('approved')

    const where: Record<string, unknown> = {}
    if (approved === 'true') where.approved = true
    else if (approved === 'false') where.approved = false

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return Response.json(testimonials)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const testimonial = await prisma.testimonial.create({ data: body })
    return Response.json(testimonial, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
