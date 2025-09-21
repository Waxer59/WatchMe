import { StreamData, StreamerDetails, StreamMessage } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  streamerData: StreamerDetails | null
  streamData: StreamData | null
  streamMessages: StreamMessage[]
  viewers: number
}

interface Actions {
  setStreamMessages(streamMessages: StreamMessage[]): void
  addStreamMessage(streamMessage: StreamMessage): void
  deleteStreamerStream(playbackId: string): void
  pushStreamerStream(stream: StreamData): void
  setViewers(viewers: number): void
  setStream(newStream: StreamData | null): void
  setStreamerData(streamerData: StreamerDetails | null): void
  clearStreamMessages(): void
  clear(): void
}

const initialState: State = {
  streamMessages: [],
  viewers: 0,
  streamData: null,
  streamerData: null
}

export const useStreamStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setStreamMessages: (streamMessages: StreamMessage[]) =>
        set({ streamMessages }),
      addStreamMessage: (streamMessage: StreamMessage) =>
        set((state) => ({
          streamMessages: [...state.streamMessages, streamMessage]
        })),
      setStream: (newStream: StreamData | null) =>
        set({ streamData: newStream }),
      deleteStreamerStream: (playbackId: string) =>
        set((state) => {
          if (!state.streamerData) {
            return { streamerData: null }
          }

          const newStreamerData = {...state.streamerData}
          if (newStreamerData) {
            newStreamerData.streams = newStreamerData?.streams?.filter(
              (stream) => stream.playback_id !== playbackId
            )
          }
          return { streamerData: newStreamerData }
        }),
        pushStreamerStream: (stream: StreamData) =>
          set((state) => {
            if (!state.streamerData) {
              return { streamerData: null }
            }

            const newStreamerData = {...state.streamerData}
            if (newStreamerData) {
              newStreamerData.streams = [...newStreamerData?.streams, stream].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by created_at DESC
            }

            return { streamerData: newStreamerData }
          }),
      setStreamerData: (streamerData: StreamerDetails | null) =>
        set({ streamerData }),
      setViewers: (viewers: number) => set({ viewers }),
      clearStreamMessages: () => set({ streamMessages: [] }),
      clear: () => set(initialState)
    }),
    {
      name: 'stream'
    }
  )
)
