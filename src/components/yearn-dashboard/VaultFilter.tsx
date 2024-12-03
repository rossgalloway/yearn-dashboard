// src/components/VaultFilter.tsx
import { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { CHAIN_ID_TO_NAME, ChainId } from '@/constants/chains'

interface VaultFilterProps {
  onFilterChange: (filters: {
    version: string
    chainId: ChainId | null
    search: string
  }) => void
  availableChains: ChainId[]
}

const VaultFilter: React.FC<VaultFilterProps> = ({
  onFilterChange,
  availableChains,
}) => {
  const [version, setVersion] = useState<string>('')
  const [chainId, setChainId] = useState<ChainId | null>(null)
  const [search, setSearch] = useState<string>('')

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

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="button">
        <img
          src="/static/icons/filtersIcon.svg"
          alt="Filters"
          className="w-6 h-6"
        />
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
            onChange={(e) => setChainId(e.target.value as unknown as ChainId)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All</option>
            {availableChains.map((id: ChainId) => (
              <option key={id} value={id}>
                {CHAIN_ID_TO_NAME[id]}
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
  )
}

export default VaultFilter
