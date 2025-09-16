'use client'

import { useUiStore } from '@/store/ui'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SearchInput() {
  const [searchInput, setSearchInput] = useState<string>('')
  const searchInputStore = useUiStore((state) => state.searchInput)
  const router = useRouter()

  useEffect(() => {
    setSearchInput(searchInputStore)
  }, [searchInputStore])
  

  return (
    <div className="relative hidden sm:block">
      <SearchIcon className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            router.push(`/search/${searchInput}`)
          }
        }}
        value={searchInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchInput(e.target.value)
        }}
        className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 w-64 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white ml-auto"
        placeholder="Search..."
      />
    </div>
  )
}
