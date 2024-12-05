// src/hooks/useVaultTimeseries.ts
import { useLazyQuery } from '@apollo/client'
import {
  GET_VAULT_TIMESERIES,
  queryAPY,
  queryTVL,
} from '@/graphql/queries/timeseries'
import type { Timeseries, TimeseriesDataPoint, Vault } from '@/types/vaultTypes'

export type TimeseriesParams = {
  chainId: number
  address: string
  label: 'apy-bwd-delta-pps' | 'tvl' // Add more labels as needed
  component?: 'weeklyNet' | 'close' // Add more components as needed
  limit?: number
}

export function useVaultTimeseries() {
  // Fetch APY data
  const [fetchApy, { data: apyData, loading: apyLoading, error: apyError }] =
    useLazyQuery<{ timeseries: TimeseriesDataPoint[] }, TimeseriesParams>(
      queryAPY,
    )

  // Fetch TVL data
  const [fetchTvl, { data: tvlData, loading: tvlLoading, error: tvlError }] =
    useLazyQuery<{ timeseries: TimeseriesDataPoint[] }, TimeseriesParams>(
      queryTVL,
    )

  return {
    fetchApy,
    fetchTvl,
    apyData: apyData?.timeseries,
    tvlData: tvlData?.timeseries,
    loading: apyLoading || tvlLoading,
    error: apyError || tvlError,
  }
}
