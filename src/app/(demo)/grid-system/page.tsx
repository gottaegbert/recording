import { GridDemo } from '@/components/GridDemo';
import { GridSystemDocs } from '@/components/GridSystemDocs';
import GridToggle from '@/components/GridToggle';

export default function GridSystemPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Navigation with Grid Toggle */}
      <nav className="fixed left-6 right-6 top-6 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-white">Grid System Demo</span>
        </div>
        <div className="flex items-center gap-3">
          <GridToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex h-screen items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-6 text-6xl font-bold text-white md:text-8xl lg:text-9xl">
            Grid System
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-white/70 md:text-2xl">
            基于CSS变量的12列网格系统，支持响应式设计和可视化网格覆盖层
          </p>
        </div>
      </section>

      {/* Grid Demo */}
      <GridDemo />

      {/* Grid System Documentation */}
      <GridSystemDocs />
    </main>
  );
}
