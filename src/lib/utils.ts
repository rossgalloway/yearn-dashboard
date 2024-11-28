// src/lib/utils.ts
import { format, fromUnixTime } from 'date-fns'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this new function
export const formatUnixTimestamp = (timestamp: number | string): string => {
  try {
    const date = fromUnixTime(Number(timestamp))
    return format(date, 'MMM d, yyyy')
  } catch (error) {
    console.error(`Error formatting unix timestamp: ${error}`)
    return 'Invalid date'
  }
}
