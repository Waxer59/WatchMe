"use client"

import { SidebarButton } from "./siderbar-button"

interface Props {
  icon: React.ComponentType
  name: string
  count: string
}

export const SidebarCategory: React.FC<Props> = ({ icon, name, count }) => {
  const Icon = icon

  return (
    <SidebarButton icon={<Icon />}>
      <span className="flex items-center justify-between">
        {name}
        <span className="text-xs text-gray-400">{count}</span>
      </span>
    </SidebarButton>
  )
}