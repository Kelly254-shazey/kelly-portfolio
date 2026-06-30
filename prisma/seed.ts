import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@kelvin.com' } })
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await prisma.user.create({
      data: { email: 'admin@kelvin.com', name: 'Kelvin Simiyu', password: hashedPassword, role: 'admin' },
    })
  }

  // Skills
  const skillCount = await prisma.skill.count()
  if (skillCount === 0) {
    const skills = [
      { name: 'TypeScript', proficiency: 95, category: 'Languages', order: 1 },
      { name: 'Python', proficiency: 90, category: 'Languages', order: 2 },
      { name: 'JavaScript', proficiency: 95, category: 'Languages', order: 3 },
      { name: 'Java', proficiency: 80, category: 'Languages', order: 4 },
      { name: 'C++', proficiency: 75, category: 'Languages', order: 5 },
      { name: 'SQL', proficiency: 85, category: 'Languages', order: 6 },
      { name: 'React/Next.js', proficiency: 95, category: 'Frameworks & Libraries', order: 7 },
      { name: 'Node.js', proficiency: 90, category: 'Frameworks & Libraries', order: 8 },
      { name: 'Express.js', proficiency: 90, category: 'Frameworks & Libraries', order: 9 },
      { name: 'TensorFlow', proficiency: 75, category: 'Frameworks & Libraries', order: 10 },
      { name: 'PyTorch', proficiency: 70, category: 'Frameworks & Libraries', order: 11 },
      { name: 'Flutter', proficiency: 80, category: 'Frameworks & Libraries', order: 12 },
      { name: 'Docker', proficiency: 85, category: 'Tools & Platforms', order: 13 },
      { name: 'AWS', proficiency: 80, category: 'Tools & Platforms', order: 14 },
      { name: 'Git', proficiency: 95, category: 'Tools & Platforms', order: 15 },
      { name: 'PostgreSQL', proficiency: 85, category: 'Tools & Platforms', order: 16 },
      { name: 'MongoDB', proficiency: 80, category: 'Tools & Platforms', order: 17 },
      { name: 'Redis', proficiency: 75, category: 'Tools & Platforms', order: 18 },
      { name: 'AI/Machine Learning', proficiency: 85, category: 'Domains', order: 19 },
      { name: 'Robotics', proficiency: 70, category: 'Domains', order: 20 },
      { name: 'Cloud Architecture', proficiency: 80, category: 'Domains', order: 21 },
      { name: 'UI/UX Design', proficiency: 85, category: 'Domains', order: 22 },
      { name: 'DevOps/CI/CD', proficiency: 80, category: 'Domains', order: 23 },
      { name: 'Graphic Design', proficiency: 75, category: 'Domains', order: 24 },
    ]
    for (const skill of skills) {
      await prisma.skill.create({ data: skill })
    }
  }

  // Projects
  const projectCount = await prisma.project.count()
  if (projectCount === 0) {
    const projects = [
      {
        title: 'AI-Powered Analytics Platform',
        description: 'Real-time analytics engine using machine learning for predictive insights and anomaly detection across millions of data points.',
        content: 'A comprehensive analytics platform built with Python, TensorFlow, and React that processes streaming data to provide real-time business intelligence.',
        category: 'AI/ML',
        technologies: JSON.stringify(['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL']),
        images: JSON.stringify([]),
        githubUrl: 'https://github.com/KellyFlo',
        liveUrl: 'https://example.com',
        featured: true,
        status: 'published',
        slug: 'ai-powered-analytics-platform',
        order: 1,
      },
      {
        title: 'Robotics Control System',
        description: 'Autonomous navigation system for mobile robots using computer vision, SLAM algorithms, and reinforcement learning.',
        category: 'Robotics',
        technologies: JSON.stringify(['C++', 'ROS', 'Python', 'OpenCV', 'TensorFlow']),
        images: JSON.stringify([]),
        githubUrl: 'https://github.com/KellyFlo',
        liveUrl: 'https://example.com',
        featured: true,
        status: 'published',
        slug: 'robotics-control-system',
        order: 2,
      },
      {
        title: 'Cloud Infrastructure Manager',
        description: 'Multi-cloud management platform for automated deployment, monitoring, and scaling across AWS, GCP, and Azure.',
        category: 'DevOps',
        technologies: JSON.stringify(['TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Terraform']),
        images: JSON.stringify([]),
        githubUrl: 'https://github.com/KellyFlo',
        liveUrl: 'https://example.com',
        featured: true,
        status: 'published',
        slug: 'cloud-infrastructure-manager',
        order: 3,
      },
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with AI-powered recommendations, real-time inventory management, and payment processing.',
        category: 'Web',
        technologies: JSON.stringify(['Next.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker']),
        images: JSON.stringify([]),
        featured: false,
        status: 'published',
        slug: 'e-commerce-platform',
        order: 4,
      },
      {
        title: 'Mobile Health App',
        description: 'Cross-platform health tracking application with workout plans, nutrition tracking, and AI-powered health insights.',
        category: 'Mobile',
        technologies: JSON.stringify(['Flutter', 'Firebase', 'Dart', 'TensorFlow Lite']),
        images: JSON.stringify([]),
        featured: false,
        status: 'published',
        slug: 'mobile-health-app',
        order: 5,
      },
      {
        title: 'NLP Research Framework',
        description: 'Framework for natural language processing experiments with support for transformers, embeddings, and custom model training.',
        category: 'Research',
        technologies: JSON.stringify(['Python', 'PyTorch', 'Transformers', 'Weights & Biases']),
        images: JSON.stringify([]),
        featured: false,
        status: 'published',
        slug: 'nlp-research-framework',
        order: 6,
      },
    ]
    for (const project of projects) {
      await prisma.project.create({ data: project })
    }
  }

  // Blog posts
  const blogCount = await prisma.blogPost.count()
  if (blogCount === 0) {
    const admin = await prisma.user.findFirst()!
    const posts = [
      {
        title: 'Building Scalable AI Systems',
        content: 'A deep dive into architecting machine learning systems that scale from prototype to production. This covers data pipelines, model serving, monitoring, and infrastructure considerations.',
        excerpt: 'A deep dive into architecting machine learning systems that scale from prototype to production.',
        category: 'AI/ML',
        tags: JSON.stringify(['AI', 'ML', 'Architecture', 'Scalability']),
        slug: 'building-scalable-ai-systems',
        status: 'published',
        publishedAt: new Date('2026-06-15'),
        authorId: (await prisma.user.findFirst())!.id,
      },
      {
        title: 'The Future of Robotics',
        content: 'Exploring emerging trends in robotics and how AI is transforming autonomous systems. From industrial automation to service robots, the future is intelligent.',
        excerpt: 'Exploring emerging trends in robotics and how AI is transforming autonomous systems.',
        category: 'Robotics',
        tags: JSON.stringify(['Robotics', 'AI', 'Automation', 'Future Tech']),
        slug: 'future-of-robotics',
        status: 'published',
        publishedAt: new Date('2026-05-20'),
        authorId: (await prisma.user.findFirst())!.id,
      },
      {
        title: 'Full-Stack Development Best Practices',
        content: 'Lessons learned from building production applications with modern tech stacks. Covers architecture patterns, testing strategies, and deployment workflows.',
        excerpt: 'Lessons learned from building production applications with modern tech stacks.',
        category: 'Engineering',
        tags: JSON.stringify(['Web Development', 'Architecture', 'Best Practices']),
        slug: 'fullstack-best-practices',
        status: 'published',
        publishedAt: new Date('2026-04-10'),
        authorId: (await prisma.user.findFirst())!.id,
      },
    ]
    for (const post of posts) {
      await prisma.blogPost.create({ data: post })
    }
  }

  // Testimonials
  const testimonialCount = await prisma.testimonial.count()
  if (testimonialCount === 0) {
    const testimonials = [
      { name: 'Jane Doe', role: 'CTO', company: 'TechCorp', content: 'Kelvin is an exceptional engineer. His ability to bridge the gap between AI and practical applications is remarkable. He delivered our project ahead of schedule with outstanding quality.', rating: 5, approved: true, order: 1 },
      { name: 'John Smith', role: 'Lead Developer', company: 'InnovateX', content: 'Working with Kelvin was a game-changer for our team. His deep understanding of software architecture and AI integration helped us build something truly innovative.', rating: 5, approved: true, order: 2 },
      { name: 'Sarah Johnson', role: 'Product Manager', company: 'DataFlow', content: 'Kelvin brings a unique combination of technical expertise and creative vision. He doesn\'t just write code — he builds solutions that make a real impact.', rating: 5, approved: true, order: 3 },
    ]
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t })
    }
  }

  // Achievements
  const achievementCount = await prisma.achievement.count()
  if (achievementCount === 0) {
    const achievements = [
      { title: 'AWS Certified Solutions Architect', description: 'Professional-level certification for designing distributed systems on AWS.', issuer: 'Amazon Web Services', date: new Date('2025-11-15'), category: 'certification', order: 1 },
      { title: 'Google Professional Data Engineer', description: 'Certification for designing and building data processing systems on GCP.', issuer: 'Google Cloud', date: new Date('2026-02-20'), category: 'certification', order: 2 },
      { title: 'Best Innovation in AI - 2026', description: 'First place in an AI innovation challenge for an autonomous analytics system.', issuer: 'TechCrunch Disrupt', date: new Date('2026-05-10'), category: 'achievement', order: 3 },
      { title: 'Published: Deep Learning for Real-Time Analytics', description: 'Co-authored research paper published in the Journal of Machine Learning Research.', issuer: 'JMLR', date: new Date('2026-03-01'), category: 'publication', order: 4 },
    ]
    for (const a of achievements) {
      await prisma.achievement.create({ data: a })
    }
  }

  // Settings
  const existingSettings = await prisma.siteSettings.findFirst()
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'Kelvin Simiyu',
        title: 'Kelvin Simiyu - Software Engineer & Innovator',
        bio: 'Building the future through code, AI, and innovation.',
        email: 'kelly123simiyu@gmail.com',
        phone: '+254796104666',
        location: 'Nairobi, Kenya',
        social: JSON.stringify({ github: 'https://github.com/Kelly254-shazey', whatsapp: 'https://wa.me/254741178450' }),
        theme: JSON.stringify({ primaryColor: '#3b82f6', animations: true, darkMode: true }),
        seo: JSON.stringify({ metaTitle: 'Kelvin Simiyu | Software Engineer & Innovator', metaDescription: 'Portfolio of Kelvin Simiyu' }),
      },
    })
  }

  console.log('Seed completed successfully!')
  console.log(`  - ${await prisma.skill.count()} skills`)
  console.log(`  - ${await prisma.project.count()} projects`)
  console.log(`  - ${await prisma.blogPost.count()} blog posts`)
  console.log(`  - ${await prisma.testimonial.count()} testimonials`)
  console.log(`  - ${await prisma.achievement.count()} achievements`)
  console.log('Admin login: admin@kelvin.com / admin123')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
