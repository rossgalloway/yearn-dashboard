<!-- markdownlint-disable-file -->

When writing javascript or typescript, always use modern syntax.

When modifying existing code, leave inline comments where code has been modified.

When in chat mode, if editing existing code, do not output the full updated code if it is more than 100 lines long, unless specfically asked to. Focus on the areas where the code has been changed.

This project is a metrics dashboard that visualizes real-time performance data for Yearn Finance vaults. It displays key metrics including APR (Annual Percentage Rate), TVL (Total Value Locked), historical performance charts, and strategy insights for each vault. Built with Next.js 14 and React 18 using TypeScript for type safety, it fetches data through Apollo Client from Yearn's GraphQL API endpoints. The UI is constructed using shadcn/ui components and styled with Tailwind CSS, featuring responsive layouts, dark/light themes, and interactive data visualizations using Recharts. The dashboard includes features like real-time data updates, vault filtering, historical performance tracking, and detailed strategy breakdowns for each vault's investment approach.