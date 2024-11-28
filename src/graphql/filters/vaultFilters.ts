// src/graphql/filters/vaultFilters.ts
import type { Vault } from '@/types/vaultTypes'

export const filterYearnVaults = (vaults: Vault[]) =>
  vaults.filter((vault) => vault.yearn)

export const filterByChain = (vaults: Vault[], chainId: number) =>
  vaults.filter((vault) => vault.chainId === chainId)
