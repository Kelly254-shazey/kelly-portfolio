import { prisma } from '@/lib/prisma'
import { ProjectsPageClient } from './ProjectsPageClient'

export const dynamic = 'force-dynamic'

function serializeArray(val: unknown) {
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return val }
  }
  return val ?? []
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const serialized = projects.map(p => ({
    ...p,
    technologies: serializeArray(p.technologies) as string[],
  }))

  return <ProjectsPageClient projects={serialized} />
}
