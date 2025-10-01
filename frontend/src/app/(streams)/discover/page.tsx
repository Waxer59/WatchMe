import { HomeChannel } from '@/components/home/home-channel'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { VideosLayout } from '@/layouts/videos-layout'
import { StreamFeedDetails } from '@/types'
import { VideoOffIcon } from 'lucide-react'
import { unstable_noStore as noStore } from 'next/cache'

const Page = async () => {
  noStore()

  let streamsData: StreamFeedDetails[] = []

  try {
    const streams = await fetch(`${getPublicEnv().BACKEND_URL}/streams/feed`, {
      next: { revalidate: 0 }
    })

    const data = await streams.json()
    streamsData = data
  } catch (error) {
    console.log(error)
  }

  return (
    <>
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white">Discover</h1>
        <p className="text-gray-400">Discover new streamers</p>
      </header>
      {streamsData.length > 0 ? (
        <VideosLayout>
          {streamsData.map((stream: StreamFeedDetails) => (
            <li key={stream.username}>
              <HomeChannel
                title={stream.title}
                thumbnail={`https://image.mux.com/${stream.playback_id}/thumbnail.webp`}
                thumbnail_gif={`https://image.mux.com/${stream.playback_id}/animated.webp`}
                username={stream.username}
                viewers={stream.viewers}
                avatar={stream.avatar}
                presence_color={stream.presence_color}
                category={stream.category}
                isLive
              />
            </li>
          ))}
        </VideosLayout>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
          <VideoOffIcon className="w-12 h-12 text-gray-400" />
          <p className="text-white">Looks like no-one is streaming right now</p>
        </div>
      )}
    </>
  )
}
export default Page
