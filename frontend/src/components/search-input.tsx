import { Input } from '@chakra-ui/react'

export function SearchInput() {
  return (
    <Input
      width="80"
      size="sm"
      placeholder="Search"
      variant="filled"
      css={{ background: 'var(--foreground)' }}
      _hover={{ background: 'var(--foreground)' }}
    />
  )
}
