import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

interface PPSChartProps {
  chartData: any[]
  timeframe: string
  hideAxes?: boolean // Added prop for hiding axes
  hideTooltip?: boolean // Added prop for hiding tooltip
}

export const APYChart: React.FC<PPSChartProps> = ({
  chartData,
  timeframe,
  hideAxes,
  hideTooltip,
}) => {
  const filteredData = chartData.slice(-getTimeframeLimit(timeframe))

  return (
    <ChartContainer
      config={{
        pps: {
          label: 'Price Per Share',
          color: hideAxes ? 'black' : 'var(--chart-1)',
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
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(3)} // Round to 3 decimals and remove %
            label={
              hideAxes
                ? undefined
                : {
                    value: 'Price Per Share',
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
          {!hideTooltip && <ChartTooltip />}

          <Line
            type="monotone"
            dataKey="PPS"
            stroke="var(--color-pps)"
            strokeWidth={2}
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
