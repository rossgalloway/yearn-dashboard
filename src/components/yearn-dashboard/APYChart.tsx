import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { formatUnixTimestamp } from '@/lib/utils'

interface APYChartProps {
  chartData: any[]
  timeframe: string
}

export const APYChart: React.FC<APYChartProps> = ({ chartData, timeframe }) => {
  const filteredData = chartData.slice(-getTimeframeLimit(timeframe))

  return (
    <ChartContainer
      config={{
        apy: { label: 'APY %', color: 'var(--chart-2)' }, // Changed "value" to "apy"
        sma15: { label: '15-day SMA', color: 'var(--chart-1)' },
        sma30: { label: '30-day SMA', color: 'var(--chart-3)' },
      }}
      style={{ height: 'inherit' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 0, // Increased left margin for Y-axis label
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(date: string) => date.replace(/, \d{4}$/, '')} // Remove year from "MMM d, yyyy"
          />
          <YAxis
            domain={[0, 'auto']}
            tickFormatter={(value) => `${value}%`}
            label={{
              value: 'APY %',
              angle: -90,
              position: 'insideLeft', // Changed from 'center' to 'insideLeft'
              offset: 10, // Negative offset moves label closer to axis
              style: {
                textAnchor: 'middle',
              },
            }}
          />
          <ChartTooltip
            formatter={(value: number, name: string) => {
              const label =
                name === 'APY'
                  ? 'APY'
                  : name === 'SMA15'
                    ? '15-day SMA'
                    : '30-day SMA'
              return [`${value.toFixed(2)}%`, label]
            }}
          />
          <Line
            type="monotone"
            dataKey="APY" // Changed "value" to "apy"
            stroke="var(--color-apy)" // Changed "value" to "apy"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="SMA15"
            stroke="var(--color-sma15)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="SMA30"
            stroke="var(--color-sma30)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function getTimeframeLimit(timeframe: string): number {
  switch (timeframe) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '180d':
      return 180
    case '1y':
      return 365
    case 'all':
    default:
      return 1000
  }
}

export default APYChart
