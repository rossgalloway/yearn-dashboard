// src/components/VaultFilter.tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { CHAIN_ID_TO_NAME, ChainId } from '@/constants/chains'
import { Vault } from '../../types/vaultTypes'
import { Badge } from '../ui/badge'
import FiltersIcon from '../../../public/icons/filtersIcon.svg'
import React from 'react'

interface VaultFilterProps {
  vaults: Vault[]
  availableChains: Record<number, string>
  filters: {
    version: string
    chainId: ChainId | null
  }
  setFilters: (filters: { version: string; chainId: ChainId | null }) => void
  setFilteredVaults: (vaults: Vault[]) => void
}

const VaultFilter: React.FC<VaultFilterProps> = ({
  vaults,
  availableChains,
  filters,
  setFilters,
  setFilteredVaults,
}) => {
  const params = useParams()
  const { versionFromURL, chainId: urlChainId } = params

  const [open, setOpen] = useState(false)

  const onFilterChange = (newFilters: {
    version: string
    chainId: ChainId | null
  }) => {
    setFilters(newFilters)
    let filtered = vaults

    if (newFilters.version) {
      filtered = filtered.filter((vault: Vault) =>
        newFilters.version === 'v2'
          ? vault.apiVersion.startsWith('0')
          : vault.apiVersion.startsWith('3'),
      )
    }

    if (newFilters.chainId) {
      const chainIdNumber = Number(newFilters.chainId) // Convert chainId to number
      filtered = filtered.filter((vault) => vault.chainId === chainIdNumber)
    }
    console.log('setting filtered Vaults: ', filtered)
    setFilteredVaults(filtered)
  }

  const handleApplyFilters = () => {
    console.log('applying filters')
    // onFilterChange({ version: filters.version, chainId: filters.chainId })
    setOpen(false) // Close popover
  }

  const handleClearFilters = () => {
    setFilters({ version: '', chainId: null })
    // onFilterChange({ version: '', chainId: null })
  }

  let isFilterActive: boolean = false
  if (filters.version || filters.chainId) {
    isFilterActive = true
  }

  const handleVersionChange = (version: string) => {
    console.log('handleVersionChange: ', { ...filters, version })
    setFilters({ ...filters, version })
  }

  const handleChainIdChange = (chainId: ChainId | null) => {
    console.log('handleChainIdChange: ', { ...filters, chainId })
    setFilters({ ...filters, chainId })
  }

  // Sync filters with URL on page load
  useEffect(() => {
    const urlFilters = {
      version: Array.isArray(versionFromURL)
        ? versionFromURL[0]
        : versionFromURL || '',
      chainId:
        typeof urlChainId === 'string'
          ? (parseInt(urlChainId, 10) as ChainId)
          : null,
    }
    setFilters(urlFilters)

    const newFilters = {
      version: urlFilters.version,
      chainId: urlFilters.chainId,
    }
    setFilters(newFilters)
  }, [versionFromURL, urlChainId])

  useEffect(() => {
    onFilterChange(filters)
  }, [filters]) // Modified dependency array to be an array containing filters

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="button">
          <div>
            <FiltersIcon
              className={`w-6 h-6 ml-2 ${isFilterActive ? 'text-[#0657f9]' : 'text-black'}`}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-6 bg-white shadow-lg rounded-md">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 w-6 h-6 text-gray-500 hover:text-gray-700 flex items-center justify-center"
          >
            &times;
          </button>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Vault Version
            </label>
            <select
              value={filters.version}
              onChange={(e) => handleVersionChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="v2">V2</option>
              <option value="v3">V3</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Chain
            </label>
            <select
              value={filters.chainId ?? ''}
              onChange={(e) => {
                const value = e.target.value
                handleChainIdChange(Number(value) as ChainId)
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              {Object.keys(availableChains).map((id) => (
                <option key={id} value={id}>
                  {availableChains[Number(id)]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleClearFilters}
              className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Filters
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default VaultFilter
