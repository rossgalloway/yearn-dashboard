// downloadVaultsData.mjs
import fs from 'fs'
import fetch from 'node-fetch'

const queryVaults = `
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

const queryAPY = `
  query ApyQuery($label: String!, $chainId: Int, $address: String, $limit: Int, $component: String) {
    timeseries(label: $label, chainId: $chainId, address: $address, limit: $limit, component: $component) {
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

const queryTVL = `
  query TvlQuery($label: String!, $chainId: Int, $address: String, $limit: Int) {
    timeseries(label: $label, chainId: $chainId, address: $address, limit: $limit) {
      chainId
      address
      label
      period
      time
      value
    }
  }
`

async function fetchGraphQLData(query, variables) {
  const response = await fetch('https://kong.yearn.farm/api/gql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }), // Use variables for dynamic data
  })

  const { data } = await response.json()
  return data
}

async function fetchVaultsData() {
  const data = await fetchGraphQLData(queryVaults)
  return filterYearnVaults(data.vaults)
}

async function fetchAPYData(chainId, address) {
  const variables = {
    label: 'apy-bwd-delta-pps',
    chainId,
    address,
    limit: 1000,
    component: 'weeklyNet',
  }
  const data = await fetchGraphQLData(queryAPY, variables)
  return data.timeseries
}

async function fetchTVLData(chainId, address) {
  const variables = {
    label: 'tvl',
    chainId,
    address,
    limit: 1000,
  }
  const data = await fetchGraphQLData(queryTVL, variables)
  return data.timeseries
}

async function saveVaultsData() {
  try {
    const vaultsData = await fetchVaultsData()
    fs.writeFileSync(
      'src/graphql/data/vaultsData.json',
      JSON.stringify(vaultsData, null, 2),
    )
    console.log('Vaults data saved to vaultsData.json')

    const croppedVaultsData = vaultsData.slice(0, 10)
    fs.writeFileSync(
      'src/graphql/data/vaultsData_cropped.json',
      JSON.stringify(croppedVaultsData, null, 2),
    )
    console.log('Cropped vaults data saved to vaultsData_cropped.json')

    for (const vault of croppedVaultsData) {
      const { chainId, address } = vault
      const apyData = await fetchAPYData(chainId, address)
      const tvlData = await fetchTVLData(chainId, address)

      const cleanApyData = apyData.map(({ chainId, address, ...rest }) => rest)
      const cleanTvlData = tvlData.map(({ chainId, address, ...rest }) => rest)

      const combinedData = {
        chainId,
        address,
        apy: cleanApyData,
        tvl: cleanTvlData,
      }
      fs.writeFileSync(
        `src/graphql/data/${address}.json`,
        JSON.stringify(combinedData, null, 2),
      )
      console.log(`Data for vault ${address} saved to ${address}.json`)
    }
  } catch (error) {
    console.error('Error fetching or saving vaults data:', error)
  }
}

const filterYearnVaults = (vaults) => vaults.filter((vault) => vault.yearn)

saveVaultsData()
