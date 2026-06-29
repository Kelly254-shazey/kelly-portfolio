'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

export function ContactSection() {
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // handle error
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-dark-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or just want to say hi? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {[
              { icon: Mail, label: 'Email', value: 'kelvin@example.com' },
              { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 glass-card p-4">
                <div className="rounded-xl bg-primary-500/10 p-3 text-primary-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm text-gray-300">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            {submitted ? (
              <div className="glass-card p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <Send className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                <p className="mt-2 text-gray-400">Thank you for reaching out. I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" name="name" placeholder="Your name" required />
                  <Input label="Email" name="email" type="email" placeholder="your@email.com" required />
                </div>
                <Input label="Subject" name="subject" placeholder="What's this about?" />
                <Textarea label="Message" name="message" placeholder="Tell me about your project..." required />
                <Button type="submit" className="w-full" icon={<Send className="h-4 w-4" />}>
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
