import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

const researchPapers = [
  { slug: 'neural-network-optimization-for-embedded-systems', title: 'Neural Network Optimization for Embedded Systems', venue: 'IEEE Conference on AI', year: '2025', status: 'Published', abstract: 'This paper presents novel techniques for optimizing neural network architectures to run efficiently on resource-constrained embedded systems. We propose a hybrid pruning-quantization approach that reduces model size by 85% while maintaining 97% of the original accuracy. Our method achieves real-time inference on ARM Cortex-M class microcontrollers, enabling advanced AI capabilities on IoT devices.' },
  { slug: 'reinforcement-learning-in-autonomous-navigation', title: 'Reinforcement Learning in Autonomous Navigation', venue: 'ICRA', year: '2024', status: 'Published', abstract: 'We explore the application of deep reinforcement learning algorithms for autonomous navigation in dynamic environments. Our approach combines Proximal Policy Optimization (PPO) with a novel reward shaping mechanism that accounts for both safety and efficiency. Experiments in simulated urban environments demonstrate a 40% reduction in collision rates compared to traditional path planning methods.' },
  { slug: 'transfer-learning-for-low-resource-languages', title: 'Transfer Learning for Low-Resource Languages', venue: 'ACL Workshop', year: '2024', status: 'Under Review', abstract: 'This research investigates cross-lingual transfer learning techniques for natural language processing in low-resource African languages. We evaluate several multilingual transformer models on Swahili, Kikuyu, and Luo text classification tasks, demonstrating that targeted fine-tuning with minimal annotated data can achieve competitive performance. Our findings suggest pathways for expanding NLP coverage to underserved languages.' },
]

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = researchPapers.find((p) => p.slug === slug)
  if (!paper) notFound()

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/research" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to research
        </Link>

        <article>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={paper.status === 'Published' ? 'success' : 'warning'}>{paper.status}</Badge>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" /> {paper.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{paper.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-8">{paper.venue} &middot; {paper.year}</p>

          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Abstract</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{paper.abstract}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
              <ExternalLink className="h-4 w-4" /> Read Full Paper
            </button>
          </div>
        </article>
      </div>
    </div>
  )
}
