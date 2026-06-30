import { Mail, Heart, MessageCircle } from 'lucide-react'
import { GithubIcon } from '@/components/ui/Icons'
import Link from 'next/link'

const socialLinks = [
  { href: 'https://github.com/Kelly254-shazey', icon: GithubIcon, label: 'GitHub' },
  { href: 'mailto:kelly123simiyu@gmail.com', icon: Mail, label: 'Email' },
  { href: 'https://wa.me/254741178450', icon: MessageCircle, label: 'WhatsApp' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient">K</span>
              <span className="text-white">elvin</span>
              <span className="text-gradient">.</span>
            </span>
            <p className="mt-1 text-sm text-gray-500">
              Building the future through code, AI, and innovation.
            </p>
          </div>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-dark-200 transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()} Kelvin Simiyu. Built with <Heart className="h-3.5 w-3.5 text-red-500" /> and Next.js.
          </p>
        </div>
      </div>
    </footer>
  )
}
