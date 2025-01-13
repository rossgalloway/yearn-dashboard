'use client'
import { X, Twitter, MessageCircle, Send } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface YearnApp {
  name: string
  url: string
  icon: React.ReactNode
}

const allApps: YearnApp[] = [
  {
    name: 'Yearn Vaults',
    url: '/vaults',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'yCRV',
    url: '/ycrv',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'veYFI',
    url: '/veyfi',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'Liquid Lockers',
    url: '/liquid-lockers',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'ReSupply',
    url: '/resupply',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'Analytics',
    url: '/analytics',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'Docs',
    url: '/docs',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
  {
    name: 'Support',
    url: '/support',
    icon: <span className="w-4 h-4 bg-blue-500 rounded-full mr-2" />,
  },
]

interface HamburgerMenuProps {
  addNewTab: (app: YearnApp) => void
}

export function HamburgerMenu({ addNewTab }: HamburgerMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <span className="sr-only">Open menu</span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full mr-2" />
            Yearn
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-8">
          {allApps.map((app) => (
            <SheetTrigger key={app.name} asChild>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => addNewTab(app)}
              >
                {app.icon}
                {app.name}
              </Button>
            </SheetTrigger>
          ))}
        </nav>
        <div className="flex justify-center space-x-4 absolute bottom-8 left-0 right-0">
          <Button variant="ghost" size="icon">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
