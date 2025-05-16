export function timeAgo(date: Date, timezone: string = "UTC"): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })

  const formattedTime = formatter.format(date)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) {
    return `${seconds}s ago (${formattedTime})`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago (${formattedTime})`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago (${formattedTime})`
  }

  const days = Math.floor(hours / 24)
  return `${days}d ago (${formattedTime})`
}
