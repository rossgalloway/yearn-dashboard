// downloadVaultsData.js
import fs from 'fs'
import fetch from 'node-fetch'

async function fetchVaultsData() {
  const response = await fetch('https://kong.yearn.farm/api/gql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
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
  }  `,
    }),
  })

  const { data } = await response.json()

  return filterYearnVaults(data.vaults)
}

async function saveVaultsData() {
  try {
    const vaultsData = await fetchVaultsData()
    fs.writeFileSync(
      'src/graphql/data/vaultsData.json',
      JSON.stringify(vaultsData, null, 2),
    )
    console.log('Vaults data saved to vaultsData.json')
  } catch (error) {
    console.error('Error fetching or saving vaults data:', error)
  }
}

export const filterYearnVaults = (vaults) =>
  vaults.filter((vault) => vault.yearn)

saveVaultsData()
