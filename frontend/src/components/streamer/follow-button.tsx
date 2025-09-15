'use client'

import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useAccountStore } from '@/store/account'
import { StreamerDetails } from '@/types'
import { Button } from '@chakra-ui/react'

interface Props {
  streamer: StreamerDetails
  onFollow?: () => void
  onUnfollow?: () => void
}

const FollowButton: React.FC<Props> = ({ streamer, onFollow, onUnfollow }) => {
  const userId = useAccountStore((state) => state.id)
  const isFollowing = useAccountStore((state) =>
    state.following.find((following) => following.id === streamer.id)
  )
  const addFollowing = useAccountStore((state) => state.addFollowing)
  const removeFollowing = useAccountStore((state) => state.removeFollowing)

  if (streamer.id === userId) {
    return <></>
  }

  const handleFollow = async () => {
    try {
      await fetch(
        getPublicEnv().BACKEND_URL + '/users/follow/' + streamer.username,
        {
          method: 'POST',
          credentials: 'include'
        }
      )
    } catch (error) {
      console.log(error)
    }
    addFollowing(streamer)
    onFollow?.()
  }

  const handleUnfollow = async () => {
    try {
      await fetch(
        getPublicEnv().BACKEND_URL + '/users/unfollow/' + streamer.username,
        {
          method: 'POST',
          credentials: 'include'
        }
      )
    } catch (error) {
      console.log(error)
    }
    removeFollowing(streamer.id)
    onUnfollow?.()
  }

  return (
    <Button
      variant="subtle"
      colorPalette="blue"
      rounded="lg"
      size="lg"
      onClick={isFollowing ? handleUnfollow : handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
export default FollowButton
