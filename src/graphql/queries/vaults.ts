// src/graphql/queries/vaults.ts
import { gql } from '@apollo/client'

// Modified query to match the API playground query
export const GET_VAULTS = gql`
  query GetVaultData {
    vaults {
      yearn
      v3
      address
      name
      chainId
      asset {
        name
        symbol
        decimals
        address
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
  }
`
