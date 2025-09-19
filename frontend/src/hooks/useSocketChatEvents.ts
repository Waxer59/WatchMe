import { useSocketStore } from "@/store/socket"
import { WebSocketSendEvent } from "@/types"

export const useSocketChatEvents = () => {
  const socket = useSocketStore((state) => state.socket)

  const sendJoinUserChannel = (username: string) => {
    socket?.send(JSON.stringify({
      event: WebSocketSendEvent.JOIN_USER_CHANNEL,
      data: username
    }))
  }

  const sendLeaveUserChannel = (username: string) => {
    socket?.send(JSON.stringify({
      event: WebSocketSendEvent.LEAVE_USER_CHANNEL,
      data: username
    }))
  }

  const sendMessage = (message: string) => {
    socket?.send(JSON.stringify({
      event: WebSocketSendEvent.SEND_MESSAGE,
      data: message
    }))
  }

  return {
    sendJoinUserChannel,
    sendLeaveUserChannel,
    sendMessage
  }
}