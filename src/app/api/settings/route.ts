import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

function serializeSettings(s: any) {
  return {
    ...s,
    social: typeof s.social === 'string' ? JSON.parse(s.social) : s.social ?? {},
    theme: typeof s.theme === 'string' ? JSON.parse(s.theme) : s.theme ?? {},
    seo: typeof s.seo === 'string' ? JSON.parse(s.seo) : s.seo ?? {},
  }
}

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} })
    }
    return Response.json(serializeSettings(settings))
  } catch (error) {
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const existing = await prisma.siteSettings.findFirst()

    const data: Record<string, unknown> = { ...body }
    if (body.social) {
      const existingSocial = existing?.social ? JSON.parse(typeof existing.social === 'string' ? existing.social : JSON.stringify(existing.social)) : {}
      data.social = JSON.stringify({ ...existingSocial, ...body.social })
    }
    if (body.theme) {
      const existingTheme = existing?.theme ? JSON.parse(typeof existing.theme === 'string' ? existing.theme : JSON.stringify(existing.theme)) : {}
      data.theme = JSON.stringify({ ...existingTheme, ...body.theme })
    }
    if (body.seo) {
      const existingSeo = existing?.seo ? JSON.parse(typeof existing.seo === 'string' ? existing.seo : JSON.stringify(existing.seo)) : {}
      data.seo = JSON.stringify({ ...existingSeo, ...body.seo })
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: data as any,
    })

    return Response.json(serializeSettings(settings))
  } catch (error) {
    return Response.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
