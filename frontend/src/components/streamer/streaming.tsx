'use client'

import { Avatar, Field, IconButton, Input } from '@chakra-ui/react'
import { SendIcon } from 'lucide-react'
import { StreamData, StreamerDetails, StreamMessage } from '@/types'
import { Suspense, useRef, useState } from 'react'
import { SavedStreams } from './saved-streams'
import FollowButton from './follow-button'
import MuxPlayer from '@mux/mux-player-react/lazy'

interface Props {
  streamer: StreamerDetails
  playbackId: string
  streamingChat: StreamMessage[]
  savedStreams: StreamData[]
  blurHashBase64: string
}

export const Streaming: React.FC<Props> = ({
  streamer,
  playbackId,
  savedStreams,
  streamingChat,
  blurHashBase64
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [currentFollowers, setCurrentFollowers] = useState(
    streamer.followers ?? 0
  )
  console.log(blurHashBase64)

  return (
    <div className="flex gap-4">
      <div className="w-4/5 h-full  overflow-y-auto">
        <div className="flex flex-col gap-12">
          <div className="player-wrapper rounded-lg overflow-hidden" ref={wrapperRef}>
            <Suspense fallback={<MuxPlayerPlaceholder />}>
              <MuxPlayer
                playbackId={playbackId}
                placeholder={blurHashBase64}
                accentColor="#1e2939"
                videoTitle="Test VOD"
              />
            </Suspense>
          </div>
          <div className="flex flex-col gap-8 mb-20">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              </div>
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
              username={streamer.username}
              avatar={streamer.avatar}
              savedStreams={savedStreams}
            />
          </div>
        </div>
      </div>
      <div className="w-[340px] h-[calc(100vh-125px)] border border-gray-700 rounded-lg bg-gray-800 flex flex-col gap-3 p-3 sticky top-0">
        <div className="overflow-auto h-full max-h-[calc(100vh-200px)]">
          <ul className="flex flex-col gap-2">
            {streamingChat.map((message) => (
              <li className="flex items-center gap-2" key={message.id}>
                <p className="max-w-[275px]">
                  <span className="text-white font-bold">
                    {message.username}
                    <span className="font-normal">: </span>
                  </span>
                  {message.content}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <form className="flex gap-2">
          <Field.Root>
            <Input placeholder="Send a message" className="border-gray-700" />
          </Field.Root>
          <IconButton variant="subtle" colorPalette="blue" size="lg">
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  )
}

const MuxPlayerPlaceholder = () => <div className="player-placeholder"></div>
