'use client'

import { useState, useEffect } from 'react'
import type { Vault, TimeseriesDataPoint, Timeseries } from '@/types/vaultTypes'
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

import vaultsDataCropped from '@/graphql/data/vaultsData_cropped.json'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Badge } from './ui/badge'
import { Popover } from './ui/popover'
import { CHAIN_ID_TO_NAME, ChainId } from '../constants/chains'
import VaultFilter from './yearn-dashboard/VaultFilter'
import { getAvailableChains } from '../utils/filterChains'

const timeframes = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '180d', label: '180 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
]

// Helper function for SMA calculation
const calculateSMA = (
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

export default function YearnDashboard() {
  // const { vaults, loading: loadingVaults, error: errorVaults } = useVaults()
  const vaults = vaultsDataCropped as unknown as Vault[]
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>(vaults)
  const [timeframe, setTimeframe] = useState('30d')
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [timeseriesData, setTimeseriesData] = useState<Timeseries>({
    address: '',
    chainId: 0,
    apy: [],
    tvl: [],
  })
  const [filters, setFilters] = useState<{
    version: string
    chainId: ChainId | null
    search: string
  }>({
    version: '',
    chainId: null,
    search: '',
  })

  const availableChains = getAvailableChains(vaults)

  const handleFilterChange = (newFilters: {
    version: string
    chainId: ChainId | null
    search: string
  }) => {
    setFilters(newFilters)
    let filtered = vaults

    if (newFilters.version) {
      filtered = filtered.filter((vault) =>
        newFilters.version === 'v2'
          ? vault.apiVersion.startsWith('0')
          : vault.apiVersion.startsWith('3'),
      )
    }

    if (newFilters.chainId) {
      const chainIdNumber = Number(newFilters.chainId) // Convert chainId to number
      console.log('new chainId:', chainIdNumber)
      filtered = filtered.filter((vault) => vault.chainId === chainIdNumber)
      console.log('filtered chainId: ', filtered)
    }

    if (newFilters.search) {
      filtered = filtered.filter(
        (vault) =>
          vault.address.includes(newFilters.search) ||
          vault.name.toLowerCase().includes(newFilters.search.toLowerCase()),
      )
    }

    setFilteredVaults(filtered)
  }

  // const {
  //   fetchTimeseries,
  //   timeseriesData,
  //   loading: loadingTimeseries,
  //   error: errorTimeseries,
  // } = useVaultTimeseries()
  // console.log('timeseriesData: ', timeseriesData)

  const fetchTimeseries = async (selectedVault: Vault) => {
    const timeseriesData = await import(
      `@/graphql/data/${selectedVault.address}.json`
    )
    return timeseriesData
  }

  useEffect(() => {
    if (!selectedVault && filteredVaults && filteredVaults.length > 0) {
      setSelectedVault(filteredVaults[0])
    }
  }, [filteredVaults])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedVault) {
        setLoadingOverlay(true) // Show loading overlay
        const fetchedTimeSeries = await fetchTimeseries(selectedVault)
          // fetchTimeseries({
          //   variables: {
          //     chainId: selectedVault.chainId,
          //     address: selectedVault.address,
          //     label: 'apy-bwd-delta-pps',
          //     component: 'weeklyNet',
          //     limit: 1000,
          //   },
          // })
          .finally(() => setLoadingOverlay(false))
        setTimeseriesData(fetchedTimeSeries)
      }
    }
    fetchData()
  }, [selectedVault])

  const [apyChartData, setApyChartData] = useState<any[]>([])
  const [tvlChartData, setTvlChartData] = useState<any[]>([])

  useEffect(() => {
    if (timeseriesData) {
      const rawValues = timeseriesData.apy.map((point) => point.value)
      const sma15Values = calculateSMA(rawValues, 15)
      const sma30Values = calculateSMA(rawValues, 30)

      const transformedApyData = timeseriesData.apy.map((dataPoint, index) => ({
        date: formatUnixTimestamp(dataPoint.time),
        APY: dataPoint.value * 100,
        SMA15: sma15Values[index] !== null ? sma15Values[index]! * 100 : null,
        SMA30: sma30Values[index] !== null ? sma30Values[index]! * 100 : null,
      }))

      setApyChartData(transformedApyData)
      //TODO: get asset to convert to USD
      const transformedTvlData = timeseriesData.tvl.map((dataPoint) => ({
        date: formatUnixTimestamp(dataPoint.time),
        TVL: dataPoint.value,
      }))
      setTvlChartData(transformedTvlData)
    }
  }, [timeseriesData])

  // if (loadingVaults || !selectedVault) {
  //   return (
  //     <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
  //       <div className="loader">Loading...</div>
  //     </div>
  //   )
  // }

  // if (errorVaults || errorTimeseries) {
  //   return (
  //     <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
  //       <div className="loader">Error Loading Data</div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex flex-col gap-6 p-6">
      {loadingOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="loader">Loading...</div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Yearn Vault Analytics</h1>
        <div className="flex flex-row gap-2">
          <VaultSelector
            vaults={filteredVaults}
            selectedVault={selectedVault}
            setSelectedVault={setSelectedVault}
          />
          <VaultFilter
            onFilterChange={handleFilterChange}
            availableChains={availableChains}
          />
          <div className="flex flex-wrap gap-2">
            {filters.version && (
              <Badge variant="secondary">Version: {filters.version}</Badge>
            )}
            {filters.chainId && (
              <Badge variant="secondary">
                Chain: {CHAIN_ID_TO_NAME[filters.chainId]}
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary">Search: {filters.search}</Badge>
            )}
          </div>
        </div>
        {selectedVault && (
          <div className="flex flex-row gap-4 items-center text-sm text-gray-500">
            <Badge variant="secondary">{selectedVault.address}</Badge>
            <div className="flex gap-2">
              <a
                href={`https://yearn.finance/#/vaults/${selectedVault.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Yearn ↗
              </a>
              <a
                href={`https://etherscan.io/address/${selectedVault.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Etherscan ↗
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-4 md:grid-cols-2">
          <MetricsCard
            title="Current APY"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            value={
              apyChartData.length > 0
                ? apyChartData[apyChartData.length - 1].APY.toFixed(2) + '%'
                : 'N/A'
            }
            subtitle={`15-day moving average: ${
              apyChartData.length > 0
                ? (
                    apyChartData
                      .slice(-15)
                      .reduce((sum, data) => sum + data.APY, 0) / 15
                  ).toFixed(2) + '%'
                : 'N/A'
            }`}
          />
          <MetricsCard
            title="15-Day Average APY"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            value={
              apyChartData.length > 0
                ? (
                    apyChartData
                      .slice(-15)
                      .reduce((sum, data) => sum + data.APY, 0) / 15
                  ).toFixed(2) + '%'
                : 'N/A'
            }
            subtitle={''}
          />
        </div>
        <MetricsCard
          title="TVL"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={`$${selectedVault ? (selectedVault.tvl.close / 1000000).toFixed(2) : 'N/A'}M`} // added null check for selectedVault
          subtitle={`Last updated: ${selectedVault ? formatUnixTimestamp(selectedVault.tvl.blockTime) : 'N/A'}`}
        />
      </div>

      <TimeframeTabs
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
      >
        {timeframes.map((tf) => (
          <TabsContent key={tf.value} value={tf.value}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>APY Performance</CardTitle>
                  <CardDescription>
                    Raw APY and 15-day moving average over {tf.label}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <APYChart chartData={apyChartData} timeframe={tf.value} />{' '}
                  {/* moved APY chart */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>TVL</CardTitle>
                  <CardDescription>
                    Total value deposited over {tf.label}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <TVLChart chartData={tvlChartData} timeframe={tf.value} />{' '}
                  {/* moved TVL chart */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </TimeframeTabs>
    </div>
  )
}
