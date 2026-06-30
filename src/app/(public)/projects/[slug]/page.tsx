import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GithubIcon } from '@/components/ui/Icons'
import Link from 'next/link'

function parseJson(val: unknown) {
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return val }
  }
  return val ?? []
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) notFound()

  const technologies = parseJson(project.technologies) as string[]
  const images = parseJson(project.images) as string[]

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <article>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="primary">{project.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" /> {new Date(project.createdAt).getFullYear()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{project.description}</p>

          {images.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {images.map((img, i) => (
                <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="rounded-2xl w-full object-cover max-h-80 border border-gray-200/50 dark:border-white/5" />
              ))}
            </div>
          )}

          {project.content && (
            <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
              {project.content.split('\n').map((p, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {technologies.map((tech) => (
              <Badge key={tech} variant="default">{tech}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/50 transition-all">
                <GithubIcon className="h-4 w-4" /> View Source
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
