import CanvasSwitcherItem from './CanvasSwitchItem'
import LoadingView from '../util/LoadingView'
import TreeView from '../treeview/TreeView'
import TreeViewItem from '../treeview/TreeViewItem'
import HiddenView from '../util/HiddenView'
import { MoonIcon, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, SunIcon, SunMoon } from 'lucide-react'
import { Button } from '../ui/button'
import { MenuBar, MenuBarLeftItems, MenuBarRightItems } from '../menu_bar/MenuBar'
import { ScrollArea } from '../ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import AppState from '../app/AppState'
import ArrangementView from '../arrangements/ArrangementView'
import Arrangement from '../arrangements/Arrangement'
import Machine from '../machines/Machine'
import MachineView from '../machines/MachineView'
import { useEffect, useState } from 'react'

export type ItemDictionary<T> = { [key: string]: T }

interface CanvasSwitcherArgs {
  appState: AppState;
  setAppState: (newAppState: AppState) => void;
}

export default function CanvasSwitcher({ appState, setAppState }: CanvasSwitcherArgs): JSX.Element {
  const treeItem: TreeViewItem = appState.root.treeViewItem(
    (key: string) => appState.selected === key,
    (key: string) => setAppState(appState.setSelected(key)),
    (key: string) => appState.expanded[key] === true,
    (key: string, expanded: boolean) => setAppState(appState.setExpanded({ ...appState.expanded, [key]: expanded }))
  )
  const { setTheme } = useTheme();
  const showTopBar = appState.allowSidePanelTogglingVisibility || appState.allowTreeViewTogglingVisiblity;
  const mainViewHeight = 'calc(100vh - ' + `${(showTopBar ? 44 : 0) + 20}` + 'px)';
  const child = appState.root.id === appState.selected ? appState.root : appState.root?.findChild(appState.selected);
  const arrangement = appState.arrangements[child.id];
  const machine = appState.machines[child.id];
  return <>
    <div className="h-screen overflow-clip">
      <HiddenView hidden={!showTopBar}>
        <MenuBar>
          <MenuBarLeftItems>
            <HiddenView hidden={!appState.allowTreeViewTogglingVisiblity}>
              <HiddenView hidden={appState.treeViewVisible}>
                <Button variant="ghost" className="p-1 hover:bg-background" onClick={() => setAppState(appState.setTreeViewVisible(true))}>
                  <PanelLeftOpen className="text-secondary-foreground" />
                </Button>
              </HiddenView>
              <HiddenView hidden={!appState.treeViewVisible}>
                <Button variant="ghost" className="p-1 hover:bg-background" onClick={() => setAppState(appState.setTreeViewVisible(false))}>
                  <PanelLeftClose className="text-secondary-foreground" />
                </Button>
              </HiddenView>
            </HiddenView>
          </MenuBarLeftItems>
          <MenuBarRightItems>
            <HiddenView hidden={!appState.allowSidePanelTogglingVisibility}>
              <HiddenView hidden={appState.sidePanelVisible}>
                <Button variant="ghost" className="p-1 hover:bg-background" onClick={() => setAppState(appState.setSidePanelVisible(true))}>
                  <PanelRightOpen className="text-secondary-foreground" />
                </Button>
              </HiddenView>
              <HiddenView hidden={!appState.sidePanelVisible}>
                <Button variant="ghost" className="p-1 hover:bg-background" onClick={() => setAppState(appState.setSidePanelVisible(false))}>
                  <PanelRightClose className="text-secondary-foreground" />
                </Button>
              </HiddenView>
            </HiddenView>
          </MenuBarRightItems>
        </MenuBar>
      </HiddenView>
      <div className="flex flex-row items-start w-full">
        <HiddenView hidden={!appState.treeViewVisible}>
          <TreeView root={treeItem} />
        </HiddenView>
        <ScrollArea aria-orientation='vertical' className="w-full h-full" style={{height: mainViewHeight}}>
          <div className="w-full" style={{height: mainViewHeight}}>
            {arrangement && <ArrangementView
              arrangement={arrangement}
              setArrangement={(arrangement: Arrangement) => {
                setAppState(appState.setArrangement(child.id, arrangement.shallowCopy))
              }}
            />}
            {machine&& <MachineView
              machine={machine}
              setMachine={(machine: Machine) => setAppState(appState.setMachine(child.id, machine.shallowCopy))}
              sidePanelHidden={!appState.sidePanelVisible}
            />}
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
