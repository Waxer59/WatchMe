import { StreamCategory, StreamerDetails, StreamKey } from '@/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  id: string | null
  username: string
  avatar: string
  default_stream_title: string
  default_stream_category: StreamCategory
  isLoggedIn: boolean
  presence_color: string
  isLoading: boolean
  stream_keys: StreamKey[]
  following: StreamerDetails[]
}

interface Actions {
  setUsername(username: string): void
  setAvatar(avatar: string): void
  setIsLoggedIn(isLoggedIn: boolean): void
  setStreamKeys(streamKeys: StreamKey[]): void
  addStreamKey(id: string, key: string): void
  removeStreamKey(id: string): void
  setDefaultStreamTitle(defaultStreamTitle: string): void
  setDefaultStreamCategory(defaultStreamCategory: StreamCategory): void
  setIsLoading(isLoading: boolean): void
  setId(id: string): void
  setFollowing(following: StreamerDetails[]): void
  addFollowing(following: StreamerDetails): void
  setPresenceColor(presenceColor: string): void
  removeFollowing(id: string): void
  clear(): void
}

const initialState: State = {
  id: null,
  username: '',
  avatar: '',
  presence_color: '#fff',
  default_stream_title: 'Untitled',
  default_stream_category: StreamCategory.JUST_CHATTING,
  isLoggedIn: false,
  isLoading: true,
  stream_keys: [],
  following: []
}

export const useAccountStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setUsername: (username: string) => set({ username }),
    setAvatar: (avatar: string) => set({ avatar }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setStreamKeys: (streamKeys: StreamKey[]) => set({ stream_keys: streamKeys }),
    addStreamKey: (id: string, key: string) => set((state) => ({
      stream_keys: [...state.stream_keys, { id, key }]
    })),
    setId: (id: string) => set({ id }),
    removeStreamKey: (id: string) => set((state) => ({
      stream_keys: state.stream_keys.filter((key) => key.id !== id)
    })),
    setFollowing: (following: StreamerDetails[]) => set({ following }),
    addFollowing: (following: StreamerDetails) => set((state) => ({
      following: [...state.following, following]
    })),
    setPresenceColor: (presence_color: string) => set({ presence_color }),
    removeFollowing: (id: string) => set((state) => ({
      following: state.following.filter((following) => following.id !== id)
    })),
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    setDefaultStreamTitle: (defaultStreamTitle: string) => set({ default_stream_title: defaultStreamTitle }),
    setDefaultStreamCategory: (defaultStreamCategory: StreamCategory) => set({ default_stream_category: defaultStreamCategory }),
    clear: () => set(initialState)
  }))
)
