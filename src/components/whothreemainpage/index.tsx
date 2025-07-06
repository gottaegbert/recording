'use client';

import { LoadingAnimation } from '../animations/loading-animation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Scene } from './scene';

// Dynamic import for 3D particle background
// const DynamicEquivalenceDemo = dynamic(
//   () =>
//     import('../demo/3D/EquivalenceDemo').then((mod) => ({
//       default: mod.EquivalenceDemo,
//     })),
//   {
//     ssr: false,
//     loading: () => <div className="h-full w-full bg-black" />,
//   },
// );

export default function WhoThreeMainPage() {
  const [isLoading, setIsLoading] = useState(true);

  const handleAnimationComplete = () => {
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Core capabilities - focused on WhoThreeLab's expertise
  const capabilities = [
    {
      title: 'Interactive 3D Experiences',
      description:
        'WebGL, Three.js, React Three Fiber powered immersive web experiences',
      icon: '🎨',
    },
    {
      title: 'Creative Engineering',
      description: 'Custom shaders, particle systems, and real-time graphics',
      icon: '✨',
    },
    {
      title: 'Data Experience Design',
      description: 'Interactive data visualization and real-time dashboards',
      icon: '📊',
    },
    {
      title: 'Digital Product Engineering',
      description: 'Full-stack development with modern web technologies',
      icon: '⚡',
    },
  ];

  // Featured work - showcasing lab capabilities
  const featuredWork = [
    {
      title: 'Interactive Museum',
      description: 'Immersive 3D journey through digital artifacts',
      link: '/demo/computers',
      status: 'Experience Design',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      title: 'Particle Systems Lab',
      description: 'Advanced particle simulations and effects',
      link: '#particle-lab',
      status: 'Technical Demo',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
  ];

  // Particle experiment demos
  const particleExperiments = [
    {
      title: 'Wave Patterns',
      description: 'Complex wave interference patterns in 3D space',
      effect: 'Demo 1',
      color: 'from-orange-500/20 to-red-500/20',
      icon: '〜',
    },
    {
      title: 'Physical Systems',
      description: 'Real-time physics simulation with thousands of particles',
      effect: 'Demo 2',
      color: 'from-green-500/20 to-emerald-500/20',
      icon: '⚡',
    },
    {
      title: 'Force Fields',
      description: 'Dynamic force field visualization and interaction',
      effect: 'Demo 3',
      color: 'from-blue-500/20 to-indigo-500/20',
      icon: '🌀',
    },
    {
      title: 'Fluid Dynamics',
      description: 'Particle-based fluid simulation with custom physics',
      effect: 'Demo 4',
      color: 'from-purple-500/20 to-violet-500/20',
      icon: '∞',
    },
    {
      title: 'Shape Morphing',
      description: 'Procedural geometry transformation and evolution',
      effect: 'Demo 5',
      color: 'from-pink-500/20 to-rose-500/20',
      icon: '◇',
    },
    {
      title: 'Emergent Patterns',
      description: 'Self-organizing systems and emergent behaviors',
      effect: 'Demo 6',
      color: 'from-cyan-500/20 to-teal-500/20',
      icon: '◉',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <AnimatePresence>
        {isLoading && (
          <LoadingAnimation onAnimationComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative flex h-screen w-full items-center justify-center">
        {/* 3D Particle Background */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        {/* Navigation */}
        <nav className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-sm font-bold text-black">
                  Siyu
                </div> */}
            <span className="font-medium">WhoThree Lab</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() =>
                window.open('https://github.com/gottaegbert', '_blank')
              }
            >
              <Github className="h-4 w-4" />
            </Button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                <span className="text-sm">
                  UI/Shader/3d Lab for Design Engineers
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
            >
              <span className="bg-gradient-to-r from-gray-300 via-gray-300 to-gray-100 bg-clip-text text-transparent">
                ?3
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-white/70 md:text-2xl"
            >
              Siyu is a full-stack designer and engineer <br />
              <span className="bg-gradient-to-r from-gray-400 via-gray-600 to-gray-100 bg-clip-text text-transparent">
                ?3 Labs
              </span>{' '}
              is his playground exploring the intersection of design and
              technology through interactive experiences.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mb-8 flex flex-wrap justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                <Link href="/workingon">
                  Check
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                onClick={() =>
                  (window.location.href = `mailto:contact@gottaegbert@gmail.com`)
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </Button>
            </motion.div>

            {/* Quick info */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-6 text-sm text-white/60"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {/* Personal location */}
                Milan, Italy
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {/* Personal title */}
                Design Engineer
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-16 w-px bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </section>
      {/* Particle Lab Section - Interactive Experiments */}
      {/* <section id="particle-lab" className="bg-black px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20%' }}
          className="mx-auto max-w-7xl"
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-6xl">
              Particle Laboratory
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/70">
              Interactive experiments exploring different particle behaviors,
              physics simulations, and visual effects.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {particleExperiments.map((experiment, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className={`group h-full cursor-pointer border-white/10 bg-gradient-to-br ${experiment.color} transition-all duration-500 hover:scale-105 hover:border-white/30`}
                >
                  <CardHeader className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                        {experiment.icon}
                      </div>
                      <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs text-white">
                        {experiment.effect}
                      </span>
                    </div>
                    <CardTitle className="mb-2 text-xl text-white group-hover:text-white/90">
                      {experiment.title}
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-white/80">
                      {experiment.description}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-white/70 hover:bg-white/20 hover:text-white"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Explore
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white/60 hover:bg-white/20 hover:text-white"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>


          <motion.div variants={itemVariants} className="mt-16 text-center">
            <div className="inline-flex items-center rounded-full bg-white/5 p-1 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white/70 hover:bg-white/20 hover:text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Run All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white/70 hover:bg-white/20 hover:text-white"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white/70 hover:bg-white/20 hover:text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
       */}
      {/* Capabilities Section - Bento-style grid */}
      <section className="bg-black px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20%' }}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-6xl">What I Do</h2>
            <p className="mx-auto max-w-3xl text-xl text-white/70">
              Combining design thinking with engineering expertise to create
              meaningful digital experiences.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {capabilities.map((capability, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group h-full border-white/10 bg-white/5 p-8 transition-all duration-500 hover:bg-white/10">
                  <CardHeader className="mb-4 p-0">
                    <CardTitle className="text-2xl text-white">
                      {capability.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-white/70">{capability.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
      {/* Design Engineering Practice Section */}
      <section className="border-t border-white/10 bg-black px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20%' }}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-6xl">
              Design Engineering Practice
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-white/70">
              Blending deep technical expertise with a refined aesthetic sense
              to build what&apos;s next. It&apos;s about owning the entire
              experience, from initial concept to a polished, performant
              product.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
          >
            <motion.div variants={itemVariants}>
              <Card className="flex h-full flex-col border-white/10 bg-white/5 p-8">
                <CardHeader className="p-0">
                  <CardTitle className="mb-4 text-xl text-white">
                    Bridging Design & Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-white/70">
                    We work in both Figma and code, creating a seamless workflow
                    that eliminates traditional handoffs and fosters rapid
                    iteration.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="flex h-full flex-col border-white/10 bg-white/5 p-8">
                <CardHeader className="p-0">
                  <CardTitle className="mb-4 text-xl text-white">
                    User-Centric Craftsmanship
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-white/70">
                    Our work is defined by delightful interactions,
                    accessibility, and uncompromising performance, ensuring an
                    exceptional user experience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="flex h-full flex-col border-white/10 bg-white/5 p-8">
                <CardHeader className="p-0">
                  <CardTitle className="mb-4 text-xl text-white">
                    Full-Spectrum Creation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-white/70">
                    From writing GLSL shaders and building 3D scenes to
                    developing robust UI components, we use a diverse toolset to
                    solve complex challenges.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      {/* Featured Work Section */}
      {/* <section
        id="work"
        className="border-t border-white/10 bg-black px-6 py-24"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20%' }}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-6xl">
              Featured Work
            </h2>
            <p className="text-xl text-white/70">
              Selected projects that showcase the intersection of design and
              technology.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid gap-8 md:grid-cols-2"
          >
            {featuredWork.map((work, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className={`group overflow-hidden border-white/20 bg-gradient-to-br ${work.color} transition-all duration-500 hover:scale-105`}
                >
                  <CardHeader className="p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <CardTitle className="text-2xl text-white">
                        {work.title}
                      </CardTitle>
                      <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs text-white">
                        {work.status}
                      </span>
                    </div>
                    <p className="mb-6 text-lg leading-relaxed text-white/80">
                      {work.description}
                    </p>
                    <Button
                      asChild
                      className="border-0 bg-white/20 text-white hover:bg-white/30"
                    >
                      <Link
                        href={work.link}
                        className="flex items-center gap-2"
                      >
                        Explore
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section> */}
      {/* Connect Section */}
      {/* <section className="border-t border-white/10 bg-black px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20%' }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={itemVariants}>
            <h2 className="mb-8 text-4xl font-bold md:text-5xl">
              Start a Project
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-white/70">
              We collaborate with forward-thinking clients to create exceptional
              digital experiences. Whether you need an interactive installation,
              data visualization, or custom web application, let&apos;s discuss
              how we can bring your vision to life.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90"
                onClick={() =>
                  (window.location.href = 'mailto:contact@whothreelab.com')
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Lab
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.open('/demo', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Projects
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section> */}
      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-white/40"
          >
            © 2024 WhoThreeLab — Design Engineering Studio
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
