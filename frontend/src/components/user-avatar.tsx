import { Avatar, Button } from '@chakra-ui/react'

export function UserAvatar() {
  return (
    <Button variant="plain">
      <Avatar.Root colorPalette="gray">
        <Avatar.Fallback name="Waxer59" />
      </Avatar.Root>
    </Button>
  )
}
