'use client'

import {
  Gamepad2Icon,
  MusicIcon,
  PaletteIcon,
  ZapIcon,
  PodcastIcon
} from 'lucide-react'
import { SidebarCategory } from './sidebar-category'
import { StreamCategory } from '@/types'

export const SidebarCategories = () => {
  return (
    <div className="space-y-2">
      <SidebarCategory
        icon={Gamepad2Icon}
        name="Gaming"
        code={StreamCategory.GAMING}
        count="24k"
      />
      <SidebarCategory
        icon={MusicIcon}
        name="Music"
        count="24k"
        code={StreamCategory.MUSIC}
      />
      <SidebarCategory
        icon={PaletteIcon}
        name="Art"
        count="24k"
        code={StreamCategory.ART}
      />
      <SidebarCategory
        icon={ZapIcon}
        name="Tech"
        count="24k"
        code={StreamCategory.TECH}
      />
      <SidebarCategory
        icon={PodcastIcon}
        name="Just Chatting"
        count="24k"
        code={StreamCategory.JUST_CHATTING}
      />
    </div>
  )
}
