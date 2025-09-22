'use client'

import Link from 'next/link'
import { SidebarButton } from './siderbar-button'
import { StreamCategory } from '@/types'
import { categoryCodeToCategory } from '@/helpers/categoryCodeToCategory'
import { formatViewersCountShort } from '@/helpers/formatViewersCountShort'

interface Props {
  icon: React.ComponentType
  code: StreamCategory
  count: number
}

export const SidebarCategory: React.FC<Props> = ({ icon, count, code }) => {
  const Icon = icon

  return (
    <SidebarButton
      icon={<Icon />}
      as={Link}
      href={`/category/${code}`}
      count={count}>
      <span className="flex items-center justify-between">
        {categoryCodeToCategory(code)}
        <span className="text-xs text-gray-400">
          {formatViewersCountShort(count)}
        </span>
      </span>
    </SidebarButton>
  )
}
