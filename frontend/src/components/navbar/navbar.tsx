'use client'

import { Box, Button, Dialog } from '@chakra-ui/react'
import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'
import { GithubIcon } from 'lucide-react'
import Link from 'next/link'
import { useAccountStore } from '@/store/account'
import { useUiStore } from '@/store/ui'

export function Navbar() {
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const setIsLoginModalOpen = useUiStore((state) => state.setIsLoginModalOpen)
  const isLoginModalOpen = useUiStore((state) => state.isLoginModalOpen)

  return (
    <Box
      className="bg-gray-800 border-b border-gray-700"
      as="nav"
      display="flex"
      width="full"
      alignItems="center"
      justifyContent="space-between"
      padding="4">
      <Box as="div" display="flex" alignItems="center" gap="12">
        <Link href="/" className="text-2xl uppercase">
          <h1>
            <strong>WATCHME</strong>
          </h1>
        </Link>
      </Box>
      <SearchInput />
      <Box as="div" display="flex" alignItems="center" gap="2">
        {isLoggedIn ? (
          <UserAvatar />
        ) : (
          <Dialog.Root placement="center" onOpenChange={(open) => setIsLoginModalOpen(open.open)} open={isLoginModalOpen}>
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
                    <Link href="http://localhost:3001/api/auth/github">
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
