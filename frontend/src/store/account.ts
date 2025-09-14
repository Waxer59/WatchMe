import { StreamKey } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  username: string
  avatar: string
  isLoggedIn: boolean
  stream_keys: StreamKey[]
}

interface Actions {
  setUsername(username: string): void
  setAvatar(avatar: string): void
  setIsLoggedIn(isLoggedIn: boolean): void
  setStreamKeys(streamKeys: StreamKey[]): void
  addStreamKey(id: string, key: string): void
  removeStreamKey(id: string): void
  clear(): void
}

const initialState: State = {
  username: '',
  avatar: '',
  isLoggedIn: false,
  stream_keys: []
}

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setUsername: (username: string) => set({ username }),
    setAvatar: (avatar: string) => set({ avatar }),
    setStreamKeys: (streamKeys: StreamKey[]) => set({ stream_keys: streamKeys }),
    addStreamKey: (id: string, key: string) => set((state) => ({
      stream_keys: [...state.stream_keys, { id, key }]
    })),
    removeStreamKey: (id: string) => set((state) => ({
      stream_keys: state.stream_keys.filter((key) => key.id !== id)
    })),
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    clear: () => set(initialState)
  }))
)
