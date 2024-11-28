const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(dateString: string): string {
  return dateFormatter.format(new Date(dateString))
}

export function formatDateTime(dateString: string): string {
  return dateTimeFormatter.format(new Date(dateString))
}
