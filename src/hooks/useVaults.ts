// src/hooks/useVaults.ts
import { useQuery } from '@apollo/client'
import { GET_VAULTS } from '@/graphql/queries/vaults'
import { filterYearnVaults } from '../graphql/filters/vaultFilters'
import type { Vault } from '@/types/vaultTypes'

interface VaultsQueryResult {
  vaults: Vault[]
}

interface UseVaultsReturn {
  vaults: Vault[] | undefined
  loading: boolean
  error: any
}

export function useVaults(chainId?: number): UseVaultsReturn {
  const { data, loading, error } = useQuery<VaultsQueryResult>(GET_VAULTS, {
    variables: { chainId },
  })

  // Filter vaults if data exists
  const filteredVaults = data?.vaults
    ? filterYearnVaults(data.vaults)
    : undefined

  return {
    vaults: filteredVaults,
    loading,
    error,
  }
}
