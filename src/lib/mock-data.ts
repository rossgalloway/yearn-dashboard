// import { TimeseriesData, Vault } from '../types/vault'

// export const mockVaults: Vault[] = [
//   {
//     yearn: true,
//     v3: true,
//     name: 'yvUSDC',
//     chainId: 1,
//     address: '0x1234...5678',
//     asset: {
//       name: 'USD Coin',
//       symbol: 'USDC',
//     },
//     apiVersion: '0.4.3',
//     tvl: {
//       blockTime: '2024-01-27T12:00:00Z',
//       close: 25000000,
//       component: 'tvl',
//       label: 'tvl',
//     },
//     pricePerShare: 1.0542,
//   },
//   {
//     yearn: true,
//     v3: true,
//     name: 'yvETH',
//     chainId: 1,
//     address: '0x5678...1234',
//     asset: {
//       name: 'Ethereum',
//       symbol: 'ETH',
//     },
//     apiVersion: '0.4.3',
//     tvl: {
//       blockTime: '2024-01-27T12:00:00Z',
//       close: 50000000,
//       component: 'tvl',
//       label: 'tvl',
//     },
//     pricePerShare: 1.0891,
//   },
//   {
//     yearn: true,
//     v3: false,
//     name: 'yvDAI',
//     chainId: 1,
//     address: '0x9012...3456',
//     asset: {
//       name: 'Dai Stablecoin',
//       symbol: 'DAI',
//     },
//     apiVersion: '0.3.5',
//     tvl: {
//       blockTime: '2024-01-27T12:00:00Z',
//       close: 15000000,
//       component: 'tvl',
//       label: 'tvl',
//     },
//     pricePerShare: 1.0323,
//   },
// ]

// const generateTimeseriesData = (
//   days: number,
//   baseApy: number,
// ): TimeseriesData[] => {
//   const data: TimeseriesData[] = []
//   const now = new Date()

//   for (let i = days; i >= 0; i--) {
//     const date = new Date(now)
//     date.setDate(date.getDate() - i)

//     // Add some random variation to the APY
//     const randomVariation = (Math.random() - 0.5) * 2 // ±1%
//     const value = (baseApy + randomVariation) / 100 // Convert to decimal

//     data.push({
//       chainId: 1,
//       address: '0x1234...5678',
//       label: 'apy',
//       component: 'net',
//       period: '1d',
//       time: date.toISOString(),
//       value: value,
//     })
//   }

//   return data
// }

// export const getTimeseriesData = (
//   period: string,
//   baseApy: number = 8,
// ): TimeseriesData[] => {
//   const periodDays: Record<string, number> = {
//     '7d': 7,
//     '30d': 30,
//     '90d': 90,
//     '180d': 180,
//     '1y': 365,
//     all: 730,
//   }

//   return generateTimeseriesData(periodDays[period] || 30, baseApy)
// }
