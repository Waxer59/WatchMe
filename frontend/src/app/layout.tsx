import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers/chakra-providers'
import { Box } from '@chakra-ui/react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WatchMe',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} m-auto bg-background text-white overflow-hidden`}>
        <Providers>
          <Navbar />
          <Box as="div" display="flex" width="full" height="full">
            <Sidebar />
            <Box
              as="div"
              display="flex"
              flexDirection="column"
              width="full"
              padding="4"
              className="bg-foreground">
              {children}
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  )
}
