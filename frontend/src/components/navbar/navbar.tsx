'use client'

import { Box, Button, Dialog, IconButton } from '@chakra-ui/react'
import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'
import { GithubIcon, SidebarIcon } from 'lucide-react'
import Link from 'next/link'
import { useAccountStore } from '@/store/account'
import { useUiStore } from '@/store/ui'
import { getPublicEnv } from '@/helpers/getPublicEnv'

export function Navbar() {
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const isLoginModalOpen = useUiStore((state) => state.isLoginModalOpen)
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const setIsSidebarOpen = useUiStore((state) => state.setIsSidebarOpen)
  const setIsLoginModalOpen = useUiStore((state) => state.setIsLoginModalOpen)

  const handleOpenSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <Box
      className="bg-gray-800 border-b border-gray-700 justify-between"
      as="nav"
      display="flex"
      width="full"
      alignItems="center"
      padding="4">
      <Box
        as="div"
        display="flex"
        alignItems="center"
        gap="12"
        className="hidden md:block">
        <Link href="/" className="text-2xl text-white uppercase">
          <h1>
            <strong>WATCHME</strong>
          </h1>
        </Link>
      </Box>
      <IconButton
        background="transparent"
        className="text-white md:hidden"
        onClick={handleOpenSidebar}>
        <SidebarIcon />
      </IconButton>
      <SearchInput />
      <Box as="div" display="flex" alignItems="center" gap="2">
        {isLoggedIn ? (
          <UserAvatar />
        ) : (
          <Dialog.Root
            placement="center"
            onOpenChange={(open) => setIsLoginModalOpen(open.open)}
            open={isLoginModalOpen}>
            <Dialog.Trigger asChild>
              <Button variant="subtle" colorPalette="gray" rounded="lg">
                Log in
              </Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="bg-gray-800 border rounded-lg border-gray-700">
                <Dialog.CloseTrigger />
                <Dialog.Header>
                  <Dialog.Title>Log in</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Button
                    variant="subtle"
                    colorPalette="gray"
                    size="lg"
                    rounded="lg"
                    className="w-full"
                    asChild>
                    <Link href={`${getPublicEnv().BACKEND_URL}/auth/github`}>
                      <GithubIcon />
                      Github
                    </Link>
                  </Button>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}
      </Box>
    </Box>
  )
}
