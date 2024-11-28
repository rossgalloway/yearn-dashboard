// src/graphql/queries/timeseries.ts
import { gql } from '@apollo/client'

export const GET_VAULT_TIMESERIES = gql`
  query VaultTimeseries(
    $chainId: Int!
    $address: String!
    $label: String!
    $component: String!
    $limit: Int
  ) {
    timeseries(
      chainId: $chainId
      address: $address
      label: $label
      component: $component
      limit: $limit
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
