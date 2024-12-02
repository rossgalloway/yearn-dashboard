import { Bar, ComposedChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

interface TVLChartProps {
  chartData: any[]
  timeframe: string
}

// Converted to a React function component with arrow syntax
export const TVLChart: React.FC<TVLChartProps> = ({ chartData, timeframe }) => {
  const filteredData = chartData.slice(-getTimeframeLimit(timeframe))

  return (
    <ChartContainer
      config={{
        value: { label: 'TVL (millions)', color: 'hsl(var(--chart-3))' },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={filteredData}>
          <XAxis dataKey="date" />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`}
          />
          <ChartTooltip />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
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

export default TVLChart
