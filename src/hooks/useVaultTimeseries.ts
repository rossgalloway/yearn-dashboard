// src/hooks/useVaultTimeseries.ts
import { useLazyQuery } from '@apollo/client'
import {
  GET_VAULT_TIMESERIES,
  queryAPY,
  queryTVL,
  queryPPS,
} from '@/graphql/queries/timeseries'
import type { Timeseries, TimeseriesDataPoint, Vault } from '@/types/vaultTypes'

export type TimeseriesParams = {
  chainId?: number
  address: string
  label: 'apy-bwd-delta-pps' | 'tvl' | 'pps' // Add more labels as needed
  component?: 'weeklyNet' | 'close' | 'humanized' // Add more components as needed
  limit?: number
}

export function useVaultTimeseries() {
  // console.log('fetching vault timeseries data with useVaultTimeseries hook')
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
  const [fetchPps, { data: ppsData, loading: ppsLoading, error: ppsError }] =
    useLazyQuery<{ timeseries: TimeseriesDataPoint[] }, TimeseriesParams>(
      queryPPS,
    )

  return {
    fetchApy,
    fetchTvl,
    fetchPps,
    apyData: apyData?.timeseries,
    tvlData: tvlData?.timeseries,
    ppsData: ppsData?.timeseries,
    loading: apyLoading || tvlLoading || ppsLoading,
    error: apyError || tvlError || ppsError,
  }
}
