import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReactNode } from 'react'

interface TimeframeTabsProps {
  timeframes: { value: string; label: string }[]
  timeframe: string
  setTimeframe: (value: string) => void
  children: ReactNode
}

// Converted to a React function component with arrow syntax
export const TimeframeTabs: React.FC<TimeframeTabsProps> = ({
  timeframes,
  timeframe,
  setTimeframe,
  children,
}) => {
  return (
    <Tabs
      defaultValue="180d"
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
      {children}
    </Tabs>
  )
}
