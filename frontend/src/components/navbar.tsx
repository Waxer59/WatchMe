import { Box, Button } from '@chakra-ui/react'
import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'
import NextLink from 'next/link'

export function Navbar() {
  return (
    <Box
      className="bg-gray-800 border-b border-gray-700"
      as="nav"
      display="flex"
      width="full"
      alignItems="center"
      justifyContent="space-between"
      padding="4">
      <Box as="div" display="flex" alignItems="center" gap="6">
        <NextLink href="/" className="text-2xl uppercase">
          <h2>
            <strong>WATCHME</strong>
          </h2>
        </NextLink>
        <NextLink href="/following" className="font-semibold text-sm">
          Following
        </NextLink>
        <NextLink href="/discover" className="font-semibold text-sm">
          Discover
        </NextLink>
      </Box>
      <SearchInput />
      <Box as="div" display="flex" alignItems="center" gap="2">
        <Button variant="subtle" colorPalette="gray" rounded="lg">Log in</Button>
        <UserAvatar />
      </Box>
    </Box>
  )
}
