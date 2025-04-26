'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  MeshReflectorMaterial,
  BakeShadows,
  ScrollControls,
  Scroll,
  useScroll,
  PerspectiveCamera,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from '@react-three/postprocessing';
import { easing } from 'maath';
import { Instances, Computers } from './computersmodel';
import * as THREE from 'three';
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from 'react';
// const suzi = import('@pmndrs/assets/models/bunny.glb')

// // 定义相机位置和视角
// const cameraPositions = [
//   {
//     position: [0, 1, 5], // 初始俯视角度
//     lookAt: [-3.15, 0.75, -10],
//     fov: 45,
//   },
//   {
//     position: [-4, 3, 3], // 左侧俯视角度
//     lookAt: [1, 0, -2],
//     fov: 50,
//   },
//   {
//     position: [8, 2, 40], // 右侧侧视角度
//     lookAt: [-1, 10, -10],
//     fov: 70,
//   },
//   {
//     position: [6, 2, 40], // 背面俯视
//     lookAt: [-1, 10, -10],
//     fov: 70,
//   },
// ];

// // 添加用于调试的滚动指示器
// function ScrollIndicators() {
//   return (
//     <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2">
//       {cameraPositions.map((_, index) => (
//         <div
//           key={index}
//           className="h-3 w-3 cursor-pointer rounded-full bg-white/50 hover:bg-white"
//           onClick={() => {
//             // 点击滚动到对应位置
//             window.scrollTo({
//               top: window.innerHeight * index,
//               behavior: 'smooth',
//             });
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// 使用memo来避免不必要的重新渲染
const ComputerScene = memo(() => {
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
});

// 联合相机控制系统，同时响应鼠标和滚动
function CombinedCameraRig() {
  const scroll = useScroll();
  const [mouseInfluence, setMouseInfluence] = useState(0.7);

  useFrame((state, delta) => {
    const offset = scroll.offset;

    // 调整相机位置计算
    const scrollX = Math.sin(offset * Math.PI * 2) * 4;
    const scrollY = -offset * 8 + 3;
    const scrollZ = Math.cos(offset * Math.PI * 2) * 4 + 5;

    const mouseX = -1 - (state.pointer.x * state.viewport.width) / 3;
    const mouseY = (2 - state.pointer.y) / 2;
    const mouseZ = 5; // 增加基础Z距离

    const targetX = scrollX * (1 - mouseInfluence) + mouseX * mouseInfluence;
    const targetY = scrollY * (1 - mouseInfluence) + mouseY * mouseInfluence;
    const targetZ = scrollZ * (1 - mouseInfluence) + mouseZ * mouseInfluence;

    easing.damp3(
      state.camera.position,
      [targetX, targetY, targetZ],
      0.5, // 减小阻尼使相机移动更快
      delta,
    );

    const lookX = 0;
    const lookY = 0;
    const lookZ = 0;
    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

// 给组件一个displayName以便于调试
ComputerScene.displayName = 'ComputerScene';

// 主页面组件使用export default以确保只被实例化一次
export function ComputersPage() {
  return (
    <div className="h-screen w-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 2, 8], fov: 75, near: 0.1, far: 2000 }}
        eventPrefix="client"
      >
        <color attach="background" args={['black']} />
        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.45} groundColor="black" />
        <spotLight
          decay={0}
          position={[10, 20, 10]}
          angle={0.12}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.25} distance={1}>
            <ComputerScene />
            <CombinedCameraRig />
            {/* HTML content that will be scrolled in sync with 3D content */}
            <Scroll html>
              {/* 添加滚动内容 */}
              <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                <h1 className="mb-4 text-6xl font-bold">3D Computers</h1>
                <p className="text-xl">
                  Scroll to explore and move your mouse to look around
                </p>
              </div>

              <div className="pointer-events-auto flex h-screen w-screen flex-col items-start justify-center pl-20 text-white">
                <div className="max-w-md rounded-lg bg-black/50 p-6">
                  <h2 className="mb-4 text-4xl font-bold">
                    Vintage Technology
                  </h2>
                  <p className="mb-4">
                    Explore the evolution of computing machines through this
                    interactive 3D experience.
                  </p>
                </div>
              </div>

              <div className="pointer-events-auto flex h-screen w-screen flex-col items-end justify-center pr-20 text-white">
                <div className="max-w-md rounded-lg bg-black/50 p-6">
                  <h2 className="mb-4 text-4xl font-bold">Hardware Details</h2>
                  <p className="mb-4">
                    Notice the intricate details of these historical computing
                    devices.
                  </p>
                </div>
              </div>

              <div className="pointer-events-auto flex h-screen w-screen flex-col items-center justify-center text-white">
                <div className="max-w-md rounded-lg bg-black/50 p-6">
                  <h2 className="mb-4 text-4xl font-bold">Digital Heritage</h2>
                  <p className="mb-4">
                    These machines represent an important part of our digital
                    heritage.
                  </p>
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
        </EffectComposer>
        <BakeShadows />
      </Canvas>
    </div>
  );
}
