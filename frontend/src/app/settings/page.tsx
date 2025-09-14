'use client'

import { ProfileSettings } from '@/components/settings/profile-settings'
import { StreamSettings } from '@/components/settings/stream-settings'
import { Box, Tabs } from '@chakra-ui/react'
import { ArrowLeftIcon, VideoIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
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
            <ProfileSettings />
          </Tabs.Content>
          <Tabs.Content
            value="stream"
            className="w-full bg-gray-800 border rounded-lg border-gray-700 p-6 max-w-xl mx-auto">
            <StreamSettings />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  )
}

export default Page
