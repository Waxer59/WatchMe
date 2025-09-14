'use client'

import { getPublicEnv } from '@/helpers/getPublicEnv'
import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useState } from 'react'

interface Stream {
  title: string
  username: string
  avatar: string
  playback_id: string
}

export default function User({ params }: { params: { username: string } }) {
  const [streamData, setStreamData] = useState<null | Stream>(null)

  const fetchStreamData = async () => {
    const response = await fetch(
      `${getPublicEnv().BACKEND_URL}/streams/${params.username}`
    )
    const data = await response.json()
    setStreamData(data)
  }

  useEffect(() => {
    fetchStreamData()
  }, [])

  return (
    <div className="rounded-lg w-full overflow-hidden">
      {streamData && (
        <MuxPlayer
          playbackId={streamData.playback_id}
          accentColor="#1e2939"
          metadata={{
            videoTitle: 'Test VOD',
            ViewerUserId: 'user-id-007'
          }}
        />
      )}
    </div>
  )
}
