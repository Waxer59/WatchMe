'use client'

import MuxPlayer from '@mux/mux-player-react'

export default function User() {
  return (
    <div className="rounded-lg w-full overflow-hidden">
      <MuxPlayer
        playbackId="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
        accentColor="#1e2939"
        metadata={{
          videoTitle: 'Test VOD',
          ViewerUserId: 'user-id-007'
        }}
      />
    </div>
  )
}
