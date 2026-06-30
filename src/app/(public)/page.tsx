import { prisma } from '@/lib/prisma'
import type { Skill, Project, Testimonial, BlogPost, Achievement } from '@/types'
import { HeroSection } from '@/components/public/HeroSection'

export const dynamic = 'force-dynamic'
import { AboutSection } from '@/components/public/AboutSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { AchievementsSection } from '@/components/public/AchievementsSection'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { TestimonialsSection } from '@/components/public/TestimonialsSection'
import { BlogSection } from '@/components/public/BlogSection'
import { ContactSection } from '@/components/public/ContactSection'

function parseJson(val: unknown) {
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return val }
  }
  return val ?? []
}

function toStr(d: Date | null | undefined): string | undefined {
  return d ? d.toISOString() : undefined
}

export default async function HomePage() {
  const [skills, projects, testimonials, blogPosts, achievements, settings, activeResume] = await Promise.all([
    prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
    prisma.project.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' } }),
    prisma.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } }),
    prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      include: { comments: true },
    }),
    prisma.achievement.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
    prisma.siteSettings.findFirst(),
    prisma.resume.findFirst({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
  ])

  const profilePhotos: string[] = settings?.profilePhotos ? parseJson(settings.profilePhotos) as string[] : []
  const resumeUrl = activeResume?.url ?? null

  return (
    <>
      <HeroSection profilePhotos={profilePhotos} resumeUrl={resumeUrl} />
      <AboutSection />
      <AchievementsSection achievements={achievements.map(a => ({
        ...a,
        description: a.description ?? undefined,
        issuer: a.issuer ?? undefined,
        date: a.date ? a.date.toISOString() : undefined,
        icon: a.icon ?? undefined,
        url: a.url ?? undefined,
        createdAt: a.createdAt.toISOString(),
      })) as Achievement[]} />
      <SkillsSection skills={skills.map(s => ({
        ...s,
        category: s.category ?? 'General',
        icon: s.icon ?? undefined,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })) as Skill[]} />
      <ProjectsSection projects={projects.map(p => ({
        ...p,
        content: p.content ?? undefined,
        technologies: parseJson(p.technologies) as string[],
        images: parseJson(p.images) as string[],
        videoUrl: p.videoUrl ?? undefined,
        githubUrl: p.githubUrl ?? undefined,
        liveUrl: p.liveUrl ?? undefined,
        status: p.status as Project['status'],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })) as Project[]} />
      <TestimonialsSection testimonials={testimonials.map(t => ({
        ...t,
        company: t.company ?? undefined,
        role: t.role ?? undefined,
        photo: t.photo ?? undefined,
        createdAt: t.createdAt.toISOString(),
      })) as Testimonial[]} />
      <BlogSection posts={blogPosts.map(p => ({
        ...p,
        excerpt: p.excerpt ?? undefined,
        coverImage: p.coverImage ?? undefined,
        publishedAt: toStr(p.publishedAt),
        tags: parseJson(p.tags) as string[],
        status: p.status as BlogPost['status'],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        comments: (p.comments ?? []).map(c => ({
          ...c,
          email: c.email ?? undefined,
          createdAt: c.createdAt.toISOString(),
        })),
        readTime: `${Math.ceil(p.content.length / 1000)} min read`,
      })) as (BlogPost & { readTime: string })[]} />
      <ContactSection />
    </>
  )
}
