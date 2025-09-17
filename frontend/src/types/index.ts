export interface StreamKey {
  id: string
  key: string
}

export interface StreamFeedDetails {
  title: string
  category: string
  username: string
  avatar: string
  playback_id: string
}

export interface StreamerDetails {
  id: string
  username: string
  avatar: string
  presence_color: string
  followers: number
  is_streaming: boolean
  streams: StreamData[]
}

export interface StreamMessage {
  id: string
  username: string
  content: string
}

export interface StreamData {
  id: string
  title: string
  category: string
  playback_id: string
}

export enum StreamCategory {
  ART = 'art',
  GAMING = 'gaming',
  MUSIC = 'music',
  TECH = 'tech',
  JUST_CHATTING = 'just_chatting'
}

export const allCategories = [
  StreamCategory.ART,
  StreamCategory.GAMING,
  StreamCategory.MUSIC,
  StreamCategory.TECH,
  StreamCategory.JUST_CHATTING
]
