'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  useHelper,
  Grid,
  Text,
  Html,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei';
import * as THREE from 'three';

export default function MetallicMaterialsDemo() {
  useEffect(() => {
    // 强制重新计算画布大小
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };

    // 页面加载后延迟触发一次resize事件
    const timeoutId = setTimeout(handleResize, 900);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [0, 2, 10], fov: 45 }}>
        <Scene />
        <OrbitControls makeDefault />
        <Environment preset="warehouse" />
      </Canvas>
      <div className="absolute right-24 top-48 rounded-md bg-black/70 p-3 text-white">
        <h2 className="mb-2 text-lg font-bold">Controls</h2>
        <p>Rotate: Left-click + drag</p>
        <p>Pan: Right-click + drag</p>
        <p>Zoom: Scroll</p>
      </div>
    </div>
  );
}

function Scene() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'green');

  return (
    <>
      <directionalLight
        ref={directionalLightRef}
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={1} />

      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#6f6f6f"
        position={[0, -2, 0]}
        infiniteGrid
      />

      {/* Metallic Materials Showcase */}
      <group>
        {/* Chrome-like material */}
        <MetallicObject
          position={[-4, 0, 0]}
          metalness={1}
          roughness={0.1}
          color="#ffffff"
          label="Chrome"
        />

        {/* Gold-like material */}
        <MetallicObject
          position={[-2, 0, 0]}
          metalness={1}
          roughness={0.2}
          color="#ffd700"
          label="Gold"
        />

        {/* Brushed aluminum */}
        <MetallicObject
          position={[0, 0, 0]}
          metalness={0.8}
          roughness={0.5}
          color="#a8a8a8"
          label="Brushed Aluminum"
        />

        {/* Copper */}
        <MetallicObject
          position={[2, 0, 0]}
          metalness={1}
          roughness={0.3}
          color="#b87333"
          label="Copper"
        />

        {/* Steel */}
        <MetallicObject
          position={[4, 0, 0]}
          metalness={0.9}
          roughness={0.4}
          color="#71797E"
          label="Steel"
        />
      </group>

      {/* Metalness/Roughness Comparison */}
      <group position={[0, 0, -4]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Metalness/Roughness Comparison
        </Text>

        {/* Metalness row (increasing from left to right) */}
        {[0, 0.25, 0.5, 0.75, 1].map((metalness, i) => (
          <group key={`metalness-${i}`} position={[(i - 2) * 2, 1, 0]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial
                color="#a8a8a8"
                metalness={metalness}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Roughness row (increasing from left to right) */}
        {[0, 0.25, 0.5, 0.75, 1].map((roughness, i) => (
          <group key={`roughness-${i}`} position={[(i - 2) * 2, -1, 0]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial
                color="#a8a8a8"
                metalness={0.8}
                roughness={roughness}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Tube Examples */}
      <group position={[0, 0, 4]}>
        {/* <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Metallic Tubes (Round & Square)
        </Text> */}

        {/* Round Tube */}
        <group position={[-2, 0, 0]}>
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.2, 16, 32]} />
            <meshStandardMaterial
              color="#a8a8a8"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* <Html position={[0, -1.5, 0]} center>
            <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-sm text-white">
              Round Tube
            </div>
          </Html> */}
        </group>

        {/* Square Tube */}
        <group position={[2, 0, 0]}>
          <SquareTube />
          {/* <Html position={[0, -1.5, 0]} center>
            <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-sm text-white">
              Square Tube
            </div>
          </Html> */}
        </group>
      </group>

      {/* Complex Tube Examples */}
      <group position={[0, 6, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Industrial Tube Examples
        </Text>

        {/* Bent Round Tube */}
        <group position={[-3, 0, 0]}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.8, 0.15, 16, 32, Math.PI * 1.5]} />
            <meshStandardMaterial
              color="#b87333"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
          <mesh
            castShadow
            receiveShadow
            position={[-0.8, -0.8, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.15, 0.15, 1.6, 16]} />
            <meshStandardMaterial
              color="#b87333"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
          <Html position={[0, -1.5, 0]} center>
            <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-sm text-white">
              Bent Round Tube
            </div>
          </Html>
        </group>

        {/* L-shaped Square Tube */}
        <group position={[0, 0, 0]}>
          <LShapedSquareTube />
          <Html position={[0, -1.5, 0]} center>
            <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-sm text-white">
              L-shaped Square Tube
            </div>
          </Html>
        </group>

        {/* T-shaped Round Tube */}
        <group position={[3, 0, 0]}>
          <TShapedRoundTube />
          <Html position={[0, -1.5, 0]} center>
            <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-sm text-white">
              T-shaped Round Tube
            </div>
          </Html>
        </group>
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
      </group>
    </>
  );
}

interface MetallicObjectProps {
  position: [number, number, number];
  metalness: number;
  roughness: number;
  color: string;
  label: string;
}

function MetallicObject({
  position,
  metalness,
  roughness,
  color,
  label,
}: MetallicObjectProps) {
  return (
    <group position={position}>
      {/* Main object */}
      <mesh castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
        <torusGeometry args={[0.4, 0.3, 16, 32]} />
      </mesh>

      {/* Label */}
      {/* <Html position={[0, 3, 0]} center>
        <div className="rounded bg-black/70 px-2 py-1 text-sm text-white">
          {label}
          <div className="text-xs">
            Metalness: {metalness} | Roughness: {roughness}
          </div>
        </div>
      </Html> */}
    </group>
  );
}

function SquareTube() {
  const size = 1;
  const thickness = 0.2;
  const innerSize = size - thickness * 2;

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Outer box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#71797E"
          metalness={0.9}
          roughness={0.3}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Inner box (negative space) */}
      <mesh
        castShadow
        receiveShadow
        scale={[innerSize / size, innerSize / size, 1.1]}
      >
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="black" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function LShapedSquareTube() {
  const size = 0.2;
  const length = 1;

  return (
    <group>
      {/* Horizontal part */}
      <mesh castShadow receiveShadow position={[length / 2, 0, 0]}>
        <boxGeometry args={[length, size, size]} />
        <meshStandardMaterial color="#71797E" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Vertical part */}
      <mesh castShadow receiveShadow position={[0, -length / 2, 0]}>
        <boxGeometry args={[size, length, size]} />
        <meshStandardMaterial color="#71797E" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TShapedRoundTube() {
  const radius = 0.1;
  const length = 1;

  return (
    <group>
      {/* Horizontal part */}
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, length * 2, 16]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Vertical part */}
      <mesh castShadow receiveShadow position={[0, -length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
