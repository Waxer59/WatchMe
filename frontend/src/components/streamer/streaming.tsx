import MuxPlayer from '@mux/mux-player-react'

interface Props {
  playbackId: string
}

export const Streaming: React.FC<Props> = ({ playbackId }) => {
  return (
    <MuxPlayer
      playbackId={playbackId}
      accentColor="#1e2939"
      metadata={{
        videoTitle: 'Test VOD',
        ViewerUserId: 'user-id-007'
      }}
    />
  )
}
