import { formatViewersCountShort } from '@/helpers/formatViewersCountShort'
import { Avatar } from '@chakra-ui/react'
import Link from 'next/link'

interface Props {
  thumbnail: string
  username: string
  avatar: string
  title: string
  topic: string
  count: number
}

export const HomeChannel: React.FC<Props> = ({
  username,
  thumbnail,
  avatar,
  topic,
  count,
  title
}) => {
  return (
    <Link
      href={`/${username}`}
      className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-gray-800 border-gray-700 overflow-hidden hover:border-white transition-colors cursor-pointer group">
      <div className="relative">
        <img
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          src={thumbnail}
        />
        <span
          data-slot="badge"
          className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-primary/90 absolute top-2 left-2 bg-red-600 hover:bg-red-600 text-white">
          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
          LIVE
        </span>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-eye w-3 h-3 mr-1">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          {formatViewersCountShort(count)}
        </div>
      </div>
      <div data-slot="card-content" className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar.Root colorPalette="blue">
            <Avatar.Fallback name={username} />
            <Avatar.Image src={avatar} />
          </Avatar.Root>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
              {title}
            </h3>
            <div className="flex flex-col gap-1">
              <p className="text-white text-sm font-medium">{username}</p>
              <p className="text-gray-400 text-sm">{topic}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
