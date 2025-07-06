'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ParticleSystem } from './ParticleSystem';
import { Suspense } from 'react';

interface ParticleSceneProps {
  className?: string;
}

export function ParticleScene({ className = '' }: ParticleSceneProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        className="bg-black"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ff88" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.6}
            color="#0088ff"
          />
          <pointLight position={[0, 15, 0]} intensity={0.4} color="#8800ff" />

          {/* Particle System */}
          <ParticleSystem
            count={10000}
            colors={['#00ff88', '#0088ff', '#8800ff', '#ff0088', '#88ff00']}
          />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxDistance={30}
            minDistance={8}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
          />

          {/* Environment */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
