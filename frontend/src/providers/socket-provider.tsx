'use client'

import { useSocket } from '@/hooks/useSocket'
import { useSocketEvents } from '@/hooks/useSocketEvents'
import { useStreamStore } from '@/store/stream'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

let isConnectedToSocket = false

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const { connectSocket } = useSocket()
  const { sendJoinUserChannel } = useSocketEvents()

  useEffect(() => {
    function handleRecover() {
      const state = useStreamStore.getState()
      if (state.streamerData) {
        sendJoinUserChannel(state.streamerData!.id)
      }
    }

    if (!isConnectedToSocket) {
      connectSocket({ onRecover: handleRecover })
      isConnectedToSocket = true
    }
  }, [])

  return children
}
