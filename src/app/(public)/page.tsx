import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { TestimonialsSection } from '@/components/public/TestimonialsSection'
import { BlogSection } from '@/components/public/BlogSection'
import { ContactSection } from '@/components/public/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
