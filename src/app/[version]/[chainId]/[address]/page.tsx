// src/app/[version]/[chainId]/[address]/page.tsx
'use client'
import { useParams } from 'next/navigation'
import YearnDashboard from '@/components/yearn-dashboard'

export default function VaultPage() {
  const params = useParams()
  const { version, chainId, address } = params as {
    version: string
    chainId: string
    address: string
  } // ensure params are strings

  return (
    <YearnDashboard
      version={version}
      chainId={Number(chainId)}
      address={address}
    />
  )
}
