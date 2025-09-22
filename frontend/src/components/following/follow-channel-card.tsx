import { Avatar } from '@chakra-ui/react'
import FollowButton from '../streamer/follow-button'
import { StreamerDetails } from '@/types'
import Link from 'next/link'

interface Props {
  streamer: StreamerDetails
}

export const FollowChannelCard: React.FC<Props> = ({ streamer }) => {
  return (
    <li className="flex items-center gap-4 rounded-lg bg-gray-800 border border-gray-700 p-4">
      <Avatar.Root
        size="2xl"
        style={{ backgroundColor: streamer.presence_color }}>
        <Avatar.Fallback name={streamer.username} className="text-4xl" />
        <Avatar.Image src={streamer.avatar} />
      </Avatar.Root>
      <Link
        className="hover:underline cursor-pointer"
        href={`/${streamer.username}`}>
        <h3 className="text-lg font-semibold w-[10ch] max-w-[10ch] truncate">
          {streamer.username}
        </h3>
      </Link>
      <FollowButton streamer={streamer} />
    </li>
  )
}
