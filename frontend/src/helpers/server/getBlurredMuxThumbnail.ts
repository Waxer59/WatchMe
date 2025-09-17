import sharp from 'sharp'

export const getBlurredMuxThumbnail = async (playbackId: string) => {
  const url = `https://image.mux.com/${playbackId}/thumbnail.png`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error fetching thumbnail: ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const image = sharp(buffer)

  const outputBuffer = await image
    .ensureAlpha()
    .resize(320, 320, { fit: 'inside' })
    .blur(3)
    .jpeg({ quality: 80 })
    .toBuffer()

  return `data:image/jpeg;base64,${outputBuffer.toString('base64')}`
}
