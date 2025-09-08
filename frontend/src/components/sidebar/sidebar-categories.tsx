"use client"

import { Gamepad2Icon, MusicIcon, PaletteIcon, ZapIcon, PodcastIcon } from "lucide-react"
import { SidebarCategory } from "./sidebar-category"

export const SidebarCategories = () => {
  return (
    <div className="space-y-2">
      <SidebarCategory icon={Gamepad2Icon} name="Gaming" count="24k" />
      <SidebarCategory icon={MusicIcon} name="Music" count="24k" />
      <SidebarCategory icon={PaletteIcon} name="Art" count="24k" />
      <SidebarCategory icon={ZapIcon} name="Tech" count="24k" />
      <SidebarCategory icon={PodcastIcon} name="Just Chatting" count="24k" />
    </div>
  )
}