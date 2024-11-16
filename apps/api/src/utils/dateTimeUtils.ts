import { format } from 'date-fns'

export const toDutchDate = (date: string | undefined) => {
  if (!date) {
    return ''
  }
  return new Date(date).toLocaleDateString('nl', { dateStyle: 'short' })
}

export const toDutchDateTime = (date: string | undefined) => {
  if (!date) {
    return ''
  }
  return new Date(date)
    .toLocaleDateString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '')
}

export const toDutchTime = (date: string | undefined) => {
  if (!date) {
    return ''
  }
  return format(new Date(date), 'HH:mm')
}
