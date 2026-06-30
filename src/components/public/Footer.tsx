import { Mail, Heart, MessageCircle } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import Link from 'next/link'

const socialLinks = [
  { href: 'https://github.com/Kelly254-shazey', icon: GithubIcon, label: 'GitHub' },
  { href: 'mailto:kelly123simiyu@gmail.com', icon: Mail, label: 'Email' },
  { href: 'https://wa.me/254741178450', icon: MessageCircle, label: 'WhatsApp' },
]

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/5 bg-light dark:bg-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center sm:text-left">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="https://res.cloudinary.com/dqdyjocsq/image/upload/v1782859642/eeb72548-daf3-4a63-925f-1cd39b5f9008.png" alt="Vidamia" className="h-12 w-12 sm:h-14 sm:w-14 object-contain" />
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient">vidamia</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 max-w-xs mx-auto sm:mx-0">
              Building the future through code, AI, and innovation.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contact</h3>
            <div className="space-y-2">
              <a href="mailto:kelly123simiyu@gmail.com" className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                kelly123simiyu@gmail.com
              </a>
              <a href="https://wa.me/254741178450" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <MessageCircle className="h-4 w-4 shrink-0" />
                +254 741 178 450
              </a>
            </div>
            <div className="flex justify-center sm:justify-start gap-2 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-white/5 pt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1 flex-wrap">
            &copy; {new Date().getFullYear()} Vidamia. Built with <Heart className="h-3.5 w-3.5 text-red-500" /> and Next.js.
          </p>
        </div>
      </div>
    </footer>
  )
}
