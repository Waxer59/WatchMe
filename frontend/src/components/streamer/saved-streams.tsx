import { StreamData } from '@/types'
import React from 'react'
import { HomeChannel } from '../home/home-channel'
import { VideoOffIcon } from 'lucide-react'
import { VideosLayout } from '@/layouts/videos-layout'
import { categoryCodeToCategory } from '@/helpers/categoryCodeToCategory'

interface Props {
  username: string
  avatar: string
  savedStreams: StreamData[]
}

export const SavedStreams: React.FC<Props> = ({ savedStreams, username, avatar }) => {
  return (
    <>
      {savedStreams.length > 0 ? (
        <VideosLayout>
          {savedStreams.map((savedStream) => (
            <li key={savedStream.id}>
              <HomeChannel
                href={`/${username}/${savedStream.playback_id}`}
                title={savedStream.title}
                thumbnail={`https://image.mux.com/${savedStream.playback_id}/thumbnail.webp`}
                thumbnail_gif={`https://image.mux.com/${savedStream.playback_id}/animated.webp`}
                username={username}
                avatar={avatar}
                category={categoryCodeToCategory(savedStream.category)}
                isLive={false}
              />
            </li>
          ))}
        </VideosLayout>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
          <VideoOffIcon className="w-12 h-12 text-gray-400" />
          <p>Looks like this user doesn&apos;t have any videos.</p>
        </div>
      )}
    </>
  )
}
