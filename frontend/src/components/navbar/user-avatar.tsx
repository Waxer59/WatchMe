'use client'

import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useAccountStore } from '@/store/account'
import { Avatar, Button, Menu } from '@chakra-ui/react'
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

export function UserAvatar() {
  const avatar = useAccountStore((state) => state.avatar)
  const username = useAccountStore((state) => state.username)
  const clearAccount = useAccountStore((state) => state.clear)

  const handleLogout = async () => {
    await fetch(getPublicEnv().BACKEND_URL + '/auth/logout', {
      credentials: 'include',
      method: 'POST'
    })
    localStorage.removeItem('isLoggedIn')
    clearAccount()
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="plain" className="outline-none">
          <Avatar.Root colorPalette="gray">
            <Avatar.Fallback name={username} />
            <Avatar.Image src={avatar} />
          </Avatar.Root>
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          className={'rounded-md bg-gray-800 border-gray-700 border'}>
          <Menu.Item
            value="me"
            className="cursor-pointer hover:bg-gray-700 transition-all"
            asChild>
            <Link href={`/${username}`} scroll={false}>
              <UserIcon size={18} />
              My Channel
            </Link>
          </Menu.Item>
          <Menu.Item
            value="logout"
            className="cursor-pointer hover:bg-gray-700 transition-all"
            asChild>
            <Link href="/settings">
              <SettingsIcon size={18} />
              Settings
            </Link>
          </Menu.Item>
          <Menu.Item
            value="logout"
            className="cursor-pointer hover:bg-gray-700 transition-all"
            onClick={handleLogout}>
            <LogOutIcon size={18} />
            Logout
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
