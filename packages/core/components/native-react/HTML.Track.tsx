import { TrackHTMLAttributes } from "react"

export const HTMLTrack = ({
  ...props
}: TrackHTMLAttributes<HTMLTrackElement>) => {
  return <track {...props} />
}
