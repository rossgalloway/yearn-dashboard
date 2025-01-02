// src/components/VaultFilter.tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { CHAIN_ID_TO_NAME, ChainId } from '@/constants/chains'
import { Vault } from '../../types/vaultTypes'
import { Badge } from '../ui/badge'
import FiltersIcon from '../../../public/icons/filtersIcon.svg'

interface VaultFilterProps {
  vaults: Vault[]
  availableChains: Record<number, string>
  setFilteredVaults: (vaults: Vault[]) => void
}

const VaultFilter: React.FC<VaultFilterProps> = ({
  vaults,
  availableChains,
  setFilteredVaults,
}) => {
  const params = useParams()
  const { versionFromURL, chainId: urlChainId } = params

  const [version, setVersion] = useState<string>('')
  const [chainId, setChainId] = useState<ChainId | null>(null)
  const [search, setSearch] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<{
    version: string
    chainId: ChainId | null
    search: string
  }>({
    version: '',
    chainId: null,
    search: '',
  })

  const onFilterChange = (newFilters: {
    version: string
    chainId: ChainId | null
    search: string
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

    if (newFilters.search) {
      filtered = filtered.filter(
        (vault) =>
          vault.address.includes(newFilters.search) ||
          vault.name.toLowerCase().includes(newFilters.search.toLowerCase()),
      )
    }

    setFilteredVaults(filtered)
  }

  const handleApplyFilters = () => {
    onFilterChange({ version, chainId, search })
    setOpen(false) // Close popover
  }

  const handleClearFilters = () => {
    setVersion('')
    setChainId(null)
    setSearch('')
    onFilterChange({ version: '', chainId: null, search: '' })
  }

  let isFilterActive: boolean = false
  if (filters.version || filters.chainId || filters.search) {
    isFilterActive = true
  }

  // Sync filters with URL on page load
  useEffect(() => {
    const urlFilters = {
      version: Array.isArray(versionFromURL)
        ? versionFromURL[0]
        : versionFromURL || '', // Ensure version is a string
      chainId:
        typeof urlChainId === 'string'
          ? (parseInt(urlChainId, 10) as ChainId)
          : null, // Ensure urlChainId is a string
      search: '',
    }
    setVersion(urlFilters.version)
    setChainId(urlFilters.chainId)
    onFilterChange(urlFilters) // Ensure version is a string

    const { search } = filters
    const newFilters = {
      version: urlFilters.version,
      chainId: urlFilters.chainId,
      search,
    }
    setFilters(newFilters)

    // if (!filters.version && !filters.chainId && !filters.search) {
    //   setVersion('v3')
    //   setChainId(1 as ChainId)
    //   onFilterChange({ version: 'v3', chainId: 1 as ChainId, search: '' })
    // }
  }, [versionFromURL, urlChainId]) // Ensure this runs when URL params change

  // // Initialize the filter on the first render. Set vault type to v3 and chain to 1.
  // useEffect(() => {
  //   if (!filters.version && !filters.chainId && !filters.search) {
  //     setVersion('v3')
  //     setChainId(1 as ChainId)
  //     onFilterChange({ version: 'v3', chainId: 1 as ChainId, search: '' })
  //   }
  // }, [])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="button">
          <div>
            <FiltersIcon
              className={`w-6 h-6 ${isFilterActive ? 'text-[#0657f9]' : 'text-black'}`}
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
              value={version}
              onChange={(e) => setVersion(e.target.value)}
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
              value={chainId ?? ''}
              onChange={(e) => setChainId(Number(e.target.value) as ChainId)} // Convert value to number
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
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
      <div className="flex flex-wrap gap-2">
        {filters.version && (
          <Badge variant="secondary">Version: {filters.version}</Badge>
        )}
        {filters.chainId && (
          <Badge variant="secondary">
            Chain: {CHAIN_ID_TO_NAME[filters.chainId]}
          </Badge>
        )}
        {filters.search && (
          <Badge variant="secondary">Search: {filters.search}</Badge>
        )}
      </div>
    </>
  )
}

export default VaultFilter
