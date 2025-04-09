import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  useHelper,
  Grid,
  useGLTF,
  Plane,
  Html,
  GizmoHelper,
  GizmoViewport,
  RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { Hand } from 'lucide-react';

export default function Simulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 强制重新计算画布大小
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    const timeoutId = setTimeout(handleResize, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        shadows
        camera={{ position: [10, 20, 10], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
      >
        <Scene />
        <OrbitControls makeDefault />
        <Environment preset="warehouse" />
        {/* 添加坐标轴助手 */}
        <axesHelper args={[5]} />

        {/* 添加右上角的坐标轴指示器 */}

        {/* <Plane
          args={[100, 100]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -4, 0]}
        /> */}

        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.1}
            bokehScale={2}
            height={880}
          />
          <Bloom
            intensity={0.2}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          {/* <Noise opacity={0.2} /> */}
        </EffectComposer>
        <GizmoHelper
          alignment="bottom-right" // widget alignment within scene
          margin={[80, 80]} // widget margins (X, Y)
          renderPriority={1}
        >
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="black"
          />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
      </Canvas>
    </div>
  );
}

function Scene() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const laserRef = useRef<THREE.Mesh | null>(null);
  const laserLightRef = useRef<THREE.PointLight | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const [boxRotation, setBoxRotation] = useState(0);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'green');

  // 旋转动画
  useFrame((state) => {
    setBoxRotation(state.clock.getElapsedTime());
  });

  // Load the tube model
  const { scene } = useGLTF('/models/tube.glb');
  const { nodes, materials } = useGLTF('/models/tube.glb');

  // 打印模型结构以便调试
  console.log('Model nodes:', nodes);
  console.log('Model materials:', materials);

  const laserHeadPosition = nodes.切割头旋转轴.position;
  console.log('laserHeadPosition:', laserHeadPosition);

  useEffect(() => {
    // 创建激光效果
    const laserGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 32);
    const laserMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    const laser = new THREE.Mesh(laserGeometry, laserMaterial);
    laser.position.set(
      laserHeadPosition.x / 20,
      laserHeadPosition.y / 20 - 0.4,
      laserHeadPosition.z / 20 - 5.5,
    );
    laser.rotation.x = Math.PI / 2;
    laser.visible = false;
    scene.add(laser);
    laserRef.current = laser;

    // 添加激光光晕效果
    const laserLight = new THREE.PointLight(0x00ffff, 20, 10);
    laserLight.position.set(
      laserHeadPosition.x / 20,
      laserHeadPosition.y / 20 - 0.4,
      laserHeadPosition.z / 20 - 5.5,
    );
    laserLight.visible = false;
    scene.add(laserLight);
    laserLightRef.current = laserLight;

    // 创建切割头
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(0.5, 0.5, 15),
    //   new THREE.MeshPhysicalMaterial({
    //     color: 0x999999,
    //     roughness: 0.5,
    //     metalness: 0.8,
    //   }),
    // );
    // cube.position.set(
    //   laserHeadPosition.x / 20,
    //   laserHeadPosition.y / 20 - 0.8,
    //   laserHeadPosition.z / 20 - 7,
    // );
    // scene.add(cube);
    // cubeRef.current = cube;

    // 清理函数
    return () => {
      if (laserRef.current) {
        scene.remove(laserRef.current);
        laserRef.current.geometry.dispose();
        if (Array.isArray(laserRef.current.material)) {
          laserRef.current.material.forEach((material) => material.dispose());
        } else {
          laserRef.current.material.dispose();
        }
      }
      if (laserLightRef.current) {
        scene.remove(laserLightRef.current);
      }
      if (cubeRef.current) {
        scene.remove(cubeRef.current);
        cubeRef.current.geometry.dispose();
        if (Array.isArray(cubeRef.current.material)) {
          cubeRef.current.material.forEach((material) => material.dispose());
        } else {
          cubeRef.current.material.dispose();
        }
      }
    };
  }, [scene, laserHeadPosition]);

  // 处理激光动画
  useFrame((state: { clock: { elapsedTime: number } }, delta: number) => {
    if (isLaserActive && laserRef.current && laserLightRef.current) {
      const laserMaterial = laserRef.current
        .material as THREE.MeshBasicMaterial;
      // 激光脉冲效果
      laserMaterial.opacity =
        0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
      laserLightRef.current.intensity =
        20 + Math.sin(state.clock.elapsedTime * 10) * 1;
    }
  });

  const toggleLaser = () => {
    if (laserRef.current && laserLightRef.current) {
      setIsLaserActive(!isLaserActive);
      laserRef.current.visible = !laserRef.current.visible;
      laserLightRef.current.visible = !laserLightRef.current.visible;
    }
  };

  return (
    <>
      <directionalLight
        ref={directionalLightRef}
        position={[5, 5, 5]}
        intensity={0.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.6} />
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#6f6f6f"
        position={[0, -2, 0]}
        infiniteGrid
      />

      {/* 添加圆角盒子 */}
      <RoundedBox
        args={[0.25, 0.25, 10]} // 宽度, 高度, 深度
        radius={0.1} // 圆角半径
        smoothness={4} // 圆角平滑度
        position={[
          laserHeadPosition.x / 20,
          laserHeadPosition.y / 20 - 2.8,
          laserHeadPosition.z / 20 - 7,
        ]} // 位置
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#eeeeee"
          metalness={0.6}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      <primitive
        object={scene}
        position={[0, -2.08, 0]}
        scale={1}
        rotation={[0, 0, 0]}
      />
      <Html
        position={[
          laserHeadPosition.x / 20,
          laserHeadPosition.y / 20 - 0.8,
          laserHeadPosition.z / 20 - 7,
        ]}
      >
        <Button onClick={toggleLaser}>
          {isLaserActive ? 'Stop' : 'Activate'}
        </Button>
      </Html>
    </>
  );
}
