'use client'

import {
  Gamepad2Icon,
  MusicIcon,
  PaletteIcon,
  ZapIcon,
  PodcastIcon
} from 'lucide-react'
import { SidebarCategory } from './sidebar-category'
import { StreamCategoriesViewers, StreamCategory } from '@/types'

interface Props {
  categories: StreamCategoriesViewers[]
}

const STREAM_CATEGORIES_ICONS: {
  [key in StreamCategory]: React.ComponentType
} = {
  gaming: Gamepad2Icon,
  music: MusicIcon,
  art: PaletteIcon,
  tech: ZapIcon,
  just_chatting: PodcastIcon
}

export const SidebarCategories = ({ categories = [] }: Props) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <SidebarCategory
          key={category.category}
          icon={STREAM_CATEGORIES_ICONS[category.category as StreamCategory]}
          count={+category.viewers}
          code={category.category as StreamCategory}
        />
      ))}
    </div>
  )
}
