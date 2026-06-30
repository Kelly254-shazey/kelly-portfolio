'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get('name'),
      email: form.get('email'),
      subject: form.get('subject'),
      message: form.get('message'),
    }
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) setSubmitted(true)
    } catch {}
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Have a question, project idea, or just want to connect? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'kelly123simiyu@gmail.com' },
              { icon: Phone, label: 'Phone', value: '+254796104666' },
              { icon: MessageCircle, label: 'WhatsApp', value: '+254741178450' },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya' },
            ].map((item) => (
                <div key={item.label} className="glass-card p-4 flex items-center gap-4">
                <div className="rounded-xl bg-primary-500/10 dark:bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400"><item.icon className="h-5 w-5" /></div>
                <div><p className="text-xs text-gray-500">{item.label}</p><p className="text-sm text-gray-700 dark:text-gray-300">{item.value}</p></div>
              </div>
            ))}
            <div className="glass-card p-4">
              <p className="text-xs text-gray-500 mb-3">Social Links</p>
              <div className="flex gap-2">
                  {[
                    { href: 'https://github.com/Kelly254-shazey', icon: GithubIcon },
                    { href: 'https://wa.me/254741178450', icon: MessageCircle },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-all"><s.icon className="h-5 w-5" /></a>
                  ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            {submitted ? (
              <div className="glass-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <Send className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" name="name" placeholder="Your full name" required />
                  <Input label="Email" name="email" type="email" placeholder="your@email.com" required />
                </div>
                <Input label="Subject" name="subject" placeholder="What is this regarding?" />
                <Textarea label="Message" name="message" placeholder="Tell me about your project, question, or idea..." required />
                <Button type="submit" className="w-full" size="lg" icon={<Send className="h-4 w-4" />}>Send Message</Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
