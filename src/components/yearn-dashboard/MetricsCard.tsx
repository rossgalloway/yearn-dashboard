import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface MetricsCardProps {
  title: string
  icon: ReactNode
  value: string
  subtitle: string
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  icon,
  value,
  subtitle,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
export default MetricsCard
