'use client'

import { usePrevious } from '@/hooks/usePrevious'
import { useSocketEvents } from '@/hooks/useSocketEvents'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

const RESERVED_PATHS = [
  '/settings',
  '/following',
  '/discover',
  '/search',
  '/category'
]

export const NavigationEvents: React.FC<Props> = ({ children }) => {
  const pathname = usePathname()
  const previousPathname = usePrevious<string>(pathname)
  const { sendLeaveUserChannel } = useSocketEvents()

  useEffect(() => {
    const isUserRoute =
      !RESERVED_PATHS.some((reservedPath) =>
        pathname.startsWith(reservedPath)
      ) && pathname !== '/'

    const wasUserRoute =
      !RESERVED_PATHS.some((reservedPath) =>
        previousPathname?.startsWith(reservedPath)
      ) &&
      previousPathname !== '/' &&
      previousPathname

    if (!isUserRoute && wasUserRoute) {
      sendLeaveUserChannel()
    }
  }, [pathname])

  return children
}
