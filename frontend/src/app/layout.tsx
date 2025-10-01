import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Provider } from '@/providers/provider'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WatchMe',
  description: 'The new streaming platform for the world of live streaming',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://watchme.hgo.one',
    title: 'WatchMe',
    description: 'The new streaming platform for the world of live streaming',
    images: [
      {
        url: 'https://watchme.hgo.one/watchme-og.png',
        width: 1200,
        height: 630,
        alt: 'WatchMe'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WatchMe',
    description: 'The new streaming platform for the world of live streaming',
    images: [
      {
        url: 'https://watchme.hgo.one/watchme-og.png',
        width: 1200,
        height: 630,
        alt: 'WatchMe'
      }
    ]
  },
  icons: {
    icon: '/favicon.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} overflow-hidden h-dvh max-h-dvh min-h-dvh bg-gray-900`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
