export type ChainId = number

export type Vault = {
  yearn: boolean
  v3: boolean
  name: string
  chainId: ChainId
  address: string
  asset: {
    name: string
    symbol: string
  }
  apiVersion: string
  tvl: {
    blockTime: string
    close: number
    component: string
    label: string
  }
  pricePerShare: number
}

export interface TimeseriesDataPoint {
  label: string
  component?: string // Optional, as it's not present in TVL data points
  period: string
  time: string
  value: number
}

export interface Timeseries {
  address: string
  chainId: number
  apy: TimeseriesDataPoint[]
  tvl: TimeseriesDataPoint[]
}

export type TimePeriod = '7d' | '30d' | '90d' | '180d' | '1y' | 'all'
