'use client'

import { StreamData } from '@/types'
import React from 'react'
import { HomeChannel } from '../home/home-channel'
import { VideoOffIcon } from 'lucide-react'
import { VideosLayout } from '@/layouts/videos-layout'
import { categoryCodeToCategory } from '@/helpers/categoryCodeToCategory'
import { useAccountStore } from '@/store/account'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { toaster } from '../ui/toaster'
import { StreamActions } from '@/layouts/stream-actions'
import { useStreamStore } from '@/store/stream'

interface Props {
  userId: string
  username: string
  presence_color: string
  avatar: string
  savedStreams: StreamData[]
  onDeleteStream?: (playbackId: string) => void
}

export const SavedStreams: React.FC<Props> = ({
  userId,
  savedStreams,
  username,
  presence_color,
  avatar,
  onDeleteStream
}) => {
  const currentUserId = useAccountStore((state) => state.id)
  const isOwnChannel = currentUserId === userId
  const pushStreamerStream = useStreamStore((state) => state.pushStreamerStream)
  const deleteStreamerStream = useStreamStore(
    (state) => state.deleteStreamerStream
  )

  const handleDeleteStream = async (playbackId: string) => {
    const savedStream = savedStreams.find(
      (savedStream) => savedStream.playback_id === playbackId
    )

    if (!savedStream) {
      return
    }

    deleteStreamerStream(playbackId)
    onDeleteStream?.(playbackId)

    try {
      await fetch(
        `${getPublicEnv().BACKEND_URL}/streams/delete-stream/${playbackId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )

      toaster.success({
        title: 'Success',
        description: 'Stream deleted successfully'
      })
    } catch (error) {
      pushStreamerStream(savedStream)
      console.log(error)
      toaster.error({
        title: 'Error',
        description: 'Something went wrong while deleting the stream'
      })
    }
  }

  return (
    <>
      {savedStreams.length > 0 ? (
        <VideosLayout>
          {savedStreams.map((savedStream) => (
            <li key={savedStream.id}>
              <StreamActions
                handleDeleteStream={handleDeleteStream}
                playbackId={savedStream.playback_id}
                disabled={!isOwnChannel}>
                <HomeChannel
                  href={`/${username}/${savedStream.playback_id}`}
                  title={savedStream.title}
                  presence_color={presence_color}
                  thumbnail={`https://image.mux.com/${savedStream.playback_id}/thumbnail.webp`}
                  thumbnail_gif={`https://image.mux.com/${savedStream.playback_id}/animated.webp`}
                  username={username}
                  avatar={avatar}
                  category={categoryCodeToCategory(savedStream.category)}
                  isLive={false}
                />
              </StreamActions>
            </li>
          ))}
        </VideosLayout>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
          <VideoOffIcon className="w-12 h-12 text-gray-400" />
          <p className="text-white">
            Looks like this user doesn&apos;t have any videos.
          </p>
        </div>
      )}
    </>
  )
}
