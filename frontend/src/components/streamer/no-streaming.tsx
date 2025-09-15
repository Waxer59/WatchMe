'use client'

import { Avatar } from '@chakra-ui/react'
import FollowButton from './follow-button'
import { useState } from 'react'
import { StreamData, StreamerDetails } from '@/types'
import { SavedStreams } from './saved-streams'

interface Props {
 streamer: StreamerDetails
 savedStreams: StreamData[]
}

export const NoStreaming: React.FC<Props> = ({
  streamer,
  savedStreams
}) => {
  const [currentFollowers, setCurrentFollowers] = useState(streamer.followers ?? 0)

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar.Root colorPalette="blue" size="full" className="w-32 h-32">
            <Avatar.Fallback name={streamer.username} className="text-4xl" />
            <Avatar.Image src={streamer.avatar} />
          </Avatar.Root>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold capitalize">{streamer.username}</h2>
            <p className="text-gray-400">{currentFollowers} followers</p>
          </div>
        </div>
        <FollowButton
          streamer={streamer}
          onFollow={() => setCurrentFollowers(currentFollowers + 1)}
          onUnfollow={() => setCurrentFollowers((prev) => prev > 0 ? prev - 1 : prev)}
        />
      </header>
      <h3 className="text-xl font-bold my-8">Recent Streams</h3>
      <SavedStreams
        username={streamer.username}
        avatar={streamer.avatar}
        savedStreams={savedStreams}
      />
    </div>
  )
}
