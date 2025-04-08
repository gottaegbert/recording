import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  useHelper,
  Grid,
  useGLTF,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

export default function Simulation() {
  return (
    <div className="h-screen w-screen">
      <Canvas shadows camera={{ position: [0, 2, 10], fov: 45 }}>
        <Scene />
        <OrbitControls makeDefault />
        <Environment preset="warehouse" />
        <EffectComposer>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
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
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'green');

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
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 15),
      new THREE.MeshPhysicalMaterial({
        color: 0x999999,
        roughness: 0.5,
        metalness: 0.8,
      }),
    );
    cube.position.set(
      laserHeadPosition.x / 20,
      laserHeadPosition.y / 20 - 0.8,
      laserHeadPosition.z / 20 - 7,
    );
    scene.add(cube);
    cubeRef.current = cube;

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
