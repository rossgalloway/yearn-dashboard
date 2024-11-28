import dynamic from 'next/dynamic'

const YearnDashboard = dynamic(
  () => import('@/components/yearn-dashboard'),
  { ssr: false }, // Disable SSR for this component
)

export default function HomePage() {
  return <YearnDashboard />
}
