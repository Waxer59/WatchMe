import { useAccountStore } from '@/store/account'
import {
  Field,
  Input,
  Dialog,
  Button,
  IconButton,
  ColorPicker,
  parseColor,
  HStack
} from '@chakra-ui/react'
import {
  CircleHelpIcon,
  CopyIcon,
  KeyIcon,
  PlusIcon,
  TrashIcon
} from 'lucide-react'
import { PasswordInput } from '../ui/password-input'
import { useEffect, useState } from 'react'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { toaster } from '../ui/toaster'
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/constants'
import rgbHex from 'rgb-hex'

export const ProfileSettings = () => {
  const [isGeneratingNewKey, setIsGeneratingNewKey] = useState<boolean>(false)
  const presenceColor = useAccountStore((state) => state.presence_color)
  const [newColorHex, setNewColorHex] = useState<string>(presenceColor)
  const username = useAccountStore((state) => state.username)
  const avatar = useAccountStore((state) => state.avatar)
  const stream_keys = useAccountStore((state) => state.stream_keys)
  const setAvatar = useAccountStore((state) => state.setAvatar)
  const setUsername = useAccountStore((state) => state.setUsername)
  const addStreamKey = useAccountStore((state) => state.addStreamKey)
  const removeStreamKey = useAccountStore((state) => state.removeStreamKey)
  const setPresenceColor = useAccountStore((state) => state.setPresenceColor)

  console.log(stream_keys)
  useEffect(() => {
    setNewColorHex(presenceColor)
  }, [presenceColor])

  const handleSaveProfileSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    const formData = new FormData(e.target as HTMLFormElement)

    const newUsername = formData.get('username') as string
    const newAvatar = formData.get('avatar') as string

    if (newUsername === username) {
      toaster.error({
        title: 'Error',
        description: 'Your username cannot be the same as your current username'
      })
    }

    if (
      (newUsername.length < MIN_USERNAME_LENGTH ||
        newUsername.length > MAX_USERNAME_LENGTH) &&
      newUsername !== ''
    ) {
      toaster.error({
        title: 'Error',
        description: 'Username must be between 3 and 20 characters'
      })
      return
    }

    try {
      const response = await fetch(`${getPublicEnv().BACKEND_URL}/users`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUsername || undefined,
          avatar: newAvatar || undefined,
          presence_color: newColorHex ? newColorHex : undefined
        })
      })

      if (response.status === 200) {
        target.reset()
        toaster.success({
          title: 'Success',
          description: 'Profile updated successfully'
        })

        if (newUsername) {
          setUsername(newUsername)
        }

        if (newAvatar) {
          setAvatar(newAvatar)
        }

        if (newColorHex) {
          setPresenceColor(newColorHex)
        }
      } else {
        toaster.error({
          title: 'Error',
          description: 'Something went wrong while updating the username'
        })
      }
    } catch (error) {
      console.log(error)
      toaster.error({
        title: 'Error',
        description: 'Something went wrong while updating the username'
      })
      target.reset()
    }
  }

  const handleDeleteStreamKey = async (id: string) => {
    try {
      await fetch(`${getPublicEnv().BACKEND_URL}/streams/delete-key/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      removeStreamKey(id)
      toaster.success({
        title: 'Success',
        description: 'Stream key deleted!'
      })
    } catch (error) {
      console.log(error)
      toaster.error({
        title: 'Error',
        description: 'Something went wrong while deleting the stream key'
      })
    }
  }

  const handleGenerateStreamKey = async () => {
    setIsGeneratingNewKey(true)
    try {
      const response = await fetch(
        `${getPublicEnv().BACKEND_URL}/streams/generate-key`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      addStreamKey(data.id, data.streamKey)
      toaster.success({
        title: 'Success',
        description: 'New stream key generated!'
      })
    } catch (error) {
      console.log(error)
      toaster.error({
        title: 'Error',
        description: 'Something went wrong while generating a new stream key'
      })
    } finally {
      setIsGeneratingNewKey(false)
    }
  }

  return (
    <>
      <h3 className="text-xl font-bold">Profile</h3>
      <p className="text-gray-400">
        Manage your profile information and preferences
      </p>
      <form
        className="flex flex-col gap-4 mt-6"
        onSubmit={handleSaveProfileSettings}>
        <div className="flex items-end gap-4">
          <ColorPicker.Root
            maxW="200px"
            value={parseColor(newColorHex)}
            onValueChange={(color) =>
              setNewColorHex(`#${rgbHex(color.valueAsString)}`)
            }>
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
              <ColorPicker.Trigger className="border-gray-700" />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
              <ColorPicker.Content className="bg-gray-800 border rounded-lg border-gray-700">
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="xs" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </ColorPicker.Root>
          <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input
              name="username"
              placeholder={username}
              className="border-gray-700"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Avatar</Field.Label>
            <Input
              name="avatar"
              placeholder={avatar}
              className="border-gray-700"
            />
          </Field.Root>
        </div>
        <button
          className="bg-gray-700 rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-600 text-base cursor-pointer transition-colors active:bg-gray-800"
          type="submit">
          Save
        </button>
      </form>
      <Dialog.Root placement="center">
        <Dialog.Trigger asChild>
          <Button variant="subtle" colorPalette="gray" width="full" mt={4}>
            <KeyIcon />
            Manage Stream Keys
          </Button>
        </Dialog.Trigger>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className="bg-gray-800 border rounded-lg border-gray-700">
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Stream Keys</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <ul className="mb-6 gap-4 flex flex-col max-h-64 overflow-y-auto">
                {stream_keys?.map(({ id, key }) => (
                  <li className="flex items-center gap-4" key={id}>
                    <PasswordInput
                      className="border-gray-700 outline-none"
                      readOnly
                      value={key}
                    />
                    <div className="flex items-center gap-2">
                      <IconButton
                        onClick={() => {
                          toaster.info({
                            title: 'Copied to clipboard',
                            description: 'Stream key copied to clipboard'
                          })
                          navigator.clipboard.writeText(key)
                        }}
                        aria-label="Copy token"
                        variant="surface"
                        colorPalette="blue">
                        <CopyIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteStreamKey(id)}
                        aria-label="Delete token"
                        colorPalette="red"
                        variant="subtle">
                        <TrashIcon />
                      </IconButton>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                variant="subtle"
                colorPalette="white"
                width="full"
                loading={isGeneratingNewKey}
                onClick={handleGenerateStreamKey}>
                <PlusIcon />
                Generate New Key
              </Button>
              <Dialog.Root placement="top">
                <Dialog.Trigger asChild>
                  <Button
                    variant="surface"
                    colorPalette="green"
                    width="full"
                    mt={4}>
                    <CircleHelpIcon />
                    How do I use stream keys?
                  </Button>
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content className="bg-gray-800 border rounded-lg border-gray-700">
                    <Dialog.CloseTrigger />
                    <Dialog.Header>
                      <Dialog.Title>How to use stream keys</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <p>
                        To configure and start streaming, open OBS and go to{' '}
                        <strong>Settings</strong> {'>'}{' '}
                        <strong>Broadcast</strong> {'>'} <strong>Mux</strong>.
                        (If you don’t see this option, click{' '}
                        <strong>Show All</strong> to expand the drop-down menu
                        with additional services.) Once there, enter your stream
                        key — and you’re ready to go!
                      </p>
                    </Dialog.Body>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Dialog.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  )
}
