'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/support', label: 'Support' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const prevPathname = useRef(pathname)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      setIsOpen(false)
    }
  }, [pathname])

  return (
    <nav
      className={cn(
        'fixed top-0 z-40 w-full transition-all duration-300',
        isOpen
          ? 'bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-white/5 shadow-lg'
          : scrolled
            ? 'bg-white/70 dark:bg-dark-100/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 shadow-sm'
            : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
        <Link href="/" onClick={() => setIsOpen(false)} className="relative z-10 flex items-center gap-2 sm:gap-3">
          <img src="https://res.cloudinary.com/dqdyjocsq/image/upload/v1782859642/eeb72548-daf3-4a63-925f-1cd39b5f9008.png" alt="Vidamiaa" className="w-auto h-[28px] sm:h-[40px] object-contain drop-shadow-lg" />
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-gradient-brand">vidamiaa</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                pathname === link.href
                  ? 'text-primary-600 bg-primary-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
            aria-label="Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-40 h-full w-72 bg-white dark:bg-dark-100 border-l border-gray-200 dark:border-white/5 shadow-2xl md:hidden pt-20"
            >
              <div className="flex flex-col gap-1 px-4 pb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200',
                      pathname === link.href
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-500/10 border border-primary-500/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200 border border-transparent'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
