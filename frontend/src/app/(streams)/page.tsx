import { HomeChannel } from '@/components/home/home-channel'
import { categoryCodeToCategory } from '@/helpers/categoryCodeToCategory';
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { VideosLayout } from '@/layouts/videos-layout';
import { StreamFeedDetails } from '@/types';
import { VideoOffIcon } from 'lucide-react'
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
  noStore();
  const streams = await fetch(`${getPublicEnv().BACKEND_URL}/streams/feed`)

  const data = await streams.json()

  return (
    <>
      <header className="flex flex-col gap-2 mb-8">
        <h2 className="text-3xl font-bold">Live Channels</h2>
        <p className="text-gray-400">
          Discover amazing live content from creators around the world
        </p>
      </header>
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
                category={categoryCodeToCategory(stream.category)}
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
