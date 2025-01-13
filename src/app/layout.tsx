'use client'
import { ApolloWrapper } from '@/providers/apollo-provider'
import YearnAppBar from '@/components/YearnAppBar'
import '../styles/globals.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <DndProvider backend={HTML5Backend}>
          <div className="min-h-screen flex flex-col">
            <YearnAppBar />
            <main className="flex-grow bg-white">
              <ApolloWrapper>{children}</ApolloWrapper>
            </main>
          </div>
        </DndProvider>
      </body>
    </html>
  )
}
