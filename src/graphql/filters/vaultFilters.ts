// src/graphql/filters/vaultFilters.ts
import type { Vault } from '@/types/vault'

export const filterActiveVaults = (vaults: Vault[]) =>
  vaults.filter((vault) => vault.yearn)

export const filterByChain = (vaults: Vault[], chainId: number) =>
  vaults.filter((vault) => vault.chainId === chainId)
