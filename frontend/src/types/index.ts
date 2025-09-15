export interface StreamKey {
  id: string
  key: string
}

export interface StreamerDetails {
  id: string
  username: string
  avatar: string
  followers: number
  is_streaming: boolean
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
