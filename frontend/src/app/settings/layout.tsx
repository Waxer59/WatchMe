import { ProtectedRoute } from '@/layouts/protected-route'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WatchMe - Settings'
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
