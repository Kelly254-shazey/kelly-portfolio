import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalProjects,
      publishedProjects,
      totalBlogPosts,
      publishedPosts,
      totalMessages,
      unreadMessages,
      totalTestimonials,
      approvedTestimonials,
      totalSkills,
      totalMedia,
      totalResumeDownloads,
      pageViews,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'published' } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'published' } }),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { approved: true } }),
      prisma.skill.count(),
      prisma.media.count(),
      prisma.resume.aggregate({ _sum: { downloads: true } }),
      prisma.pageView.count(),
    ])

    const recentMessages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return Response.json({
      totalProjects,
      publishedProjects,
      totalBlogPosts,
      publishedPosts,
      totalMessages,
      unreadMessages,
      totalTestimonials,
      approvedTestimonials,
      totalSkills,
      totalMedia,
      totalResumeDownloads: totalResumeDownloads._sum.downloads ?? 0,
      pageViews,
      recentMessages,
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
