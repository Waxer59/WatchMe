import { useSocketStore } from '@/store/socket'
import { WebSocketSendEvent } from '@/types'
import { useEffect, useRef } from 'react'

export const useSocketEvents = () => {
  const socket = useSocketStore((state) => state.socket)
  const isSocketReady = useSocketStore((state) => state.isSocketReady)
  const queue = useRef<string[]>([])

  useEffect(() => {
    if (socket && isSocketReady) {
      queue.current.forEach((msg) => socket.send(msg))
      queue.current = []
    }
  }, [isSocketReady, socket])

  const sendJoinUserChannel = (username: string) => {
    const msg = JSON.stringify({
      event: WebSocketSendEvent.JOIN_USER_CHANNEL,
      data: username
    })
    if (socket?.readyState !== socket?.OPEN || !socket) {
      queue.current.push(msg)
      return
    }

    socket?.send(msg)
  }

  const sendSendMessage = (message: string) => {
    const msg = JSON.stringify({
      event: WebSocketSendEvent.SEND_MESSAGE,
      data: message
    })

    if (socket?.readyState !== socket?.OPEN || !socket) {
      queue.current.push(msg)
      return
    }

    socket?.send(msg)
  }

  const sendLeaveUserChannel = () => {
    const msg = JSON.stringify({
      event: WebSocketSendEvent.LEAVE_USER_CHANNEL
    })

    if (socket?.readyState !== socket?.OPEN || !socket) {
      queue.current.push(msg)
      return
    }

    socket?.send(msg)
  }

  const sendMessage = (message: string) => {
    const msg = JSON.stringify({
      event: WebSocketSendEvent.SEND_MESSAGE,
      data: message
    })

    if (socket?.readyState !== socket?.OPEN || !socket) {
      queue.current.push(msg)
      return
    }

    socket?.send(msg)
  }

  return {
    sendJoinUserChannel,
    sendLeaveUserChannel,
    sendMessage,
    sendSendMessage
  }
}
