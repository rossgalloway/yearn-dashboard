'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Badge } from '../ui/badge'
import { CHAIN_ID_TO_NAME, ChainId } from '@/constants/chains'
import FiltersIcon from '../../../public/icons/filtersIcon.svg'
import type { Vault } from '@/types/vaultTypes'

interface VaultManagerProps {
  vaults: Vault[]
  selectedVault: Vault | null
  availableChains: Record<number, string>
  setSelectedVault: (vault: Vault) => void
  setLoadingOverlay: (loading: boolean) => void
}

export const VaultSelectorFilter: React.FC<VaultManagerProps> = ({
  vaults,
  selectedVault,
  availableChains,
  setSelectedVault,
  setLoadingOverlay,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [filteredVaults, setFilteredVaults] = useState<Vault[]>(vaults)
  const filtersRef = useRef({
    version: '',
    chainId: null as ChainId | null,
  })
  const [filters, setFilters] = useState(() => {
    // Load filters from session storage if available
    const savedFilters = sessionStorage.getItem('vaultFilters')
    return savedFilters ? JSON.parse(savedFilters) : filtersRef.current
  })

  let isFilterActive: boolean = false
  if (filters.version || filters.chainId) {
    isFilterActive = true
  }

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
  }

  const filteredVaultsMemo = useMemo(() => {
    let filtered = filteredVaults.filter(
      (vault) =>
        vault.name.toLowerCase().includes(search.toLowerCase()) ||
        vault.address.toLowerCase().includes(search.toLowerCase()),
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
    console.log('filteredVaultsMemo: ', filtered)
    return filtered
  }, [search, selectedVault, filteredVaults, filters])

  const handleSelectChange = useCallback(
    (value: string) => {
      const selectedVault = vaults.find((vault) => vault.address === value)
      if (selectedVault) {
        setLoadingOverlay(true)
        setSelectedVault(selectedVault)
        router.push(
          `/${selectedVault.v3 ? 'v3' : 'v2'}/${selectedVault.chainId}/${selectedVault.address}`,
        )
        setSearch('')
      }
    },
    [vaults, setSelectedVault, router],
  )

  const handleClearFilters = () => {
    setFilters({ version: '', chainId: null })
  }

  // Save filters to session storage
  useEffect(() => {
    sessionStorage.setItem('vaultFilters', JSON.stringify(filters))
  }, [pathname, searchParams, filters])

  // update filtered vaults when filters change
  useEffect(() => {
    let filtered = vaults
    console.log('filters: ', filters)
    if (filters.version) {
      console.log('filters.version: ', filters.version)
      console.log('vaults: ', vaults)
      filtered = vaults.filter((vault) => {
        // Ensure the filter function returns a boolean value
        return filters.version === 'v2'
          ? vault.apiVersion.startsWith('0')
          : vault.apiVersion.startsWith('3')
      })
    }
    if (filters.chainId) {
      console.log('filters.chainId: ', filters.chainId)
      const chainIdNumber = Number(filters.chainId)
      filtered = filtered.filter((vault) => vault.chainId === chainIdNumber) // Filter on the already filtered array
    }
    console.log('setting filtered Vaults: ', filtered)
    setFilteredVaults(filtered)
  }, [filters, vaults]) // Added vaults as a dependency

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Select
          value={selectedVault?.address || ''}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select a vault" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Search vaults..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
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
              <div className="p-2 text-gray-500 text-sm">No results found</div>
            )}
          </SelectContent>
        </Select>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger
            className="button"
            onClick={() => setPopoverOpen(true)}
          >
            <FiltersIcon
              className={`w-6 h-6 ml-2 ${isFilterActive ? 'text-[#0657f9]' : 'text-black'}`}
            />
          </PopoverTrigger>
          <PopoverContent className="p-6 bg-white shadow-lg rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Version
              </label>
              <select
                value={filters.version}
                onChange={(e) => {
                  const version = e.target.value
                  setFilters({ ...filters, version })
                }}
                className="block w-full mt-1 border-gray-300 rounded-md"
              >
                <option value="">All</option>
                <option value="v2">V2</option>
                <option value="v3">V3</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Chain
              </label>
              <select
                value={filters.chainId ?? ''}
                onChange={(e) => {
                  const chainId = e.target.value
                  setFilters({ ...filters, chainId })
                }}
                className="block w-full mt-1 border-gray-300 rounded-md"
              >
                <option value="">All</option>
                {Object.entries(availableChains).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleClearFilters}
                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setPopoverOpen(false)}
                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default VaultSelectorFilter
