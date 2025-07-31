'use client';

import { motion } from 'motion/react';
import { GridLayout, GridItem } from './GridLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function GridDemo() {
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
            Grid System Demo
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-white/70">
            Demonstrating the 12-column grid system with responsive layouts
          </p>
        </motion.div>

        {/* Full Width */}
        <motion.div variants={containerVariants} className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <motion.div variants={itemVariants} className="col-span-12">
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Full Width (12/12)</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Half and Half */}
        <motion.div variants={containerVariants} className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-6"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Half Width (6/12)</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-6"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Half Width (6/12)</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Thirds */}
        <motion.div variants={containerVariants} className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-4"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Third (4/12)</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-4"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Third (4/12)</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-4"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Third (4/12)</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Asymmetric Layout */}
        <motion.div variants={containerVariants} className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-8"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Main Content (8/12)</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-4"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Sidebar (4/12)</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Complex Layout */}
        <motion.div variants={containerVariants}>
          <div className="grid grid-cols-12 gap-6">
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-3"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Nav (3/12)</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-6"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Content (6/12)</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-12 md:col-span-3"
            >
              <Card className="border-white/10 bg-white/5 p-6">
                <CardContent className="p-0">
                  <p className="text-center text-white">Aside (3/12)</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
