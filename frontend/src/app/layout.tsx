import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Online XOX - Multiplayer Tic Tac Toe',
  description: 'Real-time multiplayer Tic Tac Toe game built with Next.js and Socket.IO',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          {children}
        </div>
      </body>
    </html>
  )
}