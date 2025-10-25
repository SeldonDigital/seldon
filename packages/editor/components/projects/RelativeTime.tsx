import { formatRelativeTime } from "@lib/utils/date"

export const RelativeTime = ({ date }: { date: string }) => {
  return <>{formatRelativeTime(new Date(date))}</>
}
