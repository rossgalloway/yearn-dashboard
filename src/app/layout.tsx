'use client'
import { ApolloWrapper } from '@/providers/apollo-provider'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  )
}
