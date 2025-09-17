'use client'

import { FollowChannelCard } from '@/components/following/follow-channel-card'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useUiStore } from '@/store/ui'
import { StreamerDetails } from '@/types'
import { FrownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BounceLoader } from 'react-spinners'

const Page = ({ params }: { params: { username: string } }) => {
  const setSearchInput = useUiStore((state) => state.setSearchInput)
  const [streamersFound, setStreamersFound] = useState<StreamerDetails[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getStreamers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${getPublicEnv().BACKEND_URL}/streamer/search/${params.username}`
      )
      const data = await response.json()
      setStreamersFound(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getStreamers()
    setSearchInput(params.username)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <BounceLoader size={80} color={'#1e2939'} loading={true} />
      </div>
    )
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8">Channels</h2>
      {streamersFound.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border px-8 py-10 shadow-sm bg-gray-800 border-gray-700 overflow-hidden group">
          <FrownIcon className="w-20 h-20 text-gray-400" />
          <p>This user doesn&apos;t exist</p>
        </div>
      ) : (
        <ul className="flex gap-8 flex-wrap flex-col justify-center items-center lg:justify-normal lg:flex-row">
          {streamersFound.map((streamer) => (
            <FollowChannelCard key={streamer.id} streamer={streamer} />
          ))}
        </ul>
      )}
    </>
  )
}
export default Page
