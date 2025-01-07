// src/lib/utils.ts
import { format, fromUnixTime } from 'date-fns'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TimeseriesDataPoint } from '../types/vaultTypes'

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

// Helper function for SMA calculation
export const calculateSMA = (
  data: number[],
  windowSize: number = 15,
): (number | null)[] => {
  const sma: (number | null)[] = []

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1)
    const windowData = data.slice(start, i + 1)
    const average =
      windowData.reduce((sum, value) => sum + value, 0) / windowData.length
    sma.push(average)
  }
  return sma
}

/**
 * Gets the earliest and latest timestamps from three arrays of timeseries data points.
 *
 * @param apy - Array of timeseries data points for APY.
 * @param tvl - Array of timeseries data points for TVL.
 * @param pps - Array of timeseries data points for PPS.
 * @returns An object containing the earliest and latest timestamps.
 */
export function getEarliestAndLatestTimestamps(
  apy: TimeseriesDataPoint[],
  tvl: TimeseriesDataPoint[],
  pps: TimeseriesDataPoint[],
) {
  // Convert string times to numbers for ease of comparison
  const apyTimes = apy.map((d) => Number(d.time))
  const tvlTimes = tvl.map((d) => Number(d.time))
  const ppsTimes = pps.map((d) => Number(d.time))

  const earliest = Math.min(...apyTimes, ...tvlTimes, ...ppsTimes)
  const latest = Math.max(...apyTimes, ...tvlTimes, ...ppsTimes)
  return { earliest, latest }
}

// Helper to fill missing daily data
/**
 * Fills in missing daily data points in a time series.
 *
 * @param data - An array of `TimeseriesDataPoint` objects representing the existing data points.
 * @param earliest - The earliest timestamp (in Unix time) to start filling data from.
 * @param latest - The latest timestamp (in Unix time) to fill data up to.
 * @returns An array of `TimeseriesDataPoint` objects with missing days filled in.
 *
 * Each missing day will be filled with a `TimeseriesDataPoint` object containing:
 * - `time`: The timestamp of the missing day.
 * - `value`: `null` to indicate missing data.
 * - `label`: The label from the first data point in the input array, or an empty string if the input array is empty.
 * - `component`: The component from the first data point in the input array, or an empty string if the input array is empty.
 * - `period`: The period from the first data point in the input array, or '1 day' if the input array is empty.
 */
export function fillMissingDailyData(
  data: TimeseriesDataPoint[],
  earliest: number,
  latest: number,
): TimeseriesDataPoint[] {
  // Index existing data by day (converted from Unix so day boundaries match)
  const dailyMap: Record<string, TimeseriesDataPoint> = {}
  data.forEach((point) => {
    dailyMap[point.time] = point
  })

  const filled: TimeseriesDataPoint[] = []
  // Step through each day from earliest to latest
  for (let t = earliest; t <= latest; t += 86400) {
    const tStr = String(t)
    // If data is missing, fill in with null or 0
    if (!dailyMap[tStr]) {
      filled.push({
        time: tStr,
        value: null,
        label: data[0]?.label || '',
        component: data[0]?.component || '',
        period: data[0]?.period || '1 day',
      })
    } else {
      filled.push(dailyMap[tStr])
    }
  }
  return filled
}
