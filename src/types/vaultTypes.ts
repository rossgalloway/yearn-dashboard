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
  meta: {
    displayName: string
    displaySymbol: string
    description: string
    protocols: string
    token: {
      category: string
      description: string
      displayName: string
      displaySymbol: string
      icon: string
      type: string
    }
  }
  strategies: string
  vaultType: string
}

export interface TimeseriesDataPoint {
  address?: string
  chainId?: number
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
