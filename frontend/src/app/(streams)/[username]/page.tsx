import { NoStreaming } from '@/components/streamer/no-streaming'
import { Streaming } from '@/components/streamer/streaming'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { getBlurredMuxThumbnail } from '@/helpers/server/getBlurredMuxThumbnail'
import { StreamCategory, StreamData, StreamerDetails } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'
import { FrownIcon } from 'lucide-react'

export default async function User({
  params
}: {
  params: { username: string }
}) {
  noStore()
  let streamData: StreamData | null = null
  let userData: StreamerDetails | null = null
  let blurHashBase64: string | null = null

  try {
    const [streamDataResponse, userDataResponse] = await Promise.all([
      fetch(`${getPublicEnv().BACKEND_URL}/streams/${params.username}`, {
        next: { revalidate: 60 }
      }),
      fetch(`${getPublicEnv().BACKEND_URL}/streamer/${params.username}`, {
        next: { revalidate: 60 }
      })
    ])

    if (streamDataResponse.status !== 404) {
      streamData = await streamDataResponse.json()
      blurHashBase64 = await getBlurredMuxThumbnail(streamData!.playback_id)
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
          title={streamData!.title}
          category={streamData!.category as StreamCategory}
          streamer={userData}
          playbackId={streamData!.playback_id}
          blurHashBase64={blurHashBase64!}
          savedStreams={userData.streams}
          streamingChat={[]}
        />
      ) : (
        <NoStreaming streamer={userData} savedStreams={userData.streams} />
      )}
    </div>
  )
}

export async function generateMetadata({
  params
}: {
  params: { username: string }
}) {
  return {
    title: `Watchme - ${params.username}`
  }
}
