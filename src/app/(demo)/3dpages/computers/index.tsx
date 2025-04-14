'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { Suspense } from 'react';
import { Computers, Instances } from './computers';

export default function ComputersPage() {
  return (
    <div className="absolute z-10 h-screen w-full">
      <Canvas
        shadows
        camera={{ position: [0, 3, 10], fov: 60 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <hemisphereLight intensity={0.25} />
          <spotLight
            position={[10, 20, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Instances>
            <Computers />
          </Instances>
          <Environment preset="warehouse" />
          <OrbitControls
            autoRotate
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
