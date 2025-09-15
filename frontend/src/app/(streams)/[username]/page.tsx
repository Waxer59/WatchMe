import { NoStreaming } from '@/components/streamer/no-streaming'
import { Streaming } from '@/components/streamer/streaming'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { StreamData, StreamerDetails } from '@/types'
import { FrownIcon } from 'lucide-react'

export default async function User({
  params
}: {
  params: { username: string }
}) {
  let streamData: StreamData | null = null
  let userData: StreamerDetails | null = null

  try {
    const [streamDataResponse, userDataResponse] = await Promise.all([
      fetch(`${getPublicEnv().BACKEND_URL}/streams/${params.username}`),
      fetch(`${getPublicEnv().BACKEND_URL}/streamer/${params.username}`)
    ])

    if (streamDataResponse.status !== 404) {
      streamData = await streamDataResponse.json()
    }

    if (userDataResponse.status !== 404) {
      userData = await userDataResponse.json()
    }
  } catch (error) {
    console.log(error)
  }
  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
        <FrownIcon className="w-20 h-20 text-gray-400" />
        <p>Looks like this user doesn&apos;t exist</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg w-full overflow-y-auto scrollbar-hide">
      {streamData ? (
        <Streaming
          streamer={userData}
          playbackId={streamData.playback_id}
          savedStreams={[]}
          streamingChat={[]}
        />
      ) : (
        <NoStreaming streamer={userData} savedStreams={[]} />
      )}
    </div>
  )
}
