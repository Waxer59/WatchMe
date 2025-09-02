import { Avatar, Button } from '@chakra-ui/react'

export function UserAvatar() {
  return (
    <Button variant="plain">
      <Avatar.Root className='bg-secondary!'>
        <Avatar.Fallback name="Waxer59" />
      </Avatar.Root>
    </Button>
  )
}
