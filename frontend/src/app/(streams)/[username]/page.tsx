import { getPublicEnv } from '@/helpers/getPublicEnv'
import { getBlurredMuxThumbnail } from '@/helpers/server/getBlurredMuxThumbnail'
import { StreamData, StreamerDetails } from '@/types'
import { unstable_noStore as noStore } from 'next/cache'
import { FrownIcon } from 'lucide-react'
import { StreamerSection } from '@/components/streamer/streamer-section'

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
        next: { revalidate: 0 }
      }),
      fetch(`${getPublicEnv().BACKEND_URL}/streamer/${params.username}`, {
        next: { revalidate: 0 }
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
    <StreamerSection
      userData={userData}
      streamData={streamData}
      blurHashBase64={blurHashBase64}
    />
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
