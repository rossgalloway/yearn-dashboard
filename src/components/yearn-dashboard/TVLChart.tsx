import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'

interface TVLChartProps {
  chartData: any[]
  timeframe: string
  hideAxes?: boolean // Added prop for hiding axes
  hideTooltip?: boolean // Added prop for hiding tooltip
}

const formatTooltipValue = (value: number) => {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

// Converted to a React function component with arrow syntax
export const TVLChart: React.FC<TVLChartProps> = ({
  chartData,
  timeframe,
  hideAxes,
  hideTooltip,
}) => {
  const filteredData = chartData.slice(-getTimeframeLimit(timeframe))

  return (
    <ChartContainer
      config={{
        value: { label: 'TVL (millions)', color: 'var(--chart-1)' },
      }}
      style={{ height: 'inherit' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
          <YAxis
            domain={[0, 'auto']}
            tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`}
            label={
              hideAxes
                ? undefined
                : {
                    value: 'TVL ($ millions)',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    style: {
                      textAnchor: 'middle',
                      fill: 'hsl(var(--muted-foreground))', // Added fill color
                    },
                  }
            } // Hide label when hideAxes is true
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
          {!hideTooltip && <ChartTooltip formatter={formatTooltipValue} />}
          <Bar
            dataKey="TVL"
            fill={'var(--color-value)'}
            stroke={'transparent'}
            // fill={hideAxes ? 'transparent' : 'var(--color-value)'}
            // stroke={hideAxes ? 'var(--color-value)' : 'transparent'}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
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
