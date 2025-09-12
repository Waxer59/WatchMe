'use client'

import { useAccountStore } from '@/store/account'
import {
  Box,
  Button,
  createListCollection,
  Dialog,
  Field,
  Input,
  Select,
  Tabs
} from '@chakra-ui/react'
import {
  ArrowLeftIcon,
  VideoIcon,
  UserIcon,
  KeyIcon,
  PlusIcon
} from 'lucide-react'
import Link from 'next/link'

const categories = createListCollection({
  items: [
    { label: 'Gaming', value: 'gaming' },
    { label: 'Music', value: 'music' },
    { label: 'Art', value: 'art' },
    {
      label: 'Tech',
      value: 'tech'
    },
    { label: 'Just Chatting', value: 'just_chatting' }
  ]
})

const Page = () => {
  const username = useAccountStore((state) => state.username)

  const handleSaveStreamSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleSaveProfileSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <Box
        className="bg-gray-800 border-b border-gray-700"
        as="nav"
        display="flex"
        width="full"
        alignItems="center"
        justifyContent="space-between"
        padding="4">
        <Box as="div" display="flex" alignItems="center" gap="12">
          <Link href="/" className="text-sm flex items-center gap-2 px-2.5">
            <ArrowLeftIcon size={18} />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </Box>
      </Box>
      <div className="px-6 py-8 w-full">
        <Tabs.Root
          defaultValue="profile"
          variant="enclosed"
          className="flex flex-col gap-6">
          <Tabs.List className="bg-gray-700 mx-auto">
            <Tabs.Trigger
              value="profile"
              className="data-[selected]:bg-gray-800 data-[selected]:border-gray-700">
              <UserIcon />
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger
              value="stream"
              className="data-[selected]:bg-gray-800 data-[selected]:border-gray-700">
              <VideoIcon />
              Stream
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="profile"
            className="w-full bg-gray-800 border rounded-lg border-gray-700 p-6 max-w-xl mx-auto">
            <h3 className="text-xl font-bold">Profile</h3>
            <p className="text-gray-400">
              Manage your profile information and preferences
            </p>
            <form
              className="flex flex-col gap-4 mt-6"
              onSubmit={handleSaveProfileSettings}>
              <div className="flex items-center gap-4">
                <Field.Root>
                  <Field.Label>Username</Field.Label>
                  <Input placeholder={username} className="border-gray-700" />
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
                <Button
                  variant="subtle"
                  colorPalette="gray"
                  width="full"
                  mt={4}>
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
                    <Button variant="subtle" colorPalette="white" width="full">
                      <PlusIcon />
                      Generate New Key
                    </Button>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Dialog.Root>
          </Tabs.Content>
          <Tabs.Content
            value="stream"
            className="w-full bg-gray-800 border rounded-lg border-gray-700 p-6 max-w-xl mx-auto">
            <h3 className="text-xl font-bold">Stream</h3>
            <p className="text-gray-400">Manage your streaming preferences</p>
            <form
              className="flex flex-col gap-4 mt-6"
              onSubmit={handleSaveStreamSettings}>
              <div className="flex items-center gap-4">
                <Field.Root>
                  <Field.Label>Stream title</Field.Label>
                  <Input
                    placeholder="Making some good stuff"
                    className="border-gray-700"
                  />
                </Field.Root>
                <Select.Root collection={categories} size="sm" width="320px">
                  <Select.HiddenSelect />
                  <Select.Label>Select category</Select.Label>
                  <Select.Control>
                    <Select.Trigger className="border-gray-700 rounded-lg border flex items-center gap-2">
                      <Select.ValueText placeholder="Select category" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content
                      className={
                        'bg-gray-800 rounded-lg border border-gray-700 p-2'
                      }>
                      {categories.items.map((framework) => (
                        <Select.Item
                          item={framework}
                          key={framework.value}
                          className="cursor-pointer">
                          {framework.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </div>
              <button
                className="bg-gray-700 rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-600 text-base cursor-pointer transition-colors active:bg-gray-800"
                type="submit">
                Save
              </button>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  )
}

export default Page
