'use client'

import { FollowChannelCard } from '@/components/following/follow-channel-card'
import { useAccountStore } from '@/store/account'

const Page = () => {
  const following = useAccountStore((state) => state.following)

  return (
    <>
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Following</h1>
        <p className="text-gray-400">This are the users you are following</p>
      </header>
      <ul className="flex gap-8 flex-wrap flex-col justify-center items-center lg:justify-normal lg:flex-row">
        {following.map((following) => (
          <FollowChannelCard key={following.id} streamer={following} />
        ))}
      </ul>
    </>
  )
}
export default Page
