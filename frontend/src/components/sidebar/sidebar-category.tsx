'use client'

import Link from 'next/link'
import { SidebarButton } from './siderbar-button'
import { StreamCategory } from '@/types'

interface Props {
  icon: React.ComponentType
  name: string
  code: StreamCategory
  count: string
}

export const SidebarCategory: React.FC<Props> = ({
  icon,
  name,
  count,
  code
}) => {
  const Icon = icon

  return (
    <SidebarButton icon={<Icon />} as={Link} href={`/category/${code}`}>
      <span className="flex items-center justify-between">
        {name}
        <span className="text-xs text-gray-400">{count}</span>
      </span>
    </SidebarButton>
  )
}
