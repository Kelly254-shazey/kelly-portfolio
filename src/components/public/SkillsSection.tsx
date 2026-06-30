'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Skill } from '@/types'

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 100)
    return () => clearTimeout(timer)
  }, [level])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
        <span className="text-xs text-gray-500">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-dark-300 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.05, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
        />
      </div>
    </motion.div>
  )
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const sortedCategories = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))

  if (!sortedCategories.length) return null

  return (
    <section id="skills" className="relative py-24 sm:py-32 bg-dark-100/50">
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
              Skills & <span className="text-gradient-animate">Expertise</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Years of experience across multiple domains, constantly learning and evolving.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {sortedCategories.map(([categoryName, categorySkills]) => (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card hover-lift p-6"
              >
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">{categoryName}</h3>
                <div className="space-y-4">
                  {categorySkills
                    .sort((a, b) => a.order - b.order)
                    .map((skill, index) => (
                      <SkillBar key={skill.id} name={skill.name} level={skill.proficiency} index={index} />
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
