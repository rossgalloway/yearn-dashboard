// src/graphql/queries/vaults.ts
import { gql } from '@apollo/client'

export const GET_VAULTS = gql`
  query GetVaults {
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
    meta {
      displayName
      displaySymbol
      description
      protocols
      token {
        category
        description
        displayName
        displaySymbol
        icon
        type
      }
    }
    strategies
    vaultType
  }
`
