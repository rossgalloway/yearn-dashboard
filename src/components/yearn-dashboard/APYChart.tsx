import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

interface APYChartProps {
  chartData: any[]
  timeframe: string
  hideAxes?: boolean // Added prop for hiding axes
  hideTooltip?: boolean // Added prop for hiding tooltip
}

export const APYChart: React.FC<APYChartProps> = ({
  chartData,
  timeframe,
  hideAxes,
  hideTooltip,
}) => {
  const filteredData = chartData.slice(-getTimeframeLimit(timeframe))

  return (
    <ChartContainer
      config={{
        apy: { label: 'APY %', color: hideAxes ? 'black' : 'var(--chart-2)' }, // Changed "value" to "apy"
        sma15: {
          label: '15-day SMA',
          color: hideAxes ? 'black' : 'var(--chart-1)',
        },
        sma30: {
          label: '30-day SMA',
          color: hideAxes ? 'black' : 'var(--chart-3)',
        },
      }}
      style={{ height: 'inherit' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 10, // Increased left margin for Y-axis label
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            // tickFormatter={(date: string) => date.replace(/, \d{4}$/, '')} // Remove year from "MMM d, yyyy"
            tick={
              hideAxes
                ? false
                : {
                    fill: 'hsl(var(--muted-foreground))',
                  }
            }
            axisLine={
              hideAxes ? false : { stroke: 'hsl(var(--muted-foreground))' }
            } // Hide axis line
            tickLine={
              hideAxes ? false : { stroke: 'hsl(var(--muted-foreground))' }
            }
          />
          <YAxis
            domain={[0, 'auto']}
            tickFormatter={(value) => `${value}%`}
            label={
              hideAxes
                ? undefined
                : {
                    value: 'APY %',
                    angle: -90,
                    position: 'insideLeft', // Changed from 'center' to 'insideLeft'
                    offset: 10, // Negative offset moves label closer to axis
                    style: {
                      textAnchor: 'middle',
                      fill: hideAxes
                        ? 'transparent'
                        : 'hsl(var(--muted-foreground))', // Make label transparent when hiding axes
                    },
                  }
            }
            tick={
              hideAxes
                ? false
                : {
                    fill: 'hsl(var(--muted-foreground))',
                  }
            } // Hide ticks when hideAxes is true
            axisLine={
              hideAxes ? false : { stroke: 'hsl(var(--muted-foreground))' }
            } // Hide axis line
            tickLine={
              hideAxes ? false : { stroke: 'hsl(var(--muted-foreground))' }
            } // Hide tick lines
          />
          {!hideTooltip && (
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
          )}
          <Line
            type="monotone"
            dataKey="APY" // Changed "value" to "apy"
            stroke="var(--color-apy)" // Changed "value" to "apy"
            strokeWidth={hideAxes ? 1 : 1.5}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="SMA15"
            stroke="var(--color-sma15)"
            strokeWidth={hideAxes ? 1 : 1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="SMA30"
            stroke="var(--color-sma30)"
            strokeWidth={hideAxes ? 1 : 1.5}
            dot={false}
            isAnimationActive={false}
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
