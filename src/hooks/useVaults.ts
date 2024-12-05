// src/hooks/useVaults.ts
import { useQuery } from '@apollo/client'
import { GET_VAULTS } from '@/graphql/queries/vaults'
import { filterYearnVaults } from '../graphql/filters/vaultFilters'
import type { Vault } from '@/types/vaultTypes'
import { getAvailableChains } from '../utils/filterChains'

interface VaultsQueryResult {
  vaults: Vault[]
}

interface UseVaultsReturn {
  vaults: Vault[] | undefined
  availableChains: number[]
  loading: boolean
  error: any
}

export function useVaults(): UseVaultsReturn {
  const { data, loading, error } = useQuery<VaultsQueryResult>(GET_VAULTS)

  // Filter vaults if data exists
  const filteredVaults = data?.vaults
    ? filterYearnVaults(data.vaults)
    : undefined

  const availableChains = getAvailableChains(filteredVaults || [])

  return {
    vaults: filteredVaults,
    availableChains,
    loading,
    error,
  }
}
