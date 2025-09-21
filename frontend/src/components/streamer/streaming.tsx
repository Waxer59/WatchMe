'use client'

import {
  Avatar,
  Editable,
  Field,
  IconButton,
  Input,
  Select
} from '@chakra-ui/react'
import {
  CheckIcon,
  EyeIcon,
  PencilLineIcon,
  SendIcon,
  XIcon
} from 'lucide-react'
import { StreamCategory, StreamerDetails } from '@/types'
import { Suspense, useEffect, useRef, useState } from 'react'
import { SavedStreams } from './saved-streams'
import FollowButton from './follow-button'
import MuxPlayer from '@mux/mux-player-react/lazy'
import Link from 'next/link'
import { useAccountStore } from '@/store/account'
import { getPublicEnv } from '@/helpers/getPublicEnv'
import { toaster } from '../ui/toaster'
import { categories } from '../settings/stream-settings'
import { categoryCodeToCategory } from '@/helpers/categoryCodeToCategory'
import { useStreamStore } from '@/store/stream'
import { useSocketEvents } from '@/hooks/useSocketEvents'
import { useUiStore } from '@/store/ui'

interface Props {
  title: string
  category: StreamCategory
  streamer: StreamerDetails
  playbackId: string
  blurHashBase64: string
  showChat?: boolean
  showViewers?: boolean
}

export const Streaming: React.FC<Props> = ({
  title,
  category,
  streamer,
  playbackId,
  blurHashBase64,
  showChat = true,
  showViewers = false
}) => {
  const viewers = useStreamStore((state) => state.viewers)
  const [newCategory, setNewCategory] = useState<StreamCategory>(category)
  const currentUserId = useAccountStore((state) => state.id)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [currentFollowers, setCurrentFollowers] = useState(
    streamer.followers ?? 0
  )
  const ownUsername = useAccountStore((state) => state.username)
  const streamMessages = useStreamStore((state) => state.streamMessages)
  const streamerData = useStreamStore((state) => state.streamerData)
  const isStreamOwner = streamer.id === currentUserId
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const setIsLoginModalOpen = useUiStore((state) => state.setIsLoginModalOpen)
  const addStreamMessage = useStreamStore((state) => state.addStreamMessage)
  const { sendSendMessage } = useSocketEvents()

  const handleEditStream = async ({
    title,
    category
  }: {
    title?: string
    category?: string
  }) => {
    try {
      await fetch(
        `${getPublicEnv().BACKEND_URL}/streams/edit-stream/${playbackId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            category
          })
        }
      )

      toaster.success({
        title: 'Success',
        description: 'Stream updated successfully'
      })
    } catch (error) {
      console.log(error)
      toaster.error({
        title: 'Error',
        description: 'Something went wrong while updating the stream'
      })
    }
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const message = formData.get('message') as string

    if (!message.trim()) {
      toaster.error({
        title: 'Error',
        description: 'Please enter a message'
      })
      return
    }

    sendSendMessage(message)
    addStreamMessage({
      id: crypto.randomUUID(),
      presence_color: streamer.presence_color,
      user_name: ownUsername,
      message: message
    })

    form.reset()
  }

  useEffect(() => {
    if (!messagesContainerRef.current) {
      return
    }
    const scrollHeight = messagesContainerRef.current.scrollHeight
    const height = messagesContainerRef.current.clientHeight
    const maxScrollTop = scrollHeight - height

    messagesContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }, [streamMessages])

  return (
    <div className="flex gap-4 h-full">
      <div
        className={`${showChat ? 'w-4/5' : 'w-full'} h-full overflow-y-auto scrollbar-hide`}>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8">
            <div
              className="player-wrapper rounded-lg overflow-hidden max-w-[1200px] max-h-[675px] mx-auto"
              ref={wrapperRef}>
              <Suspense fallback={<MuxPlayerPlaceholder />}>
                <MuxPlayer
                  playbackId={playbackId}
                  placeholder={blurHashBase64}
                  accentColor="#1e2939"
                  videoTitle={title}
                  autoPlay
                />
              </Suspense>
            </div>
            <div className="flex items-center justify-between max-w-[1200px] mx-auto w-full">
              <div className="flex flex-col gap-2">
                <Editable.Root
                  defaultValue={title}
                  className="text-4xl font-bold"
                  onValueCommit={(details) =>
                    handleEditStream({ title: details.value })
                  }
                  disabled={streamer.id !== currentUserId}>
                  <Editable.Preview
                    className={`hover:bg-gray-700 ${isStreamOwner ? '' : 'hover:bg-transparent cursor-auto'}`}
                  />
                  <Editable.Input />
                  <Editable.Control>
                    <Editable.EditTrigger
                      asChild
                      className={`hover:bg-gray-700 ${isStreamOwner ? '' : 'hidden'}`}>
                      <IconButton variant="ghost" size="xl">
                        <PencilLineIcon />
                      </IconButton>
                    </Editable.EditTrigger>
                    <Editable.CancelTrigger
                      asChild
                      className="hover:bg-gray-700">
                      <IconButton variant="outline" size="xl">
                        <XIcon />
                      </IconButton>
                    </Editable.CancelTrigger>
                    <Editable.SubmitTrigger
                      asChild
                      className="hover:bg-gray-700">
                      <IconButton variant="outline" size="xl">
                        <CheckIcon />
                      </IconButton>
                    </Editable.SubmitTrigger>
                  </Editable.Control>
                </Editable.Root>
                {isStreamOwner ? (
                  <Select.Root
                    collection={categories}
                    value={[newCategory]}
                    onValueChange={(details) => {
                      setNewCategory(details.value[0] as StreamCategory)
                      handleEditStream({ category: details.value[0] })
                    }}
                    size="lg"
                    width="320px">
                    <Select.HiddenSelect />
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
                        {categories.items.map((category) => (
                          <Select.Item
                            item={category}
                            key={category.value}
                            className="cursor-pointer">
                            {category.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-400">
                    {categoryCodeToCategory(category)}
                  </h3>
                )}
              </div>
              {showViewers && (
                <div className="flex items-center gap-4">
                  <EyeIcon className="text-gray-400 h-8 w-8" />
                  <span className="text-2xl text-gray-400">{viewers}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8 mb-20 w-full max-w-[1200px] mx-auto">
            <header className="flex items-center justify-between">
              <Link
                className="flex items-center gap-4"
                href={`/${streamer.username}`}
                scroll={false}>
                <Avatar.Root colorPalette="blue" className="w-24 h-24">
                  <Avatar.Fallback
                    name={streamer.username}
                    className="text-4xl"
                  />
                  <Avatar.Image src={streamer.avatar} />
                </Avatar.Root>
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold capitalize">
                    {streamer.username}
                  </h2>
                  <p className="text-gray-400">{currentFollowers} followers</p>
                </div>
              </Link>
              <FollowButton
                streamer={streamer}
                onFollow={() => setCurrentFollowers(currentFollowers + 1)}
                onUnfollow={() =>
                  setCurrentFollowers((prev) => (prev > 0 ? prev - 1 : prev))
                }
              />
            </header>
            <h3 className="text-xl font-bold">Recent Streams</h3>
            <SavedStreams
              userId={streamer.id}
              username={streamer.username}
              avatar={streamer.avatar}
              savedStreams={streamerData?.streams ?? []}
            />
          </div>
        </div>
      </div>
      {showChat && (
        <div className="w-[340px] h-[calc(100vh-125px)] border border-gray-700 rounded-lg bg-gray-800 flex flex-col gap-3 p-3 sticky top-0">
          <div className="overflow-auto h-full max-h-[calc(100vh-200px)]" ref={messagesContainerRef}>
            <ul className="flex flex-col gap-2">
              {streamMessages.map((message) => (
                <li className="flex items-center gap-2" key={message.id}>
                  <p className="max-w-[275px]">
                    <span
                      className="font-bold"
                      style={{ color: message.presence_color }}>
                      {message.user_name}
                      <span className="font-normal">: </span>
                    </span>
                    {message.message}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <form className="flex gap-2" onSubmit={handleSendMessage}>
            <Field.Root>
              <Input
                placeholder="Send a message"
                className="border-gray-700"
                name="message"
              />
            </Field.Root>
            <IconButton
              variant="subtle"
              colorPalette="blue"
              size="lg"
              type="submit">
              <SendIcon />
            </IconButton>
          </form>
        </div>
      )}
    </div>
  )
}

const MuxPlayerPlaceholder = () => <div className="player-placeholder"></div>
