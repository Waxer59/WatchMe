'use client'

import { StreamerDetails, StreamData, StreamCategory } from '@/types'
import { NoStreaming } from './no-streaming'
import { Streaming } from './streaming'
import { useSocketEvents } from '@/hooks/useSocketEvents'
import { useStreamStore } from '@/store/stream'
import { useEffect, useRef } from 'react'

interface Props {
  userData: StreamerDetails
  streamData: StreamData | null
  blurHashBase64: string | null
}

export const StreamerSection: React.FC<Props> = ({
  userData,
  streamData: streamDataProp,
  blurHashBase64
}) => {
  const streamData = useStreamStore((state) => state.streamData)
  const hasJoined = useRef(false)
  const setStreamerData = useStreamStore((state) => state.setStreamerData)
  const setViewers = useStreamStore((state) => state.setViewers)
  const setStreamData = useStreamStore((state) => state.setStream)
  const clearStreamStore = useStreamStore((state) => state.clear)
  const { sendJoinUserChannel } = useSocketEvents()

  useEffect(() => {
    if (hasJoined.current) {
      return
    }

    setStreamData(streamDataProp)
    setStreamerData(userData)
    if (streamDataProp) {
      sendJoinUserChannel(streamDataProp!.id)
      setViewers((streamDataProp?.viewers ?? 0) + 1)
    } else {
      sendJoinUserChannel(userData.id)
    }

    hasJoined.current = true

    return () => {
      clearStreamStore()
    }
  }, [])

  return (
    <div className="rounded-lg w-full overflow-y-auto scrollbar-hide">
      {streamData ? (
        <Streaming
          title={streamData!.title}
          category={streamData!.category as StreamCategory}
          streamer={userData}
          playbackId={streamData!.playback_id}
          blurHashBase64={blurHashBase64!}
          savedStreams={userData.streams}
          streamingChat={[]}
          showViewers
        />
      ) : (
        <NoStreaming streamer={userData} savedStreams={userData.streams} />
      )}
    </div>
  )
}
