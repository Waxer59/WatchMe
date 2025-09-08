"use client"

interface SidebarButtonProps {
  children: React.ReactNode
  as?: 'button' | 'a'
  className?: string
  isActive?: boolean
  icon: React.ReactNode
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  children,
  as = 'button',
  className = '',
  icon,
  isActive,
  ...props
}) => {
  const CustomAs = as

  return (
    <CustomAs
      className={`transition-colors hover:bg-gray-700 px-4 py-2 rounded-md h-9 flex items-center cursor-pointer text-sm text-gray-300 w-full ${className} [&_svg:not([class*='size-'])]:size-4 text-white ${isActive ? 'bg-gray-700' : ''} ${className}`}
      {...props}>
      {icon ? (
        <span className="flex items-center gap-4 w-full">
          {icon}
          <span className="flex-1 text-left">{children}</span>
        </span>
      ) : (
        children
      )}
    </CustomAs>
  )
}
