import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { ScrollIndicator } from '@/components/scroll-indicator';
import ComputersPage from '@/components/computers';
import dynamic from 'next/dynamic';

export default function DemoPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="fixed left-4 top-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
        >
          <PanelsTopLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="fixed right-4 top-4 z-50">
        <ModeToggle />
      </div>
      <ScrollIndicator />
      <ComputersPage />
    </main>
  );
}
