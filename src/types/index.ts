export interface Project {
  id: string
  title: string
  description: string
  content?: string
  category: string
  technologies: string[]
  images: string[]
  videoUrl?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  order: number
  slug: string
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt?: string
  category: string
  tags: string[]
  coverImage?: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  createdAt: string
  updatedAt: string
  authorId: string
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  author: string
  email?: string
  approved: boolean
  postId: string
  createdAt: string
}

export interface Skill {
  id: string
  name: string
  proficiency: number
  category: string
  icon?: string
  order: number
}

export interface Testimonial {
  id: string
  name: string
  company?: string
  role?: string
  content: string
  rating: number
  photo?: string
  approved: boolean
  order: number
  createdAt: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  createdAt: string
}

export interface Media {
  id: string
  name: string
  url: string
  type: string
  size?: number
  folder?: string
  createdAt: string
}

export interface Resume {
  id: string
  name: string
  url: string
  version: string
  downloads: number
  active: boolean
  createdAt: string
}

export interface SiteSettings {
  id: string
  siteName: string
  title: string
  bio?: string
  email?: string
  phone?: string
  location?: string
  avatar?: string
  profilePhotos: string[]
  resumeUrl?: string
  social: SocialLinks
  theme: ThemeSettings
  seo: SEOSettings
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  youtube?: string
  instagram?: string
  whatsapp?: string
  website?: string
}

export interface ThemeSettings {
  primaryColor?: string
  secondaryColor?: string
  font?: string
  animations?: boolean
  darkMode?: boolean
}

export interface SEOSettings {
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  googleAnalyticsId?: string
}

export interface Achievement {
  id: string
  title: string
  description?: string
  issuer?: string
  date?: string
  category: string
  icon?: string
  url?: string
  order: number
  createdAt: string
}

export interface AnalyticsEvent {
  page: string
  event: string
  metadata?: Record<string, unknown>
}

export interface DashboardStats {
  totalProjects: number
  publishedProjects: number
  totalBlogPosts: number
  publishedPosts: number
  totalMessages: number
  unreadMessages: number
  totalTestimonials: number
  approvedTestimonials: number
  totalSkills: number
  totalMedia: number
  totalResumeDownloads: number
  pageViews: number
  recentMessages: Message[]
}
