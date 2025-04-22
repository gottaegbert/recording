'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  MeshReflectorMaterial,
  BakeShadows,
  useHelper,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  // DotScreen,
  // TiltShift2,
} from '@react-three/postprocessing';
import { easing } from 'maath';
import { Instances, Computers } from './computers';
import { useControls, folder, Leva } from 'leva';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
// const suzi = import('@pmndrs/assets/models/bunny.glb')

// 定义相机位置和视角
const cameraPositions = [
  {
    position: [0, 1, 5], // 初始俯视角度
    lookAt: [-3.15, 0.75, -10],
    fov: 45,
  },
  {
    position: [-4, 3, 3], // 左侧俯视角度
    lookAt: [1, 0, -2],
    fov: 50,
  },
  {
    position: [8, 2, 40], // 右侧侧视角度
    lookAt: [-1, 10, -10],
    fov: 70,
  },
  {
    position: [6, 2, 40], // 背面俯视
    lookAt: [-1, 10, -10],
    fov: 70,
  },
];

// 滚动触发相机控制组件
function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      // 计算滚动百分比
      const scrollPercent =
        window.scrollY / (window.innerHeight * cameraPositions.length);
      // 限制在0-1之间
      const normalizedScroll = Math.max(0, Math.min(1, scrollPercent));
      // 更新滚动引用值
      scrollRef.current = normalizedScroll;

      // 计算当前应该显示哪个相机位置
      const targetPos = normalizedScroll * (cameraPositions.length - 1);
      const newTargetIndex = Math.min(
        cameraPositions.length - 1,
        Math.floor(targetPos),
      );

      // 计算两个位置之间的过渡进度
      const progress = targetPos - newTargetIndex;

      // 更新状态
      if (newTargetIndex !== targetIndex) {
        setPrevIndex(targetIndex);
        setTargetIndex(newTargetIndex);
      }
      setTransitionProgress(progress);
    };

    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetIndex]);

  // 在帧更新时平滑插值相机位置
  useFrame((state, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    // 获取当前和目标相机设置
    const current = cameraPositions[targetIndex];
    const next =
      cameraPositions[Math.min(cameraPositions.length - 1, targetIndex + 1)];

    // 在当前位置和下一个位置之间插值
    const posX = THREE.MathUtils.lerp(
      current.position[0],
      next.position[0],
      transitionProgress,
    );
    const posY = THREE.MathUtils.lerp(
      current.position[1],
      next.position[1],
      transitionProgress,
    );
    const posZ = THREE.MathUtils.lerp(
      current.position[2],
      next.position[2],
      transitionProgress,
    );

    const lerpLookAt = [
      THREE.MathUtils.lerp(
        current.lookAt[0],
        next.lookAt[0],
        transitionProgress,
      ),
      THREE.MathUtils.lerp(
        current.lookAt[1],
        next.lookAt[1],
        transitionProgress,
      ),
      THREE.MathUtils.lerp(
        current.lookAt[2],
        next.lookAt[2],
        transitionProgress,
      ),
    ];

    const lerpFov = THREE.MathUtils.lerp(
      current.fov,
      next.fov,
      transitionProgress,
    );

    // 平滑设置相机位置和视角 - 修复类型错误
    easing.damp3(
      camera.position,
      [posX, posY, posZ] as [number, number, number],
      0.75,
      delta,
    );

    // 更新相机朝向
    const lookAtVector = new THREE.Vector3(
      lerpLookAt[0],
      lerpLookAt[1],
      lerpLookAt[2],
    );
    camera.lookAt(lookAtVector);

    // 更新FOV
    easing.damp(camera, 'fov', lerpFov, 0.75, delta);

    camera.updateProjectionMatrix();
  });

  return null;
}

// 添加用于调试的滚动指示器
function ScrollIndicators() {
  return (
    <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2">
      {cameraPositions.map((_, index) => (
        <div
          key={index}
          className="h-3 w-3 cursor-pointer rounded-full bg-white/50 hover:bg-white"
          onClick={() => {
            // 点击滚动到对应位置
            window.scrollTo({
              top: window.innerHeight * index,
              behavior: 'smooth',
            });
          }}
        />
      ))}
    </div>
  );
}

export function ComputersPage() {
  return (
    <div className="absolute inset-0 z-0">
      <ScrollIndicators />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 5], fov: 45, near: 1, far: 2000 }}
        eventPrefix="client"
      >
        {/* 替换原来的CameraRig，使用新的ScrollCamera */}
        <ScrollCamera />

        {/* Lights */}
        <color attach="background" args={['black']} />
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
        {/* Main scene */}
        <group position={[-0, -1, 0]}>
          {/* Auto-instanced sketchfab model */}
          <Instances>
            <Computers scale={1} />
          </Instances>
          {/* Plane reflections + distance blur */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
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
          {/* Bunny and a light give it more realism */}
          {/* <Bun scale={0.4} position={[0, 0.3, 0.5]} rotation={[0, -Math.PI * 0.85, 0]} /> */}
          <pointLight
            distance={1.5}
            intensity={1}
            position={[-0.15, 0.7, 0]}
            color="green"
          />
        </group>
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
          {/* <TiltShift2 blur={0.1} /> */}
          {/* <DotScreen scale={10} /> */}
        </EffectComposer>
        {/* Small helper that freezes the shadows for better performance */}
        <BakeShadows />
      </Canvas>
    </div>
  );
}

// function Bun(props) {
//   const { nodes } = useGLTF(suspend(suzi).default);
//   console.log(nodes);
//   return (
//     <mesh receiveShadow castShadow geometry={nodes.mesh.geometry} {...props}>
//       <meshStandardMaterial color="#222" roughness={0.5} />
//     </mesh>
//   );
// }
