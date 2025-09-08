import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  username: string
  avatar: string
  isLoggedIn: boolean
}

interface Actions {
  setUsername(username: string): void
  setAvatar(avatar: string): void
  setIsLoggedIn(isLoggedIn: boolean): void
  clear(): void
}

const initialState: State = {
  username: '',
  avatar: '',
  isLoggedIn: false
}

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setUsername: (username: string) => set({ username }),
    setAvatar: (avatar: string) => set({ avatar }),
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    clear: () => set(initialState)
  }))
)
