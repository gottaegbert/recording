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
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { AnimatePresence, motion } from 'motion/react';
export default function ToolbarSwitch() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isProcessedlistVisible, setProcessedlistVisble] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  const toggleProcessedlist = () => {
    setProcessedlistVisble(!isProcessedlistVisible);
  };

  return (
    <Card className="rounded-lg border-none mt-6 overflow-hidden">
      <CardContent className="flex items-center p-6 relative w-full h-full">
        <motion.div layout className="w-full overflow-hidden p-0">
          <Menubar className="relative flex w-full  h-16 p-0 rounded-none ">
            <AnimatePresence mode="popLayout">
              {!isSearchVisible && !isProcessedlistVisible ? (
                <motion.div
                  className="flex gap-24 w-full justify-center "
                  initial={{ y: 60 }}
                  animate={{ y: 0 }}
                  exit={{ y: 60 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  key="dev-toolbar"
                  layout
                >
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <MenubarMenu>
                      <MenubarTrigger onClick={toggleProcessedlist}>
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
                          <MenubarRadioItem value="andy">
                            全屏显示模式
                          </MenubarRadioItem>
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
                </motion.div>
              ) : isSearchVisible ? (
                <motion.div
                  className="flex gap-6 w-full"
                  initial={{ y: -60 }}
                  animate={{ y: 0 }}
                  exit={{ y: -60 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  key="search-toolbar"
                  layout
                >
                  <div className="transition-all duration-300 ease-in-out w-full">
                    <div className="flex w-full space-x-8 items-center justify-center">
                      <div className="relative flex-12">
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8" />
                        <Input
                          type="email"
                          placeholder="请输入搜索内容"
                          className="pl-12"
                        />
                      </div>
                      <div className="relative flex-4">
                        <MixerHorizontalIcon className="h-8 w-8" />
                      </div>
                      <Button variant="outline" onClick={toggleSearch}>
                        取消
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex gap-6 h-full w-full"
                  initial={{ y: -60 }}
                  animate={{ y: 0 }}
                  exit={{ y: -60 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  key="processed-toolbar"
                  layout
                >
                  <div className="flex w-full space-x-20 items-center justify-center bg-blue-600">
                    <div className="relative flex-12 text-white">
                      已加工列表/零件模式
                    </div>
                    <Button variant="outline" onClick={toggleProcessedlist}>
                      退出
                    </Button>
                    <div className="relative flex-4"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Menubar>
        </motion.div>
      </CardContent>
    </Card>
  );
}
