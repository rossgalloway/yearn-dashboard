import { gql } from '@apollo/client'
import { Vault } from '../types/vault'

export const GET_VAULTS = gql`
  query GetVaultData {
    vaults {
      yearn
      v3
      name
      chainId
      address
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
  }
`

export const GET_APY_FOR_VAULT = gql`
  query ApyQuery(
    $label: String!
    $chainId: Int
    $address: String
    $limit: Int
    $component: String
  ) {
    timeseries(
      label: $label
      chainId: $chainId
      address: $address
      limit: $limit
      component: $component
    ) {
      chainId
      address
      label
      component
      period
      time
      value
    }
  }
`

export const filterVaults = (vaults: Vault[]) =>
  vaults.filter((vault) => vault.yearn)
