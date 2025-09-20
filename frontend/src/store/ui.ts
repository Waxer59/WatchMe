import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  searchInput: string
  isLoginModalOpen: boolean
}

interface Actions {
  setSearchInput(searchInput: string): void
  setIsLoginModalOpen(isLoginModalOpen: boolean): void
  clear(): void
}

const initialState: State = {
  searchInput: '',
  isLoginModalOpen: false
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setSearchInput: (searchInput: string) => set({ searchInput }),
    setIsLoginModalOpen: (isLoginModalOpen: boolean) =>
      set({ isLoginModalOpen }),
    clear: () => set(initialState)
  }), {
    name: 'ui',
  })
)
