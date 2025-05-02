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
import { Instances, Computers } from './computersmodel';
import React, { Suspense } from 'react';
import { MailIcon, ArrowDownIcon } from 'lucide-react';
import { getProject } from '@theatre/core';
import { editable as e, SheetProvider } from '@theatre/r3f';
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension';
import { PerspectiveCamera } from '@theatre/r3f';

const demoSheet = getProject('Demo Project').sheet('Demo Sheet');

// create-react-app
if (process.env.NODE_ENV === 'development') {
  studio.initialize();
  studio.extend(extension);
}

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
      <e.pointLight
        theatreKey="pointLight"
        distance={1.5}
        intensity={1}
        position={[-0.15, 0.7, 0]}
        color="green"
      />
    </group>
  );
};

// 滚动到工作页面
function scrollToWorkingPage() {
  window.location.href = '/workingon';
}

// 主页面组件使用export default以确保只被实例化一次
export default function ComputersPage() {
  return (
    <div className="h-screen w-full">
      <Canvas shadows dpr={[1, 1.5]} eventPrefix="client">
        <SheetProvider sheet={demoSheet}>
          <PerspectiveCamera
            theatreKey="Camera"
            makeDefault
            position={[0, 0, -0]}
            fov={75}
          />
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
          {/* Main scene */}
          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.25} distance={1}>
              <ComputerScene />
              {/* <CombinedCameraRig /> */}
              {/* HTML content that will be scrolled in sync with 3D content */}
              <Scroll html>
                {/* 第一屏：欢迎和标题 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                  <h1 className="mb-4 text-6xl font-bold">ShowCasing</h1>
                  <p className="max-w-2xl text-center text-xl">
                    WHO3 labs is{' '}
                    <span
                      className="underline"
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
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-start justify-center pl-20 text-white">
                  <div className="max-w-md rounded-lg bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-4xl font-bold">Shader Effect</h2>
                    <p className="mb-4">
                      Focusing on unique visual effects. From particle systems
                      and cool shaders, to 3D models and animations, a toast for
                      computer graphics!
                    </p>
                  </div>
                </div>

                {/* 第三屏：数据可视化 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-end justify-center pr-20 text-white">
                  <div className="max-w-md rounded-lg bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-4xl font-bold">
                      Data Visualization
                    </h2>
                    <p className="mb-4">
                      I believe transforming complex data into intuitive,
                      interactive visual storytelling is a future media type.
                      Let&apos;s make data exploration a pleasant journey!
                    </p>
                  </div>
                </div>

                {/* 第四屏：3D内容和工作页面链接 */}
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                  <div className="max-w-md rounded-lg bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-4xl font-bold">3D Interactive</h2>
                    <p className="mb-4">
                      Future is always high-dimensional. Need for immersive 3D
                      worlds and interactive stories will expand from the game
                      industry to the real world.
                    </p>
                  </div>
                </div>
                <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                  <div className="max-w-md rounded-lg bg-black/50 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-4xl font-bold">Chat?</h2>
                    <p className="mb-4">
                      I am open to anyone who wants to have a coffee chat with
                      me.
                    </p>
                    <div className="flex justify-between">
                      <button
                        onClick={scrollToWorkingPage}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-medium transition-all hover:bg-opacity-90"
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                        Showcases
                      </button>
                      <button
                        onClick={() => {
                          window.location.href = 'mailto:gottaegbert@gmail.com';
                        }}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-medium transition-all hover:bg-opacity-90"
                      >
                        <MailIcon className="h-4 w-4" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </Scroll>
            </ScrollControls>
          </Suspense>

          {/* Postprocessing */}
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
        </SheetProvider>
      </Canvas>
    </div>
  );
}
