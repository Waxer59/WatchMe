import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  socket: WebSocket | null
}

interface Actions {
  setSocket(socket: WebSocket | null): void
  clear(): void
}

const initialState: State = {
  socket: null
}

export const useSocketStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setSocket: (socket: WebSocket | null) => set({ socket }),
    clear: () => set(initialState)
  }))
)
