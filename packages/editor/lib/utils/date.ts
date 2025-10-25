/**
 * If the date is within the last 60 minutes, return the number of minutes ago.
 * If the date is within the last 24 hours, return the number of hours ago.
 * If the date is within the last 30 days, return the number of days ago.
 * If the date is more than 30 days ago, return the date in the format of "MMM d, yyyy".
 */
export function formatRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit", // other values: "lookup"
    numeric: "always", // other values: "auto"
    style: "long", // other values: "short" or "narrow"
  })

  const oneMinuteInMs = 1000 * 60
  const oneHourInMs = oneMinuteInMs * 60
  const oneDayInMs = oneHourInMs * 24
  const msPassed = new Date().getTime() - date.getTime()
  const daysAgo = msPassed / oneDayInMs
  const hoursAgo = msPassed / oneHourInMs
  const minutesAgo = msPassed / oneMinuteInMs

  if (minutesAgo < 5) {
    return "Just now"
  }

  if (minutesAgo < 60) {
    return rtf.format(Math.round(-minutesAgo), "minute")
  }
  if (hoursAgo < 24) {
    return rtf.format(Math.round(-hoursAgo), "hour")
  }
  if (daysAgo < 30) {
    return rtf.format(Math.round(-daysAgo), "day")
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
