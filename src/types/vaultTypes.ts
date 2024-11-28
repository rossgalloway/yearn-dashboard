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

export type TimeseriesDataPoint = {
  date: string
  rawApy: number
  movingAverageApy: number
  tvl: number
}

export type TimeseriesData = {
  chainId: number
  address: string
  label: string
  component: string
  period: string
  time: string
  value: number
}

export type TimePeriod = '7d' | '30d' | '90d' | '180d' | '1y' | 'all'
