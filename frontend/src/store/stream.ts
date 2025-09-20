import { StreamMessage } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  streamMessages: StreamMessage[],
  viewers: number
}

interface Actions {
  setStreamMessages(streamMessages: StreamMessage[]): void
  addStreamMessage(streamMessage: StreamMessage): void
  setViewers(viewers: number): void
  clearStreamMessages(): void
  clear(): void
}

const initialState: State = {
  streamMessages: [],
  viewers: 0
}

export const useStreamStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setStreamMessages: (streamMessages: StreamMessage[]) => set({ streamMessages }),
    addStreamMessage: (streamMessage: StreamMessage) => set((state) => ({
      streamMessages: [...state.streamMessages, streamMessage]
    })),
    setViewers: (viewers: number) => set({ viewers }),
    clearStreamMessages: () => set({ streamMessages: [] }),
    clear: () => set(initialState)
  }))
)