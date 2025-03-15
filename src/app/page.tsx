import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';
import BackgroundShaderComponent from '@/components/demo/Shader/BackgroundShader';
import { ScrollIndicator } from '@/components/scroll-indicator';

export default function HomePage() {
  return (
    <div className="relative flex min-h-[200vh] flex-col">
      <BackgroundShaderComponent />
      <header className="sticky top-0 z-[50] border-b border-border/40 bg-background/30 backdrop-blur-xl dark:bg-black/[0.2]">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center justify-start transition-opacity duration-300 hover:opacity-85"
          >
            <PanelsTopLeft className="mr-3 h-6 w-6" />
            <span className="font-bold">WHO3-pace</span>
            <span className="sr-only">WHO3-pace</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container relative h-screen">
          <section className="mx-auto flex h-full max-w-[980px] flex-col items-center justify-center gap-2">
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                  WHO3 Collection
                </h1>
                <span className="max-w-[750px] text-center text-lg font-light text-foreground">
                  Daily Practice
                </span>
              </div>
              <ScrollIndicator />
            </div>
          </section>
          {/* <div className="w-full flex justify-center relative">
            <Image
              src="/demo-light-min.png"
              width={1080}
              height={608}
              alt="demo"
              priority
              className="border rounded-xl shadow-sm dark:hidden"
            />
            <Image
              src="/demo-dark-min.png"
              width={1080}
              height={608}
              alt="demo-dark"
              priority
              className="border border-zinc-600 rounded-xl shadow-sm hidden dark:block dark:shadow-gray-500/5"
            />
            <Image
              src="/demo-mobile-light-min.png"
              width={228}
              height={494}
              alt="demo-mobile"
              className="border rounded-xl absolute bottom-0 right-0 hidden lg:block dark:hidden"
            />
            <Image
              src="/demo-mobile-dark-min.png"
              width={228}
              height={494}
              alt="demo-mobile"
              className="border border-zinc-600 rounded-xl absolute bottom-0 right-0 hidden dark:lg:block"
            />
          </div> */}
        </div>
      </main>
      {/* <footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built on top of{' '}
            <Link
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </Link>
            . The source code is available on{' '}
            <Link
              href="https://github.com/salimi-my/shadcn-ui-sidebar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer> */}
    </div>
  );
}
