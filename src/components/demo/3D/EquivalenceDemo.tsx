'use client';

import { useFrame, Canvas } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Simple noise function (replacing fast-simplex-noise)
function noise(x: number, y: number, z: number): number {
  return Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.sin(z * 0.1);
}

interface EquivalenceParticlesProps {
  count?: number;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
}

function EquivalenceParticles({
  count = 15000,
  isAnimating = true,
}: EquivalenceParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const time = useRef(0);
  const animationPhase = useRef(0);

  // Generate particles in specific formations
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create multiple geometric formations
      const formType = Math.floor(i / (count / 4));
      let x, y, z;

      switch (formType) {
        case 0: // Sphere
          const radius = 3 + Math.random() * 2;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
          break;
        case 1: // Cube
          x = (Math.random() - 0.5) * 6;
          y = (Math.random() - 0.5) * 6;
          z = (Math.random() - 0.5) * 6;
          break;
        case 2: // Plane/Grid
          x = (Math.random() - 0.5) * 8;
          y = 0 + (Math.random() - 0.5) * 0.5;
          z = (Math.random() - 0.5) * 8;
          break;
        default: // Random
          x = (Math.random() - 0.5) * 10;
          y = (Math.random() - 0.5) * 10;
          z = (Math.random() - 0.5) * 10;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color based on formation and position
      const hue = (formType * 0.25 + Math.random() * 0.1) % 1;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, [count]);

  useFrame(() => {
    if (!mesh.current || !isAnimating) return;

    time.current += 0.01;
    animationPhase.current += 0.005;

    // Global rotation
    mesh.current.rotation.y = time.current * 0.2;
    mesh.current.rotation.x = Math.sin(time.current * 0.1) * 0.1;

    // Particle morphing animation
    const positions = mesh.current.geometry.attributes.position
      .array as Float32Array;
    const colors = mesh.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      // Equivalence transformation - particles converge and diverge
      const distance = Math.sqrt(x * x + y * y + z * z);
      const noiseValue = noise(
        x + time.current,
        y + time.current,
        z + time.current,
      );

      // Wave effect
      const wave = Math.sin(animationPhase.current + distance * 0.3) * 0.5;
      positions[i * 3 + 1] = y + wave + noiseValue * 0.3;

      // Color animation
      const colorPhase = time.current + distance * 0.1;
      const intensity = (Math.sin(colorPhase) + 1) * 0.5;

      colors[i * 3] = 0.2 + intensity * 0.8; // R
      colors[i * 3 + 1] = 0.1 + intensity * 0.9; // G
      colors[i * 3 + 2] = 0.9; // B
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <Points ref={mesh} positions={positions} colors={colors}>
      <PointMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function EquivalenceDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
      setIsAnimating(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const replayAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="loader-ring"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]}
        className="absolute inset-0"
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <EquivalenceParticles count={15000} isAnimating={isAnimating} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={20}
          minDistance={3}
        />
      </Canvas>

      {/* Simple replay control - hidden by default */}
      <div className="absolute bottom-8 right-8 z-30">
        <button
          onClick={replayAnimation}
          className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          title="Replay Animation"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .loader-ring {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
