import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { path, referrer, device, browser, country } = await req.json()

    if (!path) {
      return Response.json({ error: 'Path is required' }, { status: 400 })
    }

    const pageView = await prisma.pageView.create({
      data: { path, referrer, device, browser, country },
    })

    return Response.json(pageView, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to track page view' }, { status: 500 })
  }
}
