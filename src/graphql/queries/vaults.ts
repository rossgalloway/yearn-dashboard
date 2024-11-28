// src/graphql/queries/vaults.ts
import { gql } from '@apollo/client'
import { VAULT_FIELDS } from '../fragments/vaultFields'

export const GET_VAULTS = gql`
  query GetVaults($chainId: Int) {
    vaults(chainId: $chainId) {
      ...VaultFields
    }
  }
  ${VAULT_FIELDS}
`

export const GET_VAULT = gql`
  query GetVault($chainId: Int, $address: String) {
    vault(chainId: $chainId, address: $address) {
      ...VaultFields
    }
  }
  ${VAULT_FIELDS}
`
