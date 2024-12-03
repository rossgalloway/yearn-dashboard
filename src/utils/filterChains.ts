// src/utils/filterChains.ts
import { Vault } from '@/types/vaultTypes'
import { ChainId } from '@/constants/chains'

export const getAvailableChains = (vaults: Vault[]): ChainId[] => {
  const chainIds = vaults.map((vault) => vault.chainId)
  return Array.from(new Set(chainIds)) as ChainId[]
}
