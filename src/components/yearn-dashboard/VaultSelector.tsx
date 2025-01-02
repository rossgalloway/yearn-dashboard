'use client'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Vault } from '@/types/vaultTypes'

interface VaultSelectorProps {
  vaults: Vault[]
  selectedVault: Vault | null
  setSelectedVault: (vault: Vault) => void
  setLoadingOverlay: (loading: boolean) => void
}

export function VaultSelector({
  vaults,
  selectedVault,
  setSelectedVault,
  setLoadingOverlay,
}: VaultSelectorProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedVault?.address}
        onValueChange={async (value) => {
          const currentVault = vaults.find((v) => v.address === value)
          if (!currentVault) return
          const vaultVersion = currentVault.v3 ? 'v3' : 'v2'
          await router.push(
            `/${vaultVersion}/${currentVault.chainId}/${currentVault.address}`, // Modified to use await
          )
          setSelectedVault(currentVault)
          setLoadingOverlay(true)
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select vault" />
        </SelectTrigger>
        <SelectContent>
          {vaults.map((vault) => (
            <SelectItem key={vault.address} value={vault.address}>
              {vault.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* {selectedVault && (
        <Badge variant="secondary">{selectedVault.asset.symbol}</Badge>
      )} */}
    </div>
  )
}
export default VaultSelector
