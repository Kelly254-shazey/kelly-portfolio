const API_BASE = '/api'

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || `API error: ${res.status}`)
  }

  return res.json()
}

export const api = {
  projects: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : ''
      return fetchAPI<import('@/types').Project[]>(`/projects${qs}`)
    },
    get: (slug: string) => fetchAPI<import('@/types').Project>(`/projects/${slug}`),
    create: (data: Partial<import('@/types').Project>) =>
      fetchAPI<import('@/types').Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('@/types').Project>) =>
      fetchAPI<import('@/types').Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/projects/${id}`, { method: 'DELETE' }),
    reorder: (items: { id: string; order: number }[]) =>
      fetchAPI<void>('/projects/reorder', { method: 'PUT', body: JSON.stringify({ items }) }),
  },
  blog: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : ''
      return fetchAPI<import('@/types').BlogPost[]>(`/blog${qs}`)
    },
    get: (slug: string) => fetchAPI<import('@/types').BlogPost>(`/blog/${slug}`),
    create: (data: Partial<import('@/types').BlogPost>) =>
      fetchAPI<import('@/types').BlogPost>('/blog', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('@/types').BlogPost>) =>
      fetchAPI<import('@/types').BlogPost>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/blog/${id}`, { method: 'DELETE' }),
  },
  skills: {
    list: () => fetchAPI<import('@/types').Skill[]>('/skills'),
    create: (data: Partial<import('@/types').Skill>) =>
      fetchAPI<import('@/types').Skill>('/skills', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('@/types').Skill>) =>
      fetchAPI<import('@/types').Skill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/skills/${id}`, { method: 'DELETE' }),
  },
  testimonials: {
    list: (approved?: boolean) =>
      fetchAPI<import('@/types').Testimonial[]>(`/testimonials${approved !== undefined ? `?approved=${approved}` : ''}`),
    create: (data: Partial<import('@/types').Testimonial>) =>
      fetchAPI<import('@/types').Testimonial>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('@/types').Testimonial>) =>
      fetchAPI<import('@/types').Testimonial>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/testimonials/${id}`, { method: 'DELETE' }),
  },
  messages: {
    list: () => fetchAPI<import('@/types').Message[]>('/contact'),
    send: (data: { name: string; email: string; subject?: string; message: string }) =>
      fetchAPI<import('@/types').Message>('/contact', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id: string) =>
      fetchAPI<void>(`/contact/${id}`, { method: 'PUT' }),
    delete: (id: string) =>
      fetchAPI<void>(`/contact/${id}`, { method: 'DELETE' }),
  },
  media: {
    list: (folder?: string) =>
      fetchAPI<import('@/types').Media[]>(`/media${folder ? `?folder=${folder}` : ''}`),
    delete: (id: string) =>
      fetchAPI<void>(`/media/${id}`, { method: 'DELETE' }),
  },
  resume: {
    list: () => fetchAPI<import('@/types').Resume[]>('/resume'),
    upload: (formData: FormData) =>
      fetch('/api/resume', { method: 'POST', body: formData }).then((r) => r.json()),
    update: (id: string, data: Partial<import('@/types').Resume>) =>
      fetchAPI<import('@/types').Resume>(`/resume/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/resume/${id}`, { method: 'DELETE' }),
  },
  achievements: {
    list: () => fetchAPI<import('@/types').Achievement[]>('/achievements'),
    create: (data: Partial<import('@/types').Achievement>) =>
      fetchAPI<import('@/types').Achievement>('/achievements', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<import('@/types').Achievement>) =>
      fetchAPI<import('@/types').Achievement>(`/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<void>(`/achievements/${id}`, { method: 'DELETE' }),
  },
  analytics: {
    get: () => fetchAPI<import('@/types').DashboardStats>('/analytics'),
    track: (data: import('@/types').AnalyticsEvent) =>
      fetchAPI<void>('/analytics/track', { method: 'POST', body: JSON.stringify(data) }),
  },
  settings: {
    get: () => fetchAPI<import('@/types').SiteSettings>('/settings'),
    update: (data: Partial<import('@/types').SiteSettings>) =>
      fetchAPI<import('@/types').SiteSettings>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
}
