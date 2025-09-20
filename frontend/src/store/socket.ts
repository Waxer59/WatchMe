import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  socket: WebSocket | null
  isSocketReady: boolean
}

interface Actions {
  setSocket(socket: WebSocket | null): void
  setIsSocketReady(isSocketReady: boolean): void
  clear(): void
}

const initialState: State = {
  socket: null,
  isSocketReady: false
}

export const useSocketStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setSocket: (socket: WebSocket | null) => set({ socket }),
    setIsSocketReady: (isSocketReady: boolean) => set({ isSocketReady }),
    clear: () => set(initialState)
  }))
)
