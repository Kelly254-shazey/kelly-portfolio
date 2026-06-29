'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { PageLoading } from '@/components/ui/Loading'
import { api } from '@/lib/api'
import type { SiteSettings } from '@/types'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    instagram: '',
    primaryColor: '#3b82f6',
    animations: true,
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
  })

  useEffect(() => {
    api.settings.get().then((settings) => {
      setForm({
        siteName: settings.siteName || '',
        title: settings.title || '',
        bio: settings.bio || '',
        email: settings.email || '',
        phone: settings.phone || '',
        location: settings.location || '',
        github: settings.social?.github || '',
        linkedin: settings.social?.linkedin || '',
        twitter: settings.social?.twitter || '',
        youtube: settings.social?.youtube || '',
        instagram: settings.social?.instagram || '',
        primaryColor: settings.theme?.primaryColor || '#3b82f6',
        animations: settings.theme?.animations ?? true,
        metaTitle: settings.seo?.metaTitle || '',
        metaDescription: settings.seo?.metaDescription || '',
        googleAnalyticsId: settings.seo?.googleAnalyticsId || '',
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.settings.update({
        siteName: form.siteName,
        title: form.title,
        bio: form.bio,
        email: form.email,
        phone: form.phone,
        location: form.location,
        social: {
          github: form.github,
          linkedin: form.linkedin,
          twitter: form.twitter,
          youtube: form.youtube,
          instagram: form.instagram,
        },
        theme: {
          primaryColor: form.primaryColor,
          animations: form.animations,
        },
        seo: {
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          googleAnalyticsId: form.googleAnalyticsId,
        },
      })
    } catch {} finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoading />

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your portfolio site.</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4">Personal Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Site Name" id="siteName" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
              <Input label="Title" id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea label="Bio" id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="sm:col-span-2" />
              <Input label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone" id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Location" id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4">Social Links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="GitHub" id="github" placeholder="https://github.com/..." value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              <Input label="LinkedIn" id="linkedin" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
              <Input label="Twitter" id="twitter" placeholder="https://twitter.com/..." value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
              <Input label="YouTube" id="youtube" placeholder="https://youtube.com/..." value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />
              <Input label="Instagram" id="instagram" placeholder="https://instagram.com/..." value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4">Theme</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-300">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="primaryColor"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    className="h-10 w-10 rounded-lg border border-gray-700 bg-dark-100 cursor-pointer"
                  />
                  <span className="text-sm text-gray-400">{form.primaryColor}</span>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pt-6">
                <input
                  type="checkbox"
                  checked={form.animations}
                  onChange={(e) => setForm({ ...form, animations: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-700 bg-dark-100 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-gray-300">Enable animations</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4">SEO</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Meta Title" id="metaTitle" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
              <Input label="Google Analytics ID" id="googleAnalyticsId" placeholder="G-XXXXXXXXXX" value={form.googleAnalyticsId} onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })} />
              <Textarea label="Meta Description" id="metaDescription" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="sm:col-span-2" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>Save Settings</Button>
        </div>
      </motion.form>
    </div>
  )
}
