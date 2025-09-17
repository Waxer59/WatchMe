import { Streaming } from '@/components/streamer/streaming'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { getBlurredMuxThumbnail } from '@/helpers/server/getBlurredMuxThumbnail'
import { StreamerDetails } from '@/types'
import { FrownIcon } from 'lucide-react'

const Page = async ({
  params
}: {
  params: { username: string; playbackId: string }
}) => {
  let userData: StreamerDetails | null = null
  let blurHashBase64: string | null = null

  try {
    const [userDataResponse, base64] = await Promise.all([
      fetch(`${getPublicEnv().BACKEND_URL}/streamer/${params.username}`),
      getBlurredMuxThumbnail(params.playbackId)
    ])

    if (userDataResponse.status !== 404) {
      userData = await userDataResponse.json()
    }
    blurHashBase64 = base64
  } catch (error) {
    console.log(error)
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
        <FrownIcon className="w-20 h-20 text-gray-400" />
        <p>Looks like this stream doesn&apos;t exist</p>
      </div>
    )
  }

  return (
    <Streaming
      title={userData.streams.find(stream=>stream.playback_id === params.playbackId)?.title ?? "Untitled"}
      streamer={userData}
      playbackId={params.playbackId}
      blurHashBase64={blurHashBase64!}
      savedStreams={userData.streams.filter(stream=>stream.playback_id !== params.playbackId)}
      streamingChat={[]}
      showChat={false}
    />
  )
}
export default Page
