// src/hooks/useVaultTimeseries.ts
import { useLazyQuery } from '@apollo/client'
import { GET_VAULT_TIMESERIES } from '@/graphql/queries/timeseries'
import type { TimeseriesData } from '@/types/vaultTypes'

export type TimeseriesParams = {
  chainId: number
  address: string
  label: 'apy-bwd-delta-pps' | 'tvl' // Add more labels as needed
  component: 'weeklyNet' | 'close' // Add more components as needed
  limit?: number
}

export function useVaultTimeseries() {
  const [fetchTimeseries, { data, loading, error }] = useLazyQuery<
    { timeseries: TimeseriesData[] },
    TimeseriesParams
  >(GET_VAULT_TIMESERIES)

  return {
    fetchTimeseries,
    timeseriesData: data?.timeseries || [],
    loading,
    error,
  }
}
