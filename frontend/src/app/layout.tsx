import type { Metadata } from 'next'
import './globals.css'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: 'Online XOX - Multiplayer Tic Tac Toe',
  description: 'Real-time multiplayer Tic Tac Toe game built with Next.js and Socket.IO',
  keywords: ['tic-tac-toe', 'multiplayer', 'game', 'online', 'real-time'],
  authors: [{ name: 'XOX Game Team' }],
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Online XOX - Multiplayer Tic Tac Toe',
    description: 'Play Tic Tac Toe online with friends in real-time!',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-inter antialiased">
        <ServiceWorkerRegistration />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
          {children}
        </div>
      </body>
    </html>
  )
}