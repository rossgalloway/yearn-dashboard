export type ChainId = 1 | 10 | 100 | 137 | 250 | 8453 | 42161

export const CHAIN_ID_TO_NAME: Record<number, string> = {
  1: 'Mainnet',
  10: 'Optimism',
  100: 'GnosisChain',
  137: 'Polygon',
  250: 'Fantom',
  8453: 'Base',
  42161: 'Arbitrum',
}

export const CHAIN_ID_TO_ICON: Record<number, string> = {
  1: 'https://assets.smold.app/api/chains/1/logo-32.png',
  10: 'https://assets.smold.app/api/chains/10/logo-32.png',
  100: 'https://assets.smold.app/api/chains/100/logo-32.png',
  137: 'https://assets.smold.app/api/chains/137/logo-32.png',
  250: 'https://assets.smold.app/api/chains/250/logo-32.png',
  8453: 'https://assets.smold.app/api/chains/8453/logo-32.png',
  42161: 'https://assets.smold.app/api/chains/42161/logo-32.png',
}

export const CHAIN_ID_TO_BLOCK_EXPLORER: Record<number, string> = {
  1: 'https://etherscan.io',
  10: 'https://optimistic.etherscan.io',
  100: 'https://gnosisscan.io/',
  137: 'https://polygonscan.com',
  250: 'https://ftmscan.com',
  8453: 'https://basescan.org/',
  42161: 'https://arbiscan.io',
}
