import { Box } from '@chakra-ui/react'
import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'
import { AlertsButton } from './alerts-button'
import NextLink from 'next/link'

export function Navbar() {
  return (
    <Box
      as="nav"
      display="flex"
      width="full"
      alignItems="center"
      justifyContent="space-between"
      padding="4">
      <Box as="div" display="flex" alignItems="center" gap="6">
        <NextLink href="/" className="text-lg">
          <h2>
            WATCH<strong>ME</strong>
          </h2>
        </NextLink>
        <NextLink href="/following" className="font-semibold text-lg">
          Following
        </NextLink>
        <NextLink href="/discover" className="font-semibold text-lg">
          Discover
        </NextLink>
      </Box>
      <SearchInput />
      <Box as="div" display="flex" alignItems="center" gap="2">
        <AlertsButton />
        <UserAvatar />
      </Box>
    </Box>
  )
}
