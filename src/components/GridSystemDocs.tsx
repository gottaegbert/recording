'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function GridSystemDocs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const gridFeatures = [
    {
      title: 'CSS Variables',
      description:
        'Grid system powered by CSS custom properties for consistent spacing and layout',
      code: `--grid--app-margin: 2rem;
--grid--app-columns: repeat(12, 1fr);
--grid--app-gutter: 1.5rem;`,
    },
    {
      title: 'Responsive Design',
      description:
        'Adaptive grid margins and gutters across different screen sizes',
      code: `/* Mobile */
--grid--mobile-margin: 1rem;
/* Tablet */
--grid--tablet-margin: 1.5rem;
/* Desktop */
--grid--desktop-margin: 2rem;`,
    },
    {
      title: 'Visual Grid Overlay',
      description:
        'Toggle-able grid overlay for precise alignment during development',
      code: `.app-grid-overlay {
  display: grid;
  grid-template-columns: var(--grid--app-columns);
  gap: var(--grid--app-gutter);
}`,
    },
    {
      title: 'Utility Functions',
      description:
        'Helper functions for responsive grid classes and positioning',
      code: `gridResponsive(12, 6, 4)
gridSpan(6, 'md')
gridStart(3, 'lg')`,
    },
  ];

  return (
    <section className="bg-black py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20%' }}
        className="mx-auto max-w-7xl px-6"
      >
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            Grid System Architecture
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-white/70">
            A comprehensive 12-column grid system built with CSS variables,
            responsive design principles, and developer-friendly utilities
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-12 gap-8"
        >
          {gridFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="col-span-12 lg:col-span-6"
            >
              <Card className="h-full border-white/10 bg-white/5 p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xl text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="mb-4 text-white/70">{feature.description}</p>
                  <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 text-sm text-green-400">
                    <code>{feature.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16">
          <Card className="border-white/10 bg-white/5 p-8">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-2xl text-white">
                Usage Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Basic Grid Layout
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 text-sm text-blue-400">
                    <code>{`<div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 md:col-span-6">
    Half width on desktop
  </div>
  <div className="col-span-12 md:col-span-6">
    Half width on desktop
  </div>
</div>`}</code>
                  </pre>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Grid Toggle Component
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-black/50 p-4 text-sm text-blue-400">
                    <code>{`import GridToggle from '@/components/GridToggle';

<GridToggle />
// Shows visual grid overlay`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
