'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type { Vault } from '@/types/vaultTypes'
import VaultFilter from './VaultFilter'
import { Badge } from '../ui/badge'
import { CHAIN_ID_TO_NAME, ChainId } from '@/constants/chains'

interface VaultSelectorProps {
  vaults: Vault[]
  selectedVault: Vault | null
  availableChains: Record<number, string>
  setSelectedVault: (vault: Vault) => void
  setLoadingOverlay: (loading: boolean) => void
}

export function VaultSelector({
  vaults,
  selectedVault,
  availableChains,
  setSelectedVault,
  setLoadingOverlay,
}: VaultSelectorProps) {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>(vaults || [])
  const filtersRef = useRef<{
    version: string
    chainId: ChainId | null
  }>({
    version: '',
    chainId: null,
  })
  console.log('filtersRef.current: ', filtersRef.current)
  const [filters, setFilters] = useState(filtersRef.current)

  // Added useMemo for filtered vaults
  const filteredVaultsMemo = useMemo(() => {
    console.log('filteredVaults: ', filteredVaults)
    let filtered = filteredVaults.filter((vault) =>
      vault.name.toLowerCase().includes(search.toLowerCase()),
    )

    if (selectedVault) {
      const selectedVaultItem = vaults.find(
        (vault) => vault.address === selectedVault.address,
      )
      if (
        selectedVaultItem &&
        !filtered.some((vault) => vault.address === selectedVault.address)
      ) {
        return [selectedVaultItem, ...filtered]
      }
    }

    return filtered
  }, [search, selectedVault, filteredVaults, filters])

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus()
  //   }
  // }, [])

  // const handleOpenChange = useCallback((open: boolean) => {
  //   if (open && inputRef.current) {
  //     setTimeout(() => inputRef.current?.focus(), 0)
  //   }
  // }, [])

  const handleSelectChange = useCallback(
    (value: string) => {
      const selectedVault = vaults.find((vault) => vault.address === value)
      if (selectedVault) {
        setLoadingOverlay(true)
        setSelectedVault(selectedVault)
        console.log('selectedVault in handleSelectChange(): ', selectedVault)
        const vaultVersion = selectedVault.v3 ? 'v3' : 'v2'
        router.push(
          `/${vaultVersion}/${selectedVault.chainId}/${selectedVault.address}`,
        )
        setSearch('')
      } else {
        console.log('Vault not found')
      }
    },
    [vaults, setSelectedVault],
  )

  const handleCloseChange = () => {
    setSearch('')
  }

  const handleVersionBadgeClick = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      version: '',
    }))
  }

  const handleChainBadgeClick = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      chainId: null,
    }))
  }

  return (
    <div className="flex flex-row gap-2">
      <Select
        value={selectedVault?.address || ''}
        onValueChange={handleSelectChange}
        onOpenChange={(open) => {
          // handleOpenChange(open)
          if (!open) handleCloseChange()
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a vault" />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <div className="flex flex-wrap gap-2 pl-2 pb-2">
              <span className="text-sm text-gray-500">Active Filters: </span>
              {!filters.version && !filters.chainId && (
                <span className="text-sm text-gray-500">None</span>
              )}
              {filters.version && (
                <Badge
                  variant="secondary"
                  onClick={handleVersionBadgeClick}
                  className="cursor-pointer"
                >
                  Version: {filters.version}
                </Badge>
              )}
              {filters.chainId && (
                <Badge
                  variant="secondary"
                  onClick={handleChainBadgeClick}
                  className="cursor-pointer"
                >
                  Chain: {CHAIN_ID_TO_NAME[filters.chainId]}
                </Badge>
              )}
            </div>
            <Input
              // ref={inputRef}
              placeholder="Search vaults..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {filteredVaultsMemo.map((vault) => (
            <SelectItem key={vault.address} value={vault.address}>
              {vault.name}
            </SelectItem>
          ))}
          {filteredVaultsMemo.length === 1 && (
            <div className="p-2 text-center text-sm text-gray-500">
              No results found
            </div>
          )}
        </SelectContent>
      </Select>
      <VaultFilter
        vaults={vaults}
        availableChains={availableChains}
        filters={filters}
        setFilters={setFilters}
        setFilteredVaults={setFilteredVaults}
        filtersRef={filtersRef}
      />
    </div>
  )
}
export default VaultSelector
