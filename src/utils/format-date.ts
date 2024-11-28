// src/lib/utils.ts
import { format, isValid } from 'date-fns'

export const formatDate = (date: string | number | Date): string => {
  try {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) {
      console.warn(`Invalid date value: ${date}`)
      return 'Invalid date'
    }
    return format(dateObj, 'MMM d, yyyy')
  } catch (error) {
    console.error(`Error formatting date: ${error}`)
    return 'Invalid date'
  }
}

export const formatDateTime = (date: string | number | Date): string => {
  try {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) {
      console.warn(`Invalid date value: ${date}`)
      return 'Invalid date'
    }
    return format(dateObj, 'MMM d, yyyy HH:mm')
  } catch (error) {
    console.error(`Error formatting datetime: ${error}`)
    return 'Invalid date'
  }
}
