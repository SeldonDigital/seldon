import { formatRelativeTime } from "@lib/utils/date"

export const RelativeTime = ({ date }: { date: Date }) => {
  return <>{formatRelativeTime(date)}</>
}
