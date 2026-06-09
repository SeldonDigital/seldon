import { CSSProperties } from "react"

interface ImagePreviewProps {
  src: string
  alt?: string
  onError?: () => void
}

const wrapperStyle: CSSProperties = { position: "absolute", inset: "1rem" }
const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
}

/** Contained image preview that reports load failures through `onError`. */
export function ImagePreview({
  src,
  alt = "Preview",
  onError,
}: ImagePreviewProps) {
  return (
    <div style={wrapperStyle}>
      <img src={src} alt={alt} style={imageStyle} onError={onError} />
    </div>
  )
}
