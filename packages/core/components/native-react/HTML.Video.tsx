import { VideoHTMLAttributes } from "react"

export const HTMLVideo = ({
  style,
  ...props
}: VideoHTMLAttributes<HTMLVideoElement>) => {
  return <video style={{ ...style }} {...props} />
}
