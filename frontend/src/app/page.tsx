import { HomeChannel } from '@/components/home/home-channel'

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-3xl font-bold">Live Channels</h2>
        <p className="text-gray-400">
          Discover amazing live content from creators around the world
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <HomeChannel
          title="Primer directo de SCHEDULE 1 (Haciendo MEDICINAS y DINERO)"
          thumbnail="https://static-cdn.jtvnw.net/previews-ttv/live_user_dakrox7-440x248.jpg"
          username="Hgo"
          avatar=""
          topic="Art"
          count={0}
        />
      </div>
    </>
  )
}
