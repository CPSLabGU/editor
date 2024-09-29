import CanvasSwitcherItem from './CanvasSwitchItem'
import LoadingView from '../util/LoadingView'
import TreeView from '../treeview/TreeView'
import TreeViewItem from '../treeview/TreeViewItem'
import HiddenView from '../util/HiddenView'
import { MoonIcon, PanelLeftClose, PanelLeftOpen, SunIcon, SunMoon } from 'lucide-react'
import { Button } from '../ui/button'
import { MenuBar, MenuBarLeftItems, MenuBarRightItems } from '../menu_bar/MenuBar'
import { ScrollArea } from '../ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useTheme } from 'next-themes'

export type ItemDictionary<T> = { [key: string]: T }

interface CanvasSwitcherArgs {
  item: CanvasSwitcherItem
  allowTogglingVisibilty: boolean
  sidePanelVisible: boolean
  setSidePanelVisible: (visible: boolean) => void
  getSelected: () => string | null
  setSelected: (key: string) => void
  getExpanded: () => ItemDictionary<boolean>
  setExpanded: (dictionary: ItemDictionary<boolean>) => void
}

export default function CanvasSwitcher({
  item,
  allowTogglingVisibilty,
  sidePanelVisible,
  setSidePanelVisible,
  getSelected,
  setSelected,
  getExpanded,
  setExpanded
}: CanvasSwitcherArgs): JSX.Element {
  const treeItem: TreeViewItem = item.treeViewItem(
    (key: string) => getSelected() === key,
    (key: string) => setSelected(key),
    (key: string) => getExpanded()[key] === true,
    (key: string, expanded: boolean) => setExpanded({ ...getExpanded(), [key]: expanded })
  )
  const { setTheme } = useTheme();
  const selectedKey = getSelected()
  const selectedView: (() => JSX.Element | null) | undefined =
    selectedKey !== null ? item.findChild(selectedKey)?.view : undefined
  return <>
    <div className="h-screen overflow-clip">
      <MenuBar>
        <MenuBarLeftItems>
          <HiddenView hidden={!allowTogglingVisibilty}>
            <HiddenView hidden={sidePanelVisible}>
              <Button variant="ghost" className="p-1 hover:bg-background" onClick={() => setSidePanelVisible(true)}>
                <PanelLeftOpen className="text-secondary-foreground" />
              </Button>
            </HiddenView>
            <HiddenView hidden={!sidePanelVisible}>
              <Button variant="ghost" className="p-1 hover:bg-background" onClick={() => setSidePanelVisible(false)}>
                <PanelLeftClose className="text-secondary-foreground" />
              </Button>
            </HiddenView>
          </HiddenView>
        </MenuBarLeftItems>
      </MenuBar>
      <div className="flex flex-row items-start w-full h-[calc(100vh-64px)]">
        <HiddenView hidden={!sidePanelVisible}>
          <TreeView root={treeItem} />
        </HiddenView>
        <ScrollArea aria-orientation='vertical' className="h-[calc(100vh-64px)] p-4 w-full *:h-full">
          <div className="w-full h-[calc(100vh-64px)]">
            {selectedView !== undefined && <LoadingView subView={selectedView} />}
          </div>
        </ScrollArea>
      </div>
      <MenuBar variant="sm">
        <MenuBarRightItems>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-3 h-3 p-0 hover:bg-secondary-foreground">
                <SunIcon className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-secondary-foreground hover:text-secondary" />
                <MoonIcon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-secondary-foreground hover:text-secondary" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </MenuBarRightItems>
      </MenuBar>
    </div>
  </>
}
