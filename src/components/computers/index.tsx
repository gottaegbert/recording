'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshReflectorMaterial,
  BakeShadows,
  ScrollControls,
  Scroll,
  useScroll,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  ToneMapping,
} from '@react-three/postprocessing';
import { easing } from 'maath';
import { Instances, Computers } from './computersmodel';
import { Suspense, useState, useEffect } from 'react';
import { MailIcon, ArrowDownIcon } from 'lucide-react';
import { GeistSans } from 'geist/font/sans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollHint } from '../scroll-hint';

// const suzi = import('@pmndrs/assets/models/bunny.glb')

// 使用memo来避免不必要的重新渲染
const ComputerScene = () => {
  return (
    <group position={[0, -1, 0]}>
      <Instances>
        <Computers scale={1} />
      </Instances>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 30]}
          resolution={2048}
          mixBlur={1}
          mixStrength={180}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#202020"
          metalness={0.8}
          mirror={0}
        />
      </mesh>
      <pointLight
        distance={1.5}
        intensity={1}
        position={[-0.15, 0.7, 0]}
        color="green"
      />
    </group>
  );
};

// 联合相机控制系统，同时响应鼠标和滚动
function CombinedCameraRig() {
  const scroll = useScroll();
  const router = useRouter();
  const [mouseInfluence, setMouseInfluence] = useState(0.35);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (scroll.offset >= 1.1 && !isTransitioning) {
        setIsTransitioning(true);
        timeoutId = setTimeout(() => {
          router.push('/workingon');
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [scroll, router, isTransitioning]);

  useFrame((state, delta) => {
    const offset = scroll.offset;

    // 调整相机位置计算
    const scrollX = Math.sin(offset * Math.PI * 2) * 0.1 + 0.3;
    const scrollY = 1.9 + 1.4 * Math.sin(offset * Math.PI * 2);
    const scrollZ = offset * Math.PI * 4 - 11.2;

    const mouseX = (state.pointer.x * state.viewport.width) / 3;
    const mouseY = state.pointer.y / 5;
    const mouseZ = 15;

    const targetX = scrollX * (1 - mouseInfluence) + mouseX * mouseInfluence;
    const targetY = scrollY * (1 - mouseInfluence) + mouseY * mouseInfluence;
    const targetZ = scrollZ * (1 - mouseInfluence) + mouseZ * mouseInfluence;

    easing.damp3(
      state.camera.position,
      [targetX, targetY, targetZ],
      0.5,
      delta,
    );

    const lookX = -offset * Math.sin(offset * Math.PI * 2) * 4;
    const lookY = 1;
    const lookZ = -5;
    state.camera.lookAt(lookX, lookY, lookZ);

    // 检查是否到达最后一页
    if (offset >= 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push('/workingon');
      }, 1000);
    }
  });

  return null;
}

// 主页面组件
export default function ComputersPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  // 处理转场效果
  useEffect(() => {
    return () => {
      // 组件卸载时恢复滚动
      document.body.style.removeProperty('overflow');
    };
  }, []);

  const handleTransitionStart = () => {
    setIsExiting(true);
    // 只在实际转场时禁用滚动
    document.body.style.overflow = 'hidden';
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => document.body.style.removeProperty('overflow')}
    >
      <motion.div
        className="relative h-screen w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onAnimationStart={() => {
          if (isExiting) {
            handleTransitionStart();
          }
        }}
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
          eventPrefix="client"
        >
          <color attach="background" args={['black']} />
          <hemisphereLight intensity={0.15} groundColor="black" />
          <spotLight
            decay={0}
            position={[10, 20, 10]}
            angle={0.12}
            penumbra={1}
            intensity={1.5}
            castShadow
            shadow-mapSize={1024}
          />
          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.25} distance={1}>
              <ComputerScene />
              <CombinedCameraRig />
              <Scroll html>
                {/* 第一屏：欢迎和标题 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                  <h1 className="mb-4 text-6xl font-bold">ShowCasing</h1>
                  <p
                    className={`max-w-2xl text-center text-xl ${GeistSans.className}`}
                  >
                    WHO3 labs is{' '}
                    <span
                      className="cursor-pointer underline"
                      onClick={() => {
                        window.open('https://egbert.eu.org', '_blank');
                      }}
                    >
                      Siyu&apos;s
                    </span>{' '}
                    personal playground. <br />
                    Just show what he can do in blending creativity and
                    technology.
                  </p>
                </div>

                {/* 第二屏：动画和着色器效果 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-start justify-center pl-40 text-white">
                  <Card className="max-w-md border-none bg-black/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-4xl">Shader Effect</CardTitle>
                    </CardHeader>
                    <CardContent className={GeistSans.className}>
                      Focusing on unique visual effects. From particle systems
                      and cool shaders, to 3D models and animations, a toast for
                      computer graphics!
                    </CardContent>
                  </Card>
                </div>

                {/* 第三屏：数据可视化 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-end justify-center pr-40 text-white">
                  <Card className="max-w-md border-none bg-black/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-4xl">
                        Data Visualization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className={GeistSans.className}>
                      I believe transforming complex data into intuitive,
                      interactive visual storytelling is a future media type.
                      Let&apos;s make data exploration a pleasant journey!
                    </CardContent>
                  </Card>
                </div>

                {/* 第四屏：3D内容和工作页面链接 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                  <Card className="max-w-md border-none bg-black/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-4xl">3D Interactive</CardTitle>
                    </CardHeader>
                    <CardContent className={GeistSans.className}>
                      Future is always high-dimensional. Need for immersive 3D
                      worlds and interactive stories will expand from the game
                      industry to the real world.
                    </CardContent>
                  </Card>
                </div>
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                  <Card className="max-w-md border-none bg-black/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-4xl">Chat?</CardTitle>
                    </CardHeader>
                    <CardContent className={GeistSans.className}>
                      I am open to anyone who wants to have a coffee chat with
                      me.
                      <div className="mt-4 flex justify-between">
                        <Button
                          onClick={() => router.push('/workingon')}
                          className="flex items-center gap-2"
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                          Showcases
                        </Button>
                        <Button
                          onClick={() => {
                            window.location.href =
                              'mailto:gottaegbert@gmail.com';
                          }}
                          className="flex items-center gap-2"
                        >
                          <MailIcon className="h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Scroll>
            </ScrollControls>
          </Suspense>

          <EffectComposer>
            <Bloom
              luminanceThreshold={0}
              mipmapBlur
              luminanceSmoothing={0.0}
              intensity={5}
            />
            <DepthOfField
              target={[0, 1, -2]}
              focalLength={0.5}
              bokehScale={15}
              height={700}
            />
            <ToneMapping />
          </EffectComposer>
          <BakeShadows />
        </Canvas>

        {/* 滚动提示 */}
        <ScrollHint />

        {/* 转场遮罩 */}
        <AnimatePresence>
          {isExiting && (
            <motion.div
              className="fixed inset-0 z-50 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
