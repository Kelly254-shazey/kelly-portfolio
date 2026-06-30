'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Cpu, Lightbulb, Palette, Rocket } from 'lucide-react'

const roles = [
  {
    icon: Code2,
    title: 'Software Engineer',
    description: 'Building robust, scalable applications with modern technologies.',
  },
  {
    icon: Brain,
    title: 'AI & ML Enthusiast',
    description: 'Exploring the frontiers of artificial intelligence and machine learning.',
  },
  {
    icon: Cpu,
    title: 'Robotics Explorer',
    description: 'Pushing boundaries in robotics and autonomous systems.',
  },
  {
    icon: Lightbulb,
    title: 'Researcher',
    description: 'Conducting research in emerging technologies and innovative solutions.',
  },
  {
    icon: Palette,
    title: 'Graphic Designer',
    description: 'Creating visually compelling designs with attention to detail.',
  },
  {
    icon: Rocket,
    title: 'Entrepreneur',
    description: 'Turning ideas into impactful products and solutions.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="section-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              About <span className="text-gradient-animate">Me</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A multidisciplinary innovator combining technical expertise with creative vision 
              to build the future of technology.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card hover-lift group p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  <role.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{role.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
