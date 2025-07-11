import Link from 'next/link';
import { PanelsTopLeft } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { ScrollIndicator } from '@/components/scroll-indicator';
import ComputersPage from '@/components/computers';
import dynamic from 'next/dynamic';
import WhoThreeMainPage from '@/components/whothreemainpage';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <WhoThreeMainPage />
    </main>
  );
}
