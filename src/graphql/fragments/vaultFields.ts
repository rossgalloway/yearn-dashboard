// src/graphql/fragments/vaultFields.ts
import { gql } from '@apollo/client'

export const VAULT_FIELDS = gql`
  fragment VaultFields on Vault {
    yearn
    v3
    address
    name
    chainId
    asset {
      name
      symbol
    }
    apiVersion
    tvl {
      blockTime
      close
      component
      label
    }
    pricePerShare
  }
`
