import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedVault?.address}
        onValueChange={(value) => {
          const currentVault =
            vaults.find((v) => v.address === value) || vaults[0]
          setSelectedVault(currentVault)
        }}
      >
        <SelectTrigger className="w-[180px]">
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
