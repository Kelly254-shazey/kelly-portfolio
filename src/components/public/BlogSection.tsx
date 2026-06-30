'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import type { BlogPost } from '@/types'

export function BlogSection({ posts }: { posts: (BlogPost & { readTime: string })[] }) {
  if (!posts.length) return null

  return (
    <section id="blog" className="relative py-16 sm:py-20 lg:py-28 bg-light-50 dark:bg-dark-100/50 overflow-hidden">
      <div className="section-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Latest <span className="text-gradient-animate">Articles</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Thoughts on technology, engineering, and innovation.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all posts <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block glass-card hover-lift p-6 h-full">
                  <div className="mb-3">
                    <Badge variant="primary">{post.category}</Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(post.publishedAt || post.createdAt).toISOString().split('T')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all posts <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
