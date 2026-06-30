'use client'

import { motion } from 'framer-motion'
import { FileText, Lightbulb, Eye, BookOpen, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

const researchPapers = [
  { title: 'Neural Network Optimization for Embedded Systems', venue: 'IEEE Conference on AI', year: '2025', status: 'Published', type: 'paper' },
  { title: 'Reinforcement Learning in Autonomous Navigation', venue: 'ICRA', year: '2024', status: 'Published', type: 'paper' },
  { title: 'Transfer Learning for Low-Resource Languages', venue: 'ACL Workshop', year: '2024', status: 'Under Review', type: 'paper' },
]

const ideas = [
  { title: 'AI-Powered Personal Learning Assistant', description: 'An adaptive learning system that personalizes education content based on individual learning patterns and goals.', stage: 'Concept' },
  { title: 'Decentralized ML Model Marketplace', description: 'A platform for training, sharing, and monetizing machine learning models on blockchain.', stage: 'Research' },
  { title: 'Autonomous Drone Swarm Coordination', description: 'Multi-agent reinforcement learning for coordinating drone swarms in search and rescue operations.', stage: 'Prototype' },
]

export default function ResearchPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Research & <span className="text-gradient">Innovation</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Exploring the frontiers of technology through research, experimentation, and innovation.
          </p>
        </motion.div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research Papers</h2>
          </div>
          <div className="space-y-4">
            {researchPapers.map((paper, index) => (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5 flex flex-col sm:flex-row items-start justify-between gap-4 group hover:border-primary-500/30 transition-all"
              >
                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white font-semibold mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{paper.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{paper.venue} &middot; {paper.year}</p>
                </div>
                <Badge variant={paper.status === 'Published' ? 'success' : 'warning'}>{paper.status}</Badge>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Innovation Ideas</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 group hover:border-primary-500/30 transition-all"
              >
                <Badge variant="primary" className="mb-3">{idea.stage}</Badge>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{idea.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{idea.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <Eye className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vision Documents</h2>
          </div>
          <Card className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">The Future of Intelligent Systems</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-lg mx-auto">
              A vision document outlining the convergence of AI, robotics, and software engineering 
              and how they will shape the next decade of technological innovation.
            </p>
            <button className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Read Vision Document <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
