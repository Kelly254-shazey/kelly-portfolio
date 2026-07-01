import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const resume = await prisma.resume.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })

    if (!resume) {
      return Response.json({ error: 'No resume available' }, { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    if (!resume.downloadEnabled) {
      return Response.json({ error: 'Download is disabled by admin' }, { status: 403, headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    await prisma.resume.update({
      where: { id: resume.id },
      data: { downloads: { increment: 1 } },
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: resume.url,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    return Response.json({ error: 'Failed to download resume' }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  }
}
