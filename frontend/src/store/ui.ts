import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  searchInput: string
}

interface Actions {
setSearchInput(searchInput: string): void
  clear(): void
}

const initialState: State = {
  searchInput: ''
}

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setSearchInput: (searchInput: string) => set({ searchInput }),
    clear: () => set(initialState)
  }))
)