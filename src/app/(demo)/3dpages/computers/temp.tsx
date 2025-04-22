'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  MeshReflectorMaterial,
  BakeShadows,
  useHelper,
  PerspectiveCamera,
  OrbitControls,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  // TiltShift2,
} from '@react-three/postprocessing';
import { easing } from 'maath';
import { Instances, Computers } from './computers';
import { useRef, useState, useEffect } from 'react';
import { useControls, folder, Leva } from 'leva';
import * as THREE from 'three';

// const suzi = import('@pmndrs/assets/models/bunny.glb')

// 添加相机调试组件
function CameraDebug() {
  const { camera } = useThree();
  // 正确类型化引用
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const helperRef = useRef<THREE.Group>(null);

  // 使用Leva添加相机控制面板
  const { position, lookAt, fov, enableHelper } = useControls('Camera', {
    position: {
      value: { x: -1, y: 2, z: 10 },
      step: 0.1,
    },
    lookAt: {
      value: { x: -3.15, y: 0.75, z: -10 },
      step: 0.1,
    },
    fov: {
      value: 45,
      min: 10,
      max: 100,
      step: 1,
    },
    controls: folder({
      enableHelper: {
        value: true,
        label: 'Show Helper',
      },
    }),
  });

  // 更新主相机位置和角度
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.set(position.x, position.y, position.z);
      camera.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, position, lookAt, fov]);

  // 添加相机辅助可视化 - 使用正确的类型检查
  useEffect(() => {
    if (
      enableHelper &&
      helperRef.current &&
      camera instanceof THREE.PerspectiveCamera
    ) {
      const helper = new THREE.CameraHelper(camera);
      helperRef.current.add(helper);

      return () => {
        if (helperRef.current) {
          helperRef.current.remove(helper);
          helper.dispose();
        }
      };
    }
  }, [camera, enableHelper]);

  return (
    <>
      {/* 创建一个辅助相机，用于可视化 */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={false}
        position={[position.x, position.y, position.z]}
        fov={fov}
        near={1}
        far={20}
      />
      {/* 添加辅助相机的可视化 */}
      <group ref={helperRef} />
    </>
  );
}

// 添加后处理效果控制
function EffectsControls() {
  const { bloomIntensity, bloomThreshold, dofFocalLength, dofBokehScale } =
    useControls('Effects', {
      bloom: folder({
        bloomIntensity: {
          value: 5,
          min: 0,
          max: 10,
          step: 0.1,
          label: 'Intensity',
        },
        bloomThreshold: {
          value: 0,
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Threshold',
        },
      }),
      depthOfField: folder({
        dofFocalLength: {
          value: 0.5,
          min: 0.1,
          max: 5,
          step: 0.1,
          label: 'Focal Length',
        },
        dofBokehScale: {
          value: 15,
          min: 1,
          max: 30,
          step: 0.5,
          label: 'Bokeh Scale',
        },
      }),
    });

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={bloomThreshold}
        mipmapBlur
        luminanceSmoothing={0.0}
        intensity={bloomIntensity}
      />
      <DepthOfField
        target={[0, 1, -2]}
        focalLength={dofFocalLength}
        bokehScale={dofBokehScale}
        height={700}
      />
      {/* <TiltShift2 blur={0.1} /> */}
      {/* <DotScreen scale={10} /> */}
    </EffectComposer>
  );
}

export default function ComputersPage() {
  // 控制是否启用原始相机运动
  const { enableCameraRig } = useControls({
    enableCameraRig: {
      value: false,
      label: 'Enable Camera Animation',
    },
  });

  return (
    <div>
      <div className="absolute right-10 top-10">
        <Leva collapsed={false} />
      </div>

      <div className="absolute inset-0 z-0">
        {/* 显示Leva控制面板 */}

        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 1, 0], fov: 45, near: 1, far: 20 }}
          eventPrefix="client"
        >
          {/* 添加相机调试组件 */}
          <CameraDebug />

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

          {/* 使用可控制的后处理效果 */}
          <EffectsControls />

          {/* Camera movements - 只在启用时使用 */}
          {enableCameraRig && <CameraRig />}

          {/* 添加轨道控制器，在禁用相机动画时使用 */}
          {!enableCameraRig && <OrbitControls makeDefault />}

          {/* Small helper that freezes the shadows for better performance */}
          <BakeShadows />
        </Canvas>
      </div>
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

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -1 - (state.pointer.x * state.viewport.width) / 3,
        (2 - state.pointer.y) / 2,
        10,
      ],
      1,
      delta,
    );
    state.camera.lookAt(-3.15, 0.75, -10);
  });

  return null;
}
