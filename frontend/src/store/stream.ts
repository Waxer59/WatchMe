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
  devtools((set) => ({
    ...initialState,
    setStreamMessages: (streamMessages: StreamMessage[]) =>
      set({ streamMessages }),
    addStreamMessage: (streamMessage: StreamMessage) =>
      set((state) => ({
        streamMessages: [...state.streamMessages, streamMessage]
      })),
    setStream: (newStream: StreamData | null) => set({ streamData: newStream }),
    setStreamerData: (streamerData: StreamerDetails | null) =>
      set({ streamerData }),
    setViewers: (viewers: number) => set({ viewers }),
    clearStreamMessages: () => set({ streamMessages: [] }),
    clear: () => set(initialState)
  }),{
    name: 'stream',
  })
)
