'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Heart, Phone, Mail, MessageCircle, Send, X, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

export default function SupportPage() {
  const [showDonorDialog, setShowDonorDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get('name'),
      email: form.get('email'),
      subject: 'Support Inquiry',
      message: form.get('message'),
    }
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) setSubmitted(true)
    } catch {}
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Comments & <span className="text-gradient">Support</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question, suggestion, or want to support my work? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-6 sm:p-8 text-center">
              <Heart className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Support My Work</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                If you find my projects valuable, consider supporting me. Your contributions help me create more open-source tools and content.
              </p>
              <Button size="lg" icon={<Coffee className="h-4 w-4" />} onClick={() => setShowDonorDialog(true)}>
                Support Me
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card p-6 sm:p-8 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-primary-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Send a Message</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Have questions, feedback, or just want to say hi? Drop me a message and I&apos;ll get back to you.
              </p>
              <Button size="lg" variant="outline" icon={<Send className="h-4 w-4" />} onClick={() => document.getElementById('support-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Write a Message
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div id="support-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="glass-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Send className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Message Sent!</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave a Comment / Message</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" name="name" placeholder="Your name" required />
                <Input label="Email" name="email" type="email" placeholder="your@email.com" />
              </div>
              <Textarea label="Message" name="message" placeholder="Your message, question, or feedback..." required />
              <Button type="submit" className="w-full" icon={<Send className="h-4 w-4" />}>Send Message</Button>
            </form>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showDonorDialog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowDonorDialog(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-md"
            >
              <div className="glass-strong p-6 sm:p-8 relative">
                <button onClick={() => setShowDonorDialog(false)} className="absolute top-4 right-4 rounded-lg p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-200 transition-all">
                  <X className="h-5 w-5" />
                </button>
                <div className="text-center mb-6">
                  <Heart className="mx-auto h-10 w-10 text-red-500 mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Support Vidamia</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your support means the world. Reach out via:</p>
                </div>
                <div className="space-y-4">
                  <a href="tel:+254796104666" className="flex items-center gap-4 glass-card p-4 hover:border-primary-500/30 transition-all group">
                    <div className="rounded-xl bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call / Mobile Money</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">+254 796 104 666</p>
                    </div>
                  </a>
                  <a href="mailto:kelly123simiyu@gmail.com" className="flex items-center gap-4 glass-card p-4 hover:border-primary-500/30 transition-all group">
                    <div className="rounded-xl bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Send via Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">kelly123simiyu@gmail.com</p>
                    </div>
                  </a>
                  <a href="https://wa.me/254741178450" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 glass-card p-4 hover:border-primary-500/30 transition-all group">
                    <div className="rounded-xl bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">+254 741 178 450</p>
                    </div>
                  </a>
                </div>
                <p className="text-center text-xs text-gray-500 mt-6">Thank you for your generosity! Every contribution helps me build more.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
