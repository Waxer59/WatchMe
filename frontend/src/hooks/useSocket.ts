import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useSocketStore } from '@/store/socket'
import { useStreamStore } from '@/store/stream'
import { Environment, WebSocketReceiveEvent } from '@/types'
import { useCallback } from 'react'

export const useSocket = () => {
  const setSocket = useSocketStore((state) => state.setSocket)
  const setIsSocketReady = useSocketStore((state) => state.setIsSocketReady)
  const setViewers = useStreamStore((state) => state.setViewers)

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
      setIsSocketReady(true)
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

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.event) {
        case WebSocketReceiveEvent.STREAM_VIEWERS_COUNT:
          setViewers(message.data.viewers)
          break
      }
    }

    setSocket(socket)
  }, [setSocket])

  return {
    connectSocket
  }
}
