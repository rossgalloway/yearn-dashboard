'use client'

import { ApolloProvider } from '@apollo/client'
import { client } from '@/lib/apollo-client'
import { Suspense } from 'react'

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Suspense>
  )
}
