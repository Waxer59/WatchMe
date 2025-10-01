import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  searchInput: string
  isLoginModalOpen: boolean
  isSidebarOpen: boolean
}

interface Actions {
  setSearchInput(searchInput: string): void
  setIsLoginModalOpen(isLoginModalOpen: boolean): void
  setIsSidebarOpen(isSidebarOpen: boolean): void
  clear(): void
}

const initialState: State = {
  searchInput: '',
  isLoginModalOpen: false,
  isSidebarOpen: false
}

export const useUiStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setSearchInput: (searchInput: string) => set({ searchInput }),
      setIsLoginModalOpen: (isLoginModalOpen: boolean) =>
        set({ isLoginModalOpen }),
      setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
      clear: () => set(initialState)
    }),
    {
      name: 'ui'
    }
  )
)
