import { Avatar, Circle, Float } from '@chakra-ui/react'
import { EyeIcon } from 'lucide-react'

interface SidebarChannelProps {
  as?: 'button' | 'a'
  isLive?: boolean
  username: string
  avatar: string
  topic?: string
  count?: number
}

export const SidebarChannel: React.FC<SidebarChannelProps> = ({
  as = 'button',
  username,
  avatar,
  isLive,
  topic,
  count
}) => {
  const CustomAs = as

  return (
    <CustomAs className="w-full p-2 flex items-center gap-4 rounded-md hover:bg-gray-700 transition-all cursor-pointer">
      <Avatar.Root colorPalette="blue">
        <Avatar.Fallback name={username} />
        <Avatar.Image src={avatar} />
        {isLive && (
          <Float placement="bottom-end" offsetX="1.5" offsetY="1.5">
            <Circle
              bg="red.500"
              size="9px"
              outline="0.125em solid"
              outlineColor="gray.800"
            />
          </Float>
        )}
      </Avatar.Root>
      {isLive ? (
        <div className="flex items-center justify-between flex-1">
          <div className="flex flex-col gap-1 text-left">
            <p className="text-sm text-white truncate">{username}</p>
            <p className="text-xs text-gray-400 truncate">{topic}</p>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="text-gray-400 h-4 w-4" />
            <span className="text-xs text-gray-400">{count}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-white truncate">{username}</p>
      )}
    </CustomAs>
  )
}
