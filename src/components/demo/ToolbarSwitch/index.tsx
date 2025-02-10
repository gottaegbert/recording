import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Card, CardContent } from '@/components/ui/card';
import {
  PlusIcon,
  BorderDottedIcon,
  CounterClockwiseClockIcon,
  LayersIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';

export default function ToolbarSwitch() {
  const [isSearchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };
  return (
    <Card className="rounded-lg border-none mt-6 overflow-hidden">
      <CardContent className=" flex items-center p-6 relative w-full h-full">
        <Menubar className="flex justify-between w-full h-12">
          <MenubarMenu>
            <MenubarTrigger className="bg-blue-600">
              <PlusIcon className="h-8 w-8 text-white" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>New Incognito Window</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Share</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                  <MenubarItem>Notes</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <MenubarMenu>
              <MenubarTrigger>
                <CounterClockwiseClockIcon className="h-8 w-8" />
              </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>
                <LayersIcon className="h-8 w-8" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem>
                  Always Show Bookmarks Bar
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked>
                  Always Show Full URLs
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem inset>
                  Reload <MenubarShortcut>⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled inset>
                  Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                <MenubarSeparator />
                <MenubarItem inset>Hide Sidebar</MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger onClick={toggleSearch}>
                <MagnifyingGlassIcon className="h-8 w-8" />
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <BorderDottedIcon className="h-8 w-8" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarRadioGroup value="benoit">
                  <MenubarRadioItem value="andy">全屏显示模式</MenubarRadioItem>
                  <MenubarRadioItem value="benoit">
                    常规显示模式
                  </MenubarRadioItem>
                  <MenubarRadioItem value="Luis">
                    最小化显示模式
                  </MenubarRadioItem>
                </MenubarRadioGroup>
                <MenubarSeparator />
                <MenubarItem inset>导入后置顶</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </div>
        </Menubar>
      </CardContent>
    </Card>
  );
}
