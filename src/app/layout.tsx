import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Kelvin Simiyu | Software Engineer & Innovator',
  description: 'Portfolio of Kelvin Simiyu — Software Engineering, AI/ML, Robotics, and Technology Innovation.',
  keywords: ['software engineer', 'AI', 'machine learning', 'robotics', 'portfolio', 'Kelvin Simiyu'],
  openGraph: {
    title: 'Kelvin Simiyu | Software Engineer & Innovator',
    description: 'Building the future through code, AI, and innovation.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
