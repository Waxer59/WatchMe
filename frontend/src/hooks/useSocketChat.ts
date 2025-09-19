import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useSocketStore } from '@/store/socket'
import { Environment } from '@/types'
import { useCallback } from 'react'

export const useSocketChat = () => {
  const setSocket = useSocketStore((state) => state.setSocket)

  const connectSocket = useCallback(() => {
    let reconnectTimeout: NodeJS.Timeout | null = null

    const socket = new WebSocket(
      `${getPublicEnv()
        .BACKEND_URL?.replace(
          'http',
          getPublicEnv().ENVIRONMENT === Environment.DEV ? 'ws' : 'wss'
        )
        .replace('/api', '')}/ws`
    )

    socket.onopen = () => {
      console.log('Socket has been opened')

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
        reconnectTimeout = null
      }
    }

    socket.onclose = () => {
      console.log('Socket has been closed')
      reconnectTimeout = setTimeout(connectSocket, 1000)
    }

    socket.onerror = () => {
      console.log('Socket has been closed')
      socket.close()
    }

    setSocket(socket)
  }, [setSocket])

  return {
    connectSocket
  }
}
