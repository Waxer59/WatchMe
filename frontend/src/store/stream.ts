import { StreamMessage } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  streamMessages: StreamMessage[]
}

interface Actions {
  setStreamMessages(streamMessages: StreamMessage[]): void
  addStreamMessage(streamMessage: StreamMessage): void
  clearStreamMessages(): void
  clear(): void
}

const initialState: State = {
  streamMessages: []
}

export const useStreamStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setStreamMessages: (streamMessages: StreamMessage[]) => set({ streamMessages }),
    addStreamMessage: (streamMessage: StreamMessage) => set((state) => ({
      streamMessages: [...state.streamMessages, streamMessage]
    })),
    clearStreamMessages: () => set({ streamMessages: [] }),
    clear: () => set(initialState)
  }))
)