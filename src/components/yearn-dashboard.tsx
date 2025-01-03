'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { TabsContent, Tabs, TabsList, TabsTrigger } from './ui/tabs'
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
import UpArrow from '../../public/icons/up-arrow.svg'
import PPSChart from './yearn-dashboard/PPSChart'
import YearnLoader from './yearn-dashboard/yearnLoader'
import Image from 'next/image'
import { set } from 'date-fns'

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

export default function YearnDashboard({
  version,
  chainId,
  address,
}: {
  version?: string
  chainId?: number
  address?: string
}) {
  const {
    vaults,
    availableChains: availableChainNumbers,
    loading: loadingVaults,
    error: errorVaults,
  } = useVaults()

  useEffect(() => {
    if (vaults) {
      console.log('retrieved vaults: ', vaults)
    }
  }, [vaults])

  const availableChains: Record<number, string> = availableChainNumbers.reduce(
    (acc, chainId) => {
      acc[chainId] = CHAIN_ID_TO_NAME[chainId] || 'Unknown' // map numbers to ChainId enum and maintain both id and name
      return acc
    },
    {} as Record<number, string>,
  )

  // const vaults = vaultsDataCropped as unknown as Vault[]
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const [timeframe, setTimeframe] = useState('180d')
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [selectVaultOverlay, setSelectVaultOverlay] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const [timeseriesData, setTimeseriesData] = useState<Timeseries>({
    address: '',
    chainId: 0,
    apy: [],
    tvl: [],
    pps: [],
  })

  //this fetches the queries to be executed on demand.
  const {
    fetchApy,
    fetchTvl,
    fetchPps,
    apyData,
    tvlData,
    ppsData,
    loading: loadingTimeseries,
    error: errorTimeseries,
  } = useVaultTimeseries()

  // Whenever vault data or props change, see if there's a matching vault
  useEffect(() => {
    if (!selectedVault && vaults && chainId && address) {
      const vaultMatch = vaults.find(
        (v) =>
          v.chainId === chainId &&
          v.address.toLowerCase() === address.toLowerCase(),
      )
      setSelectedVault(vaultMatch || null)
    }
  }, [vaults])

  const fetchData = useCallback(async () => {
    // Memoize fetchData
    if (selectedVault) {
      setLoadingOverlay(true) // Show loading overlay

      try {
        await Promise.all([
          fetchApy({
            variables: {
              chainId: selectedVault.chainId,
              address: selectedVault.address,
              label: 'apy-bwd-delta-pps',
              component: 'weeklyNet',
              limit: 1000,
            },
          }),
          fetchTvl({
            variables: {
              chainId: selectedVault.chainId,
              address: selectedVault.address,
              label: 'tvl',
              limit: 1000,
            },
          }),
          fetchPps({
            variables: {
              address: selectedVault.address,
              label: 'pps',
              component: 'humanized',
            },
          }),
        ])

        // Clean the fetched data by removing chainId and address
        const cleanApyData: TimeseriesDataPoint[] =
          apyData?.map(({ chainId, address, ...rest }) => rest) || []
        const cleanTvlData: TimeseriesDataPoint[] =
          tvlData?.map(({ chainId, address, ...rest }) => rest) || []
        const cleanPpsData: TimeseriesDataPoint[] =
          ppsData?.map(({ address, ...rest }) => rest) || []

        // Combine the cleaned data
        const combinedData: Timeseries = {
          chainId: selectedVault.chainId,
          address: selectedVault.address,
          apy: cleanApyData,
          tvl: cleanTvlData,
          pps: cleanPpsData,
        }

        setTimeseriesData(combinedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingOverlay(false) // Hide loading overlay
        setFirstLoad(false)
      }
    }
  }, [selectedVault, fetchApy, fetchTvl, fetchPps, apyData, tvlData, ppsData]) // Dependencies

  useEffect(() => {
    if (!firstLoad) return
    fetchData()
  }, [fetchData]) // Only re-run if fetchData changes

  const [apyChartData, setApyChartData] = useState<any[]>([])
  const [tvlChartData, setTvlChartData] = useState<any[]>([])
  const [ppsChartData, setPpsChartData] = useState<any[]>([])

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
      const transformedPpsData = timeseriesData.pps.map((dataPoint) => ({
        date: formatUnixTimestamp(dataPoint.time),
        PPS: dataPoint.value,
      }))
      setPpsChartData(transformedPpsData)
    }
  }, [timeseriesData])

  const [selectedChart, setSelectedChart] = useState<'APY' | 'TVL' | 'PPS'>(
    'APY',
  ) // Added state for selected chart

  if (loadingVaults && !selectedVault) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <YearnLoader />
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

  const SelectVaultOverlay: React.FC = () => {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ top: '-23px', left: '215px' }}
        >
          <UpArrow className="w-6 h-6 font-bold text-[var(--chart-1)]" />
          <div className="text-md text-[var(--chart-1)] font-bold">
            Select Vault
          </div>
        </div>
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ top: '-25px', left: '480px' }}
        >
          <UpArrow className="w-6 h-6 font-bold text-[var(--chart-1)]" />
          <div className="flex flex-col items-center text-md text-[var(--chart-1)] font-bold">
            Filter Vaults
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto">
      {' '}
      {/* Set max width to 800px and center */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/icons/logo.svg" // updated path
            alt="Yearn Logo"
            width={24} // equivalent to w-6
            height={24} // equivalent to h-6
          />
          <h2 className="text-xl font-bold pr-4">Vault Analytics</h2>
          <VaultSelector
            vaults={vaults || []}
            selectedVault={selectedVault}
            availableChains={availableChains}
            setSelectedVault={setSelectedVault}
            setLoadingOverlay={setLoadingOverlay}
          />
        </div>
        {selectedVault && (
          <>
            <div className="flex flex-row gap-4 items-end text-sm">
              <h1 className="text-3xl font-bold pl-2 pt-4">
                {selectedVault.name}
              </h1>
              <Badge variant="outline">{selectedVault.address}</Badge>
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
          </>
        )}
      </div>
      <div className="relative flex flex-col gap-4">
        {!selectedVault && <SelectVaultOverlay />}
        {loadingOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-85 z-10">
            <YearnLoader />
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-4">
          <MetricsCard
            title="Raw Current APY"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            value={
              apyChartData.length > 0
                ? apyChartData[apyChartData.length - 1].APY.toFixed(2) + '%'
                : 'N/A'
            }
            subtitle={''}
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
          <MetricsCard
            title="30-Day Average APY"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            value={
              apyChartData.length > 0
                ? (
                    apyChartData
                      .slice(-30)
                      .reduce((sum, data) => sum + data.APY, 0) / 30
                  ).toFixed(2) + '%'
                : 'N/A'
            }
            subtitle={''}
          />
          <MetricsCard
            title="TVL"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            value={`$${selectedVault ? (selectedVault.tvl.close / 1000000).toFixed(2) : 'N/A'}M`} // added null check for selectedVault
            // subtitle={`Last updated: ${selectedVault ? formatUnixTimestamp(selectedVault.tvl.blockTime) : 'N/A'}`}
            subtitle={''}
          />
        </div>
        <Tabs
          value={selectedChart}
          onValueChange={(value: string) =>
            setSelectedChart(value as 'APY' | 'TVL' | 'PPS')
          }
        >
          <TabsList>
            <TabsTrigger value="APY">APY Chart</TabsTrigger>
            <TabsTrigger value="PPS">PPS Chart</TabsTrigger>
            <TabsTrigger value="TVL">TVL Chart</TabsTrigger>
          </TabsList>
        </Tabs>
        <TimeframeTabs
          timeframes={timeframes}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        >
          {timeframes.map((tf) => (
            <TabsContent key={tf.value} value={tf.value}>
              <div className="grid grid-cols-1 gap-4">
                {' '}
                {/* Changed to single column layout */}
                <div className="relative">
                  {selectedChart === 'APY' && (
                    <>
                      <Card className="bg-transparent">
                        <CardHeader>
                          <CardTitle>
                            APY Performance (TVL shown ghosted)
                          </CardTitle>
                          <CardDescription>
                            Raw APY, 15-day, and 30-day moving averages over{' '}
                            {tf.label}.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] relative">
                          <APYChart
                            chartData={apyChartData}
                            timeframe={tf.value}
                          />
                          <div className="absolute inset-0 p-6 pt-0 opacity-20 h-[400px] pointer-events-none">
                            {/* Ghosted TVL chart */}
                            <TVLChart
                              chartData={tvlChartData}
                              timeframe={tf.value}
                              hideAxes={true} // Hide axes
                              hideTooltip={true}
                            />
                          </div>
                          {/* Render APY chart */}
                        </CardContent>
                      </Card>
                    </>
                  )}
                  {selectedChart === 'TVL' && (
                    <>
                      <Card className="bg-transparent">
                        {' '}
                        {/* Set background to transparent */}
                        <CardHeader>
                          <CardTitle>TVL (APY shown ghosted)</CardTitle>
                          <CardDescription>
                            Total value deposited over {tf.label}.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] relative">
                          <TVLChart
                            chartData={tvlChartData}
                            timeframe={tf.value}
                          />{' '}
                          <div className="absolute inset-0 p-6 pt-0 opacity-20 h-[400px] pointer-events-none">
                            {' '}
                            {/* Ghosted APY chart */}
                            <APYChart
                              chartData={apyChartData}
                              timeframe={tf.value}
                              hideAxes
                              hideTooltip
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                  {selectedChart === 'PPS' && (
                    <>
                      <Card className="bg-transparent">
                        <CardHeader>
                          <CardTitle>
                            PPS Performance (APY shown ghosted)
                          </CardTitle>
                          <CardDescription>
                            Price per share values over {tf.label}.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] relative">
                          <PPSChart
                            chartData={ppsChartData}
                            timeframe={tf.value}
                          />
                          <div className="absolute inset-0 p-6 pt-0 opacity-20 h-[400px] pointer-events-none">
                            {/* Ghosted APY chart */}
                            <APYChart
                              chartData={apyChartData}
                              timeframe={tf.value}
                              hideAxes
                              hideTooltip
                            />
                          </div>
                          {/* Render APY chart */}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </TimeframeTabs>
      </div>
    </div>
  )
}
