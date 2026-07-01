'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, Download, Mail, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

function handleDownloadCV(resumeUrl: string) {
  window.open(resumeUrl, '_blank')
}

const roles = [
  'Software Engineer',
  'AI & ML Enthusiast',
  'Robotics Explorer',
  'Researcher',
  'Graphic Designer',
  'Entrepreneur',
  'Technology Innovator',
]

export function HeroSection({ profilePhotos = [], resumeUrl = null }: { profilePhotos?: string[]; resumeUrl?: string | null }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (profilePhotos.length < 2) return
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % profilePhotos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [profilePhotos.length])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 dark:from-primary-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/5 dark:from-primary-500/10 via-transparent to-transparent" />
      
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/5 dark:bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" />

      <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 dark:border-primary-500/20 bg-white/40 dark:bg-primary-500/10 backdrop-blur-sm px-4 py-1.5 text-sm text-primary-600 dark:text-primary-400">
                <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                Available for opportunities
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-gray-500 dark:text-gray-400">Hi, I&apos;m</span>
                <br />
                <span className="text-gradient-hero">Kelvin Simiyu</span>
              </h1>
              <div className="h-14">
                <span className="text-2xl sm:text-3xl text-gradient-animate font-semibold">
                  {roles[roleIndex]}
                </span>
              </div>
              <p className="max-w-lg text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Crafting innovative solutions at the intersection of software engineering, 
                artificial intelligence, and robotics. Turning complex problems into elegant, 
                scalable systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/contact">
                <Button size="lg" icon={<Mail className="h-4 w-4" />}>
                  Get in Touch
                </Button>
              </Link>
              {resumeUrl ? (
                <Button size="lg" variant="outline" icon={<Download className="h-4 w-4" />} onClick={() => handleDownloadCV(resumeUrl)}>
                  Download CV
                </Button>
              ) : (
                <Button size="lg" variant="outline" icon={<Download className="h-4 w-4" />} disabled>
                  Download CV
                </Button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-gray-500 dark:text-gray-500">Connect:</span>
            {[
              { href: 'https://github.com/Kelly254-shazey', icon: GithubIcon },
              { href: 'https://wa.me/254741178450', icon: MessageCircle },
            ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <div className="h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-96 lg:w-96 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 animate-pulse-glow" />
              <div className="absolute inset-2 sm:inset-2.5 md:inset-3 lg:inset-4 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-600/30 backdrop-blur-3xl flex items-center justify-center overflow-hidden">
                {profilePhotos.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={photoIndex}
                        src={profilePhotos[photoIndex]}
                        alt="Profile"
                        className="h-full w-full object-cover rounded-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                    {profilePhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPhotoIndex((prev) => (prev - 1 + profilePhotos.length) % profilePhotos.length)}
                          aria-label="Previous photo"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-dark-900/60 p-1.5 text-white hover:bg-dark-900/80 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoIndex((prev) => (prev + 1) % profilePhotos.length)}
                          aria-label="Next photo"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-dark-900/60 p-1.5 text-white hover:bg-dark-900/80 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {profilePhotos.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setPhotoIndex(i)}
                              aria-label={`View photo ${i + 1}`}
                              className={`h-1.5 rounded-full transition-all ${
                                i === photoIndex ? 'w-4 bg-primary-400' : 'w-1.5 bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gradient">KS</div>
                    <div className="mt-2 text-sm text-gray-500">Innovator & Builder</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="h-6 w-6 text-gray-500 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}
