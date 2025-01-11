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
  // console.log('fetching vaults data with useVaults hook')
  const { data, loading, error } = useQuery<VaultsQueryResult>(GET_VAULTS)

  // Filter vaults if data exists
  const yearnVaults = data?.vaults ? filterYearnVaults(data.vaults) : undefined

  const availableChains = getAvailableChains(yearnVaults || [])

  console.log('vaults', yearnVaults)

  return {
    vaults: yearnVaults,
    availableChains,
    loading,
    error,
  }
}
