import { getPublicEnv } from '@/helpers/getPublicEnv'
import { useSocketStore } from '@/store/socket'
import { useStreamStore } from '@/store/stream'
import { Environment, WebSocketReceiveEvent } from '@/types'
import { useCallback, useRef } from 'react'

interface Config {
  onRecover?: () => void
}

export const useSocket = () => {
  const setSocket = useSocketStore((state) => state.setSocket)
  const setIsSocketReady = useSocketStore((state) => state.setIsSocketReady)
  const setViewers = useStreamStore((state) => state.setViewers)
  const setStreamData = useStreamStore((state) => state.setStream)
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const isConnecting = useRef<boolean>(false)

  const connectSocket = useCallback(
    (config: Config) => {
      const { onRecover = () => {} } = config ?? {}

      if (isConnecting.current) {
        return
      }

      isConnecting.current = true

      const socket = new WebSocket(
        `${getPublicEnv()
          .BACKEND_URL?.replace(
            'http',
            getPublicEnv().ENVIRONMENT === Environment.DEV ? 'ws' : 'wss'
          )
          .replace('/api', '')}/ws`
      )

      socket.onopen = () => {
        if (socket.readyState === WebSocket.OPEN) {
          setIsSocketReady(true)
        }

        if (reconnectTimeout.current) {
          onRecover?.()
          clearTimeout(reconnectTimeout.current)
          reconnectTimeout.current = null
        }
        isConnecting.current = false
      }

      socket.onclose = () => {
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current)
        }

        reconnectTimeout.current = setTimeout(() => connectSocket(config), 1000)
        setIsSocketReady(false)
        isConnecting.current = false
      }

      socket.onerror = () => {
        socket.close()
        setIsSocketReady(false)
        isConnecting.current = false
      }

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        switch (message.event) {
          case WebSocketReceiveEvent.STREAM_VIEWERS_COUNT:
            setViewers(message.data.viewers)
            break
          case WebSocketReceiveEvent.STREAM_ON:
            setStreamData(message.data.stream)
            break
          case WebSocketReceiveEvent.STREAM_OFF:
            setStreamData(null)
            break
        }
      }

      setSocket(socket)
    },
    [setSocket]
  )

  return {
    connectSocket
  }
}
