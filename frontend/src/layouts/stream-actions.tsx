import { Menu } from '@chakra-ui/react'
import { TrashIcon } from 'lucide-react'

interface Props {
  disabled?: boolean
  children: React.ReactNode
  playbackId: string
  handleDeleteStream: (playbackId: string) => void
}

export const StreamActions: React.FC<Props> = ({
  children,
  disabled,
  handleDeleteStream,
  playbackId
}) => {
  if (disabled) {
    return children
  }

  return (
    <Menu.Root>
      <Menu.ContextTrigger width="full">{children}</Menu.ContextTrigger>
      <Menu.Positioner>
        <Menu.Content className="bg-gray-800 border rounded-lg border-gray-700 p-2">
          <Menu.Item
            value="delete"
            className="cursor-pointer hover:bg-gray-700 transition-all text-red-500 rounded"
            onClick={() => handleDeleteStream(playbackId)}>
            <TrashIcon size={18} />
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
