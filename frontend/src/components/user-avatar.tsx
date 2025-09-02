import { Avatar, Button } from '@chakra-ui/react'

export function UserAvatar() {
  return (
    <Button variant="plain" padding="unset">
      <Avatar.Root>
        <Avatar.Fallback name="Waxer59" className='shadow-xl' />
      </Avatar.Root>
    </Button>
  )
}
