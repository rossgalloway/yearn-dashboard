'use client'

import { useState, useEffect } from 'react'
import type { Vault, TimeseriesDataPoint } from '@/types/vaultTypes'
import { VaultSelector } from '@/components/yearn-dashboard/VaultSelector'
import { MetricsCard } from '@/components/yearn-dashboard/MetricsCard'
import { APYChart } from '@/components/yearn-dashboard/APYChart'
import { TimeframeTabs } from '@/components/yearn-dashboard/TimeframeTabs'
import { TVLChart } from '@/components/yearn-dashboard/TVLChart'
import { useVaults } from '@/hooks/useVaults'
import { useVaultTimeseries } from '@/hooks/useVaultTimeseries'
import { InfoIcon, TrendingUp, DollarSign } from 'lucide-react'
import { formatUnixTimestamp } from '../lib/utils'
import { TabsContent } from './ui/tabs'

const timeframes = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '180d', label: '180 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
]

export default function YearnDashboard() {
  const { vaults, loading: loadingVaults, error: errorVaults } = useVaults()
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const [timeframe, setTimeframe] = useState('30d')
  const [loadingOverlay, setLoadingOverlay] = useState(false)

  const {
    fetchTimeseries,
    timeseriesData,
    loading: loadingTimeseries,
    error: errorTimeseries,
  } = useVaultTimeseries()
  console.log('timeseriesData: ', timeseriesData)

  useEffect(() => {
    if (!selectedVault && vaults && vaults.length > 0) {
      setSelectedVault(vaults[0])
    }
  }, [vaults])

  useEffect(() => {
    if (selectedVault) {
      setLoadingOverlay(true) // Show loading overlay
      fetchTimeseries({
        variables: {
          chainId: selectedVault.chainId,
          address: selectedVault.address,
          label: 'apy-bwd-delta-pps',
          component: 'weeklyNet',
          limit: 1000,
        },
      }).finally(() => setLoadingOverlay(false)) // Hide loading overlay
    }
  }, [selectedVault, timeframe])

  const [chartData, setChartData] = useState<any[]>([])
  console.log('chartData: ', chartData)

  useEffect(() => {
    if (timeseriesData && timeseriesData.length > 0) {
      const transformedData = timeseriesData.map((dataPoint) => ({
        date: formatUnixTimestamp(dataPoint.time),
        value: dataPoint.value * 100,
      }))
      setChartData(transformedData)
    }
  }, [timeseriesData])

  if (loadingVaults || !selectedVault) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="loader">Loading...</div>
      </div>
    )
  }

  if (errorVaults || errorTimeseries) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="loader">Error Loading Data</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {loadingOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="loader">Loading...</div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Yearn Vault Analytics</h1>
        <VaultSelector
          vaults={vaults}
          selectedVault={selectedVault}
          setSelectedVault={setSelectedVault}
        />{' '}
        {/* moved vault selection */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MetricsCard
          title="Current APY"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          value={
            chartData.length > 0
              ? chartData[chartData.length - 1].value.toFixed(2) + '%'
              : 'N/A'
          }
          subtitle={`15-day moving average: ${
            chartData.length > 0
              ? (
                  chartData
                    .slice(-15)
                    .reduce((sum, data) => sum + data.value, 0) / 15
                ).toFixed(2) + '%'
              : 'N/A'
          }`}
        />
        <MetricsCard
          title="TVL"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={`$${(selectedVault.tvl.close / 1000000).toFixed(2)}M`}
          subtitle={`Last updated: ${formatUnixTimestamp(selectedVault.tvl.blockTime)}`}
        />
      </div>

      <TimeframeTabs
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
      >
        {timeframes.map((tf) => (
          <TabsContent key={tf.value} value={tf.value} className="space-y-4">
            <APYChart chartData={chartData} timeframe={tf.value} />{' '}
            {/* moved APY chart */}
            <TVLChart chartData={chartData} timeframe={tf.value} />{' '}
            {/* moved TVL chart */}
          </TabsContent>
        ))}
      </TimeframeTabs>
    </div>
  )
}
