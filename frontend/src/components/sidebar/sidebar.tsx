'use client'

import { Box } from '@chakra-ui/react'
import { SidebarButton } from './siderbar-button'
import { EyeIcon, HouseIcon, UsersIcon } from 'lucide-react'
import { SidebarChannel } from './sidebar-channel'
import { SidebarCategories } from './sidebar-categories'
import { usePathname } from 'next/navigation'
import { useAccountStore } from '@/store/account'
import Link from 'next/link'
import { StreamCategoriesViewers } from '@/types'
import { useUiStore } from '@/store/ui'

interface Props {
  categories: StreamCategoriesViewers[]
}

export function Sidebar({ categories }: Props) {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const following = useAccountStore((state) => state.following)
  const pathname = usePathname()

  return (
    <Box
      minWidth="64"
      height="full"
      padding="4"
      className={`bg-gray-800 border-r border-gray-700 overflow-auto transition-transform -translate-x-70 z-99 absolute md:block ${isSidebarOpen ? 'translate-x-0' : ''} md:block md:translate-x-0 md:relative`}>
      <div className="space-y-2">
        <SidebarButton
          icon={<HouseIcon />}
          isActive={pathname === '/'}
          as={Link}
          href="/">
          Home
        </SidebarButton>
        {isLoggedIn && (
          <SidebarButton
            icon={<UsersIcon />}
            isActive={pathname === '/following'}
            as={Link}
            href="/following">
            Following
          </SidebarButton>
        )}
        <SidebarButton
          icon={<EyeIcon />}
          isActive={pathname === '/discover'}
          as={Link}
          href="/discover">
          Discover
        </SidebarButton>
      </div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-8 mb-3">
        Categories
      </h3>
      <SidebarCategories categories={categories} />
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-8 mb-3">
        Followed Channels
      </h3>
      <div className="space-y-2">
        {following?.map((following) => (
          <SidebarChannel
            key={following.id}
            username={following.username}
            avatar={following.avatar}
            isLive={following.is_streaming}
            presence_color={following.presence_color}
            category="Art"
            count={24}
          />
        ))}
      </div>
    </Box>
  )
}
