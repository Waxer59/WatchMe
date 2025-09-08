'use client'

import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useAccountStore } from '@/store/account'
import { Avatar, Button, Menu } from '@chakra-ui/react'
import { LogOutIcon, SettingsIcon } from 'lucide-react'

export function UserAvatar() {
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
        <Button variant="plain">
          <Avatar.Root colorPalette="gray">
            <Avatar.Fallback name="Waxer59" />
          </Avatar.Root>
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className="rounded-md! bg-gray-800! border-gray-700! border">
          <Menu.Item
            value="logout"
            className="cursor-pointer! hover:bg-gray-700! transition-all!">
            <SettingsIcon size={18} />
            Settings
          </Menu.Item>
          <Menu.Item
            value="logout"
            className="cursor-pointer! hover:bg-gray-700! transition-all!"
            onClick={handleLogout}>
            <LogOutIcon size={18} />
            Logout
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
