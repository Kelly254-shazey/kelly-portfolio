'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ChevronRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import type { Project } from '@/types'

const gradients = [
  'from-blue-500/20 to-purple-500/20',
  'from-green-500/20 to-teal-500/20',
  'from-orange-500/20 to-red-500/20',
  'from-pink-500/20 to-rose-500/20',
  'from-cyan-500/20 to-blue-500/20',
  'from-yellow-500/20 to-orange-500/20',
]

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (!projects.length) return null

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Some of my recent work and side projects.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            View all projects <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-dark-200/50 transition-all duration-300 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{project.title}</h3>
                <p className="mb-4 text-sm text-gray-400 leading-relaxed line-clamp-2">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {(project.technologies as string[]).map((tech) => (
                    <Badge key={tech} variant="primary" size="sm">{tech}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      <GithubIcon className="h-3.5 w-3.5" /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            View all projects <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
