'use client'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useState } from 'react'
import { client as createClient } from '../../lib/apollo-client'

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => createClient)

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
