'use client'

import { useState } from 'react'
import type { Vault, TimeseriesDataPoint } from '@/types/vault'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { InfoIcon, TrendingUp, DollarSign } from 'lucide-react'
import { formatDate, formatDateTime } from '@/utils/format-date'

// Import chart components
import {
  Bar,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

// Sample data - replace with your API data
const historicalData: TimeseriesDataPoint[] = [
  { date: '2023-01-01', rawApy: 8.5, movingAverageApy: 8.2, tvl: 1000000 },
  { date: '2023-02-01', rawApy: 9.2, movingAverageApy: 8.5, tvl: 1200000 },
  { date: '2023-03-01', rawApy: 7.8, movingAverageApy: 8.3, tvl: 980000 },
  { date: '2023-04-01', rawApy: 8.9, movingAverageApy: 8.6, tvl: 1150000 },
  { date: '2023-05-01', rawApy: 9.5, movingAverageApy: 8.8, tvl: 1300000 },
  { date: '2023-06-01', rawApy: 8.2, movingAverageApy: 8.7, tvl: 1100000 },
]

const vaults: Vault[] = [
  {
    yearn: true,
    v3: true,
    name: 'USDC Vault',
    chainId: 1,
    address: '0x...',
    asset: {
      name: 'USD Coin',
      symbol: 'USDC',
    },
    apiVersion: '3.0.0',
    tvl: {
      blockTime: '2024-01-20T00:00:00Z',
      close: 1200000,
      component: 'tvl',
      label: 'TVL',
    },
    pricePerShare: 1.05,
  },
  // Add more vaults as needed
]

const timeframes = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '180d', label: '180 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
]

export default function YearnDashboard() {
  const [selectedVault, setSelectedVault] = useState(vaults[0])
  const [timeframe, setTimeframe] = useState('30d')

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Yearn Vault Analytics</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedVault.address}
            onValueChange={(value) =>
              setSelectedVault(
                vaults.find((v) => v.address === value) || vaults[0],
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select vault" />
            </SelectTrigger>
            <SelectContent>
              {vaults.map((vault) => (
                <SelectItem key={vault.address} value={vault.address}>
                  {vault.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary">{selectedVault.asset.symbol}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current APY</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historicalData[historicalData.length - 1].rawApy.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              15-day moving average:{' '}
              {historicalData[
                historicalData.length - 1
              ].movingAverageApy.toFixed(2)}
              %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TVL</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(selectedVault.tvl.close / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDateTime(selectedVault.tvl.blockTime)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="30d"
        className="space-y-4"
        value={timeframe}
        onValueChange={setTimeframe}
      >
        <TabsList>
          {timeframes.map((tf) => (
            <TabsTrigger key={tf.value} value={tf.value}>
              {tf.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {timeframes.map((tf) => (
          <TabsContent key={tf.value} value={tf.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>APY Performance</CardTitle>
                <CardDescription>
                  Raw APY and 15-day moving average for the past {tf.label}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    rawApy: {
                      label: 'Raw APY %',
                      color: 'hsl(var(--chart-1))',
                    },
                    movingAverageApy: {
                      label: '15-day Moving Average %',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatDate(value)}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <ChartTooltip />
                      <Line
                        type="monotone"
                        dataKey="rawApy"
                        stroke="var(--color-rawApy)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="movingAverageApy"
                        stroke="var(--color-movingAverageApy)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Strategy Insight</AlertTitle>
              <AlertDescription>
                This vault is currently utilizing a conservative strategy with
                exposure primarily to {selectedVault.asset.name} lending
                markets.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Total Value Locked</CardTitle>
                <CardDescription>
                  Historical TVL in millions of dollars
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ChartContainer
                  config={{
                    tvl: {
                      label: 'TVL (millions)',
                      color: 'hsl(var(--chart-3))',
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={historicalData}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatDate(value)}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value) =>
                          `$${(value / 1000000).toFixed(1)}M`
                        }
                      />
                      <ChartTooltip />
                      <Bar
                        dataKey="tvl"
                        fill="var(--color-tvl)"
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="raw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw Vault Data</CardTitle>
              <CardDescription>
                Complete API response for the selected vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
                {JSON.stringify(selectedVault, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
