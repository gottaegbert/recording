import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
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
  FileIcon,
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
    <Card className="mt-6 overflow-hidden rounded-lg border-none">
      <CardContent className="relative flex h-full w-full items-center justify-center p-0">
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] flex-col items-center justify-center">
          <motion.div
            layout
            className="relative flex overflow-hidden"
            key="main"
          >
            <Menubar className="flex h-16 w-[450px] rounded-none p-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {!isSearchVisible && !isProcessedlistVisible ? (
                  <motion.div
                    className="flex w-full justify-between gap-24 p-2"
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
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
                          <MenubarCheckboxItem checked>
                            单次加工
                          </MenubarCheckboxItem>
                          <MenubarItem inset>单文件加工</MenubarItem>
                          <MenubarItem inset>按列表加工</MenubarItem>
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
                          <MenubarCheckboxItem disabled>
                            全屏显示模式
                          </MenubarCheckboxItem>
                          <MenubarCheckboxItem checked>
                            常规显示模式
                          </MenubarCheckboxItem>
                          <MenubarCheckboxItem>
                            最小化显示模式
                          </MenubarCheckboxItem>
                          <MenubarSeparator />
                          <MenubarItem inset>导入后置顶</MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </div>
                  </motion.div>
                ) : isSearchVisible ? (
                  <motion.div
                    className="flex w-full justify-between gap-24"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    key="search-toolbar"
                    layout
                  >
                    <div>
                      <div className="flex w-[450px] items-center justify-between p-2">
                        <div className="flex-12 relative gap-24">
                          <MagnifyingGlassIcon className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 transform" />
                          <Input
                            type="email"
                            placeholder="请输入搜索内容"
                            className="pl-24"
                          />
                        </div>
                        <div className="flex-4 relative">
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
                    className="flex h-full w-full justify-between gap-24"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    key="processed-toolbar"
                    layout
                  >
                    <div className="flex w-[450px] items-center justify-between bg-blue-600 p-2">
                      <div className="flex-12 relative text-white">
                        已加工列表/零件模式
                      </div>
                      <Button
                        className="text-white"
                        variant="ghost"
                        onClick={toggleProcessedlist}
                      >
                        退出
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Menubar>
          </motion.div>
          <div className="flex h-80 w-full items-center justify-center space-x-20 bg-blue-200 text-blue-600">
            <FileIcon className="h-8 w-8" />
            <div className="flex flex-col">File List</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
