import { useState } from 'react'
import { assetPath } from '../config/token.ts'

type ArtImageProps = {
  filename: string
  alt: string
  width: number
  height: number
  className?: string
  eager?: boolean
}

export function ArtImage({ filename, alt, width, height, className, eager = false }: ArtImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const src = assetPath(filename)
  const failed = failedSrc === src

  if (failed) {
    return (
      <span
        className={`art-missing ${className ?? ''}`}
        role="img"
        aria-label={alt || 'Artwork unavailable'}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        Artwork unavailable
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      onError={() => {
        console.error(`Missing image: ${src}`)
        setFailedSrc(src)
      }}
    />
  )
}
