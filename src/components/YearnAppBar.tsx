'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HamburgerMenu } from './HamburgerMenu'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import update from 'immutability-helper'

interface YearnApp {
  name: string
  url: string
}

const allApps: YearnApp[] = [
  { name: 'Yearn Vaults', url: '/vaults' },
  { name: 'yCRV', url: '/ycrv' },
  { name: 'veYFI', url: '/veyfi' },
  { name: 'Liquid Lockers', url: '/liquid-lockers' },
  { name: 'ReSupply', url: '/resupply' },
  { name: 'Analytics', url: '/analytics' },
  { name: 'Docs', url: '/docs' },
  { name: 'Support', url: '/support' },
]

const ItemType = 'TAB'

function SortableItem({
  id,
  app,
  index,
  activeApp,
  handleAppClick,
  closeTab,
  moveTab,
}: {
  id: string
  app: YearnApp
  index: number
  activeApp: string
  handleAppClick: (url: string, name: string) => void
  closeTab: (event: React.MouseEvent, name: string) => void
  moveTab: (dragIndex: number, hoverIndex: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }
      moveTab(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  const style = {
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={ref}
      style={style}
      className={`
        flex items-center rounded-t-lg px-4 py-2 text-sm cursor-pointer
        ${
          activeApp === app.name
            ? 'bg-white text-blue-600 shadow-inner'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
        transition-all duration-200 ease-in-out
      `}
      onClick={() => handleAppClick(app.url, app.name)}
    >
      <span className="mr-2">{app.name}</span>
      <button
        className={`
          ml-1 p-1 rounded-full
          ${activeApp === app.name ? 'text-blue-600' : 'text-gray-500'}
          hover:bg-gray-400 hover:text-white
          transition-colors duration-200
        `}
        onClick={(e) => {
          e.stopPropagation()
          closeTab(e, app.name)
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export default function YearnAppBar() {
  const [openTabs, setOpenTabs] = useState<YearnApp[]>(() =>
    allApps.slice(0, 5),
  ) // Use function to initialize state
  const [activeApp, setActiveApp] = useState<string>(() => allApps[0].name) // Use function to initialize state
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname
      const currentApp = allApps.find((app) => app.url === currentPath)
      if (currentApp) {
        setActiveApp(currentApp.name)
        if (!openTabs.some((tab) => tab.name === currentApp.name)) {
          setOpenTabs((prev) => [...prev, currentApp])
        }
      }
    }

    handleRouteChange()
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [openTabs])

  const handleAppClick = (url: string, name: string) => {
    console.log('handleAppClick', url, name)
    setActiveApp(name)
    router.push(url)
  }

  const closeTab = (event: React.MouseEvent, name: string) => {
    console.log('closeTab', name)
    event.stopPropagation()
    setOpenTabs((prev) => prev.filter((tab) => tab.name !== name))
    if (activeApp === name) {
      const newActiveTab =
        openTabs[openTabs.findIndex((tab) => tab.name === name) - 1] ||
        openTabs[0]
      if (newActiveTab) {
        router.push(newActiveTab.url)
        setActiveApp(newActiveTab.name)
      }
    }
  }

  const addNewTab = (app: YearnApp) => {
    console.log('addNewTab', app)
    if (!openTabs.some((tab) => tab.name === app.name)) {
      setOpenTabs((prev) => [...prev, app])
    }
    setActiveApp(app.name)
    router.push(app.url)
  }

  const moveTab = (dragIndex: number, hoverIndex: number) => {
    const dragTab = openTabs[dragIndex]
    setOpenTabs((prevTabs) =>
      update(prevTabs, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragTab],
        ],
      }),
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="sticky top-0 flex items-stretch space-x-1 p-1 pb-0 overflow-x-auto">
        <HamburgerMenu addNewTab={addNewTab} />
        <div className="flex items-stretch space-x-1 flex-grow">
          {openTabs.map((app, index) => (
            <SortableItem
              key={app.name}
              id={app.name}
              app={app}
              index={index}
              activeApp={activeApp}
              handleAppClick={handleAppClick}
              closeTab={closeTab}
              moveTab={moveTab}
            />
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {allApps
              .filter((app) => !openTabs.some((tab) => tab.name === app.name))
              .map((app) => (
                <DropdownMenuItem
                  key={app.name}
                  onSelect={() => addNewTab(app)}
                >
                  {app.name}
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem disabled>Custom (Coming Soon)</DropdownMenuItem>
            <DropdownMenuItem disabled>
              Save/Load (Coming Soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DndProvider>
  )
}
