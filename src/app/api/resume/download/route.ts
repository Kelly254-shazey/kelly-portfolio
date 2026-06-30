import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const resume = await prisma.resume.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })

    if (!resume) {
      return Response.json({ error: 'No resume available' }, { status: 404 })
    }

    await prisma.resume.update({
      where: { id: resume.id },
      data: { downloads: { increment: 1 } },
    })

    return Response.redirect(resume.url, 302)
  } catch (error) {
    return Response.json({ error: 'Failed to download resume' }, { status: 500 })
  }
}
