//TODO: get the links working correctly
//TODO: add constituent tokenized strategies to the layout

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Vault, TimeseriesDataPoint, Timeseries } from '@/types/vaultTypes'
import { VaultSelectorFilter } from '@/components/yearn-dashboard/VaultSelectorFilter'
import { MetricsCard } from '@/components/yearn-dashboard/MetricsCard'
import { APYChart } from '@/components/yearn-dashboard/APYChart'
import { TimeframeTabs } from '@/components/yearn-dashboard/TimeframeTabs'
import { TVLChart } from '@/components/yearn-dashboard/TVLChart'
import { useVaults } from '@/hooks/useVaults'
import { useVaultTimeseries } from '@/hooks/useVaultTimeseries'
import { InfoIcon, TrendingUp, DollarSign } from 'lucide-react'
import {
  formatUnixTimestamp,
  calculateSMA,
  fillMissingDailyData,
  getEarliestAndLatestTimestamps,
} from '../lib/utils'
import { TabsContent, Tabs, TabsList, TabsTrigger } from './ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Badge } from './ui/badge'
import { CHAIN_ID_TO_NAME, ChainId } from '../constants/chains'
import UpArrow from '../../public/icons/up-arrow.svg'
import PPSChart from './yearn-dashboard/PPSChart'
import YearnLoader from './yearn-dashboard/yearnLoader'
import Image from 'next/image'

const timeframes = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '180d', label: '180 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
]

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
              component: 'net',
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
              limit: 1000,
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
      const { apy, tvl, pps } = timeseriesData

      const { earliest, latest } = getEarliestAndLatestTimestamps(apy, tvl, pps)

      // Fill each dataset
      const apyFilled = fillMissingDailyData(apy, earliest, latest)
      const tvlFilled = fillMissingDailyData(tvl, earliest, latest)
      const ppsFilled = fillMissingDailyData(pps, earliest, latest)

      // Apply SMA or other transformations.
      const rawValues = apyFilled.map((p) => p.value ?? 0)
      const sma15Values = calculateSMA(rawValues, 15)
      const sma30Values = calculateSMA(rawValues, 30)

      const transformedApyData = apyFilled.map((dataPoint, i) => ({
        date: formatUnixTimestamp(dataPoint.time),
        APY: dataPoint.value ? dataPoint.value * 100 : null,
        SMA15: sma15Values[i] !== null ? sma15Values[i]! * 100 : null,
        SMA30: sma30Values[i] !== null ? sma30Values[i]! * 100 : null,
      }))

      setApyChartData(transformedApyData)
      setTvlChartData(
        tvlFilled.map((dataPoint) => ({
          date: formatUnixTimestamp(dataPoint.time),
          TVL: dataPoint.value ?? null,
        })),
      )
      setPpsChartData(
        ppsFilled.map((dataPoint) => ({
          date: formatUnixTimestamp(dataPoint.time),
          PPS: dataPoint.value ?? null,
        })),
      )
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
          style={{ top: '-25px', left: '500px' }}
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
          <VaultSelectorFilter
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
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <h1 className="text-3xl font-bold pl-2 pt-4">
                    {selectedVault.name}
                  </h1>
                  <Badge variant="outline" className="self-end">
                    {selectedVault.address}
                  </Badge>
                </div>
                <div className="flex flex-row gap-2">
                  <Badge variant="outline">
                    {CHAIN_ID_TO_NAME[selectedVault.chainId]}
                  </Badge>
                  <Badge variant="outline">
                    {selectedVault.v3 ? 'V3' : 'V2'}
                    {' - '}
                    {selectedVault.apiVersion}
                  </Badge>
                  <a
                    href={
                      selectedVault.v3
                        ? `https://yearn.fi/v3/${selectedVault.chainId}/${selectedVault.address}`
                        : `https://yearn.fi/vaults/${selectedVault.chainId}/${selectedVault.address}`
                    }
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
              apyChartData.length > 0 &&
              apyChartData[apyChartData.length - 1].APY !== null // added null check
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
                          <div className="absolute inset-0 p-6 pt-0 opacity-10 h-[400px] pointer-events-none">
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
                          <div className="absolute inset-0 p-6 pt-0 opacity-10 h-[400px] pointer-events-none">
                            <TVLChart
                              chartData={tvlChartData}
                              timeframe={tf.value}
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
