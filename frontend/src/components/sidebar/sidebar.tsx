"use client"

import { Box } from '@chakra-ui/react'
import { SidebarButton } from './siderbar-button'
import { EyeIcon, HouseIcon, UsersIcon } from 'lucide-react'
import { SidebarChannel } from './sidebar-channel'
import { SidebarCategories } from './sidebar-categories'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <Box
      minWidth="64"
      height="full"
      padding="4"
      className="bg-gray-800 border-r border-gray-700 overflow-auto">
      <div className="space-y-2">
        <SidebarButton icon={<HouseIcon />} isActive={pathname === '/'} as={Link} href="/">
          Home
        </SidebarButton>
        <SidebarButton icon={<UsersIcon />} isActive={pathname === '/following'} as={Link} href="/following">
          Following
        </SidebarButton>
        <SidebarButton icon={<EyeIcon />} isActive={pathname === '/discover'} as={Link} href="/discover">
          Discover
        </SidebarButton>
      </div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-8 mb-3">
        Categories
      </h3>
      <SidebarCategories />
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-8 mb-3">
        Followed Channels
      </h3>
      <div className="space-y-2">
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
        <SidebarChannel
          username="Hgo"
          avatar=""
          topic="Art"
          count={24}
          isLive
        />
      </div>
    </Box>
  )
}
