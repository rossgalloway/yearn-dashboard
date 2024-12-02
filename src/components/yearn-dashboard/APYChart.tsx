import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { formatUnixTimestamp } from '@/lib/utils'

interface APYChartProps {
  chartData: any[]
  timeframe: string
}

export const APYChart: React.FC<APYChartProps> = ({ chartData, timeframe }) => {
  console.log('chartData: ', chartData)
  console.log('timeframe: ', timeframe)
  const filteredData = chartData.slice(-getTimeframeLimit(timeframe))
  console.log('filteredData: ', filteredData)

  return (
    <ChartContainer
      config={{ value: { label: 'APY %', color: 'black' } }}
      style={{ height: '400px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData}>
          <XAxis dataKey="date" />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
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
