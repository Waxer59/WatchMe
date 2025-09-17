import { HomeChannel } from '@/components/home/home-channel'
import { categoryCodeToCategory } from '@/helpers/categoryCodeToCategory'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { VideosLayout } from '@/layouts/videos-layout'
import { allCategories, StreamCategory, StreamFeedDetails } from '@/types'
import { VideoOffIcon } from 'lucide-react'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

const Page = async ({ params }: { params: { categoryCode: string } }) => {
  if (!allCategories.includes(params.categoryCode as StreamCategory)) {
    return redirect('/')
  }

  noStore()
  const streams = await fetch(`${getPublicEnv().BACKEND_URL}/streams/feed`, {
    next: { revalidate: 0 }
  })

  const data = await streams.json()

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        {categoryCodeToCategory(params.categoryCode)}
      </h1>
      {data.length > 0 ? (
        <VideosLayout>
          {data.map((stream: StreamFeedDetails) => (
            <li key={stream.username}>
              <HomeChannel
                title={stream.title}
                thumbnail={`https://image.mux.com/${stream.playback_id}/thumbnail.webp`}
                thumbnail_gif={`https://image.mux.com/${stream.playback_id}/animated.webp`}
                username={stream.username}
                avatar={stream.avatar}
                category={stream.category}
                isLive
                count={0}
              />
            </li>
          ))}
        </VideosLayout>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
          <VideoOffIcon className="w-12 h-12 text-gray-400" />
          <p>Looks like no-one is streaming right now</p>
        </div>
      )}
    </>
  )
}
export default Page
