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
}

export function VaultSelector({
  vaults,
  selectedVault,
  setSelectedVault,
}: VaultSelectorProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedVault?.address}
        onValueChange={(value) => {
          const currentVault = vaults.find((v) => v.address === value)
          if (!currentVault) return
          const vaultVersion = currentVault.v3 ? 'v3' : 'v2'
          router.push(
            `/${vaultVersion}/${currentVault.chainId}/${currentVault.address}`,
          )
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
