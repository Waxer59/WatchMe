'use client'

import { useAccountStore } from '@/store/account'
import { Avatar, Button } from '@chakra-ui/react'

export const NoStreaming = () => {
  const avatar = useAccountStore((state) => state.avatar)
  const username = useAccountStore((state) => state.username)

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar.Root colorPalette="blue" size="full" className="w-32">
            <Avatar.Fallback name={username} />
            <Avatar.Image src={avatar} />
          </Avatar.Root>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold capitalize">{username}</h2>
            <p className="text-gray-400">100 followers</p>
          </div>
        </div>
        <Button variant="subtle" colorPalette="blue" rounded="lg" size="lg">
          Follow
        </Button>
      </header>
      <h3 className="text-xl font-bold mt-8">Recent Streams</h3>
    </div>
  )
}
