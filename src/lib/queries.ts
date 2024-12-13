export async function fetchVaultData(yDaemon: string, address: string) {
  const response = await fetch(`${yDaemon}1/vaults/${address}`)
  if (!response.ok) {
    console.error('Failed to fetch token price')
    return null
  }
  const data = await response.json()
  return data
}
