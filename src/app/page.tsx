import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
// import BackgroundShaderComponent from '@/components/demo/Shader/BackgroundShader';
import { ScrollIndicator } from '@/components/scroll-indicator';
import { ComputersPage } from './(demo)/3dpages/computers/page';

export default function HomePage() {
  return (
    <div className="relative flex min-h-[400vh] flex-col">
      {/* <BackgroundShaderComponent /> */}
      <ComputersPage />
      <header className="sticky top-0 z-[50] border-b border-border/40 bg-background/30 backdrop-blur-xl dark:bg-black/[0.2]">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center justify-start transition-opacity duration-300 hover:opacity-85"
          >
            <PanelsTopLeft className="mr-3 h-6 w-6" />
            <span className="font-bold">WHO3-Space</span>
            <span className="sr-only">WHO3-Space</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* 第一屏内容 - 正常显示 */}
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
              {/* <ScrollIndicator /> */}
            </div>
          </section>
        </div>

        {/* 第二屏内容 */}
        <div className="container relative h-screen">
          <section className="mx-auto flex h-full max-w-[980px] flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl font-bold">
              Data Visualization
            </h2>
            <p className="text-center text-lg">Data Visualization</p>
          </section>
        </div>

        {/* 第三屏内容 */}
        <div className="container relative h-screen">
          <section className="mx-auto flex h-full max-w-[980px] flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl font-bold">3D</h2>
            <p className="text-center text-lg">shows the key</p>
          </section>
        </div>

        {/* 第四屏内容 */}
        <div className="container relative h-screen">
          <section className="mx-auto flex h-full max-w-[980px] flex-col items-center justify-center gap-2">
            <h2 className="text-center text-2xl font-bold">Animation</h2>
            <p className="text-center text-lg">UX experience </p>
          </section>
        </div>
      </main>
    </div>
  );
}
