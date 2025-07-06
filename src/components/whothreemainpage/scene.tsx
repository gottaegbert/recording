'use client';

import dynamic from 'next/dynamic';

const EquivalenceDemo = dynamic(
  () =>
    import('../demo/3D/EquivalenceDemo').then((mod) => ({
      default: mod.EquivalenceDemo,
    })),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-black" />,
  },
);

export function Scene() {
  return <EquivalenceDemo />;
}
