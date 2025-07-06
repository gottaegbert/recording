'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  colors?: string[];
}

export function ParticleSystem({
  count = 8000,
  colors = ['#00ff88', '#0088ff', '#8800ff'],
}: ParticleSystemProps) {
  const mesh = useRef<THREE.Points>(null);
  const time = useRef(0);
  const originalPositions = useRef<Float32Array>();

  // Generate random particles with multiple formations
  const [positions, colorArray] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let x, y, z;

      // Create different formation patterns
      const formationType = Math.random();

      if (formationType < 0.3) {
        // Sphere formation
        const radius = Math.random() * 8 + 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      } else if (formationType < 0.6) {
        // Helix formation
        const t = (i / count) * Math.PI * 4;
        const helixRadius = 3 + Math.random() * 2;
        x = helixRadius * Math.cos(t) + (Math.random() - 0.5) * 2;
        y = t * 0.5 - 4 + (Math.random() - 0.5) * 2;
        z = helixRadius * Math.sin(t) + (Math.random() - 0.5) * 2;
      } else {
        // Cube/Grid formation
        const gridSize = 12;
        x = (Math.random() - 0.5) * gridSize;
        y = (Math.random() - 0.5) * gridSize;
        z = (Math.random() - 0.5) * gridSize;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Dynamic colors based on position
      const distance = Math.sqrt(x * x + y * y + z * z);
      const colorIndex =
        Math.floor((distance / 10) * colors.length) % colors.length;
      const color = new THREE.Color(colors[colorIndex]);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    originalPositions.current = positions.slice();
    return [positions, colors];
  }, [count, colors]);

  // Complex animation with morphing effects
  useFrame((state) => {
    if (!mesh.current || !originalPositions.current) return;

    time.current += 0.008;

    // Rotate the entire system
    mesh.current.rotation.y = time.current * 0.1;
    mesh.current.rotation.x = Math.sin(time.current * 0.2) * 0.1;

    // Morphing animation
    const positions = mesh.current.geometry.attributes.position
      .array as Float32Array;
    const colors = mesh.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const originalX = originalPositions.current[i * 3];
      const originalY = originalPositions.current[i * 3 + 1];
      const originalZ = originalPositions.current[i * 3 + 2];

      // Wave distortion
      const wave1 = Math.sin(time.current * 1.5 + originalX * 0.1) * 0.5;
      const wave2 = Math.cos(time.current * 1.2 + originalZ * 0.1) * 0.3;
      const wave3 = Math.sin(time.current * 0.8 + originalY * 0.1) * 0.4;

      // Spiral transformation
      const spiralTime = time.current * 0.5;
      const spiralRadius = Math.sqrt(
        originalX * originalX + originalZ * originalZ,
      );
      const spiralAngle = Math.atan2(originalZ, originalX) + spiralTime * 0.1;

      // Blend between original and transformed positions
      const morphFactor = (Math.sin(time.current * 0.3) + 1) * 0.5;

      const transformedX = spiralRadius * Math.cos(spiralAngle);
      const transformedZ = spiralRadius * Math.sin(spiralAngle);

      positions[i * 3] =
        originalX + (transformedX - originalX) * morphFactor * 0.3 + wave1;
      positions[i * 3 + 1] = originalY + wave2 + wave3;
      positions[i * 3 + 2] =
        originalZ + (transformedZ - originalZ) * morphFactor * 0.3 + wave1;

      // Dynamic color shifting
      const distance = Math.sqrt(
        positions[i * 3] * positions[i * 3] +
          positions[i * 3 + 1] * positions[i * 3 + 1] +
          positions[i * 3 + 2] * positions[i * 3 + 2],
      );

      const colorPhase = time.current + distance * 0.1;
      const colorIntensity = (Math.sin(colorPhase) + 1) * 0.5;

      // Cycle through colors
      const colorIndex = Math.floor(colorPhase * 0.5) % 3;
      if (colorIndex === 0) {
        colors[i * 3] = 0.0 + colorIntensity * 1.0; // R
        colors[i * 3 + 1] = 1.0; // G
        colors[i * 3 + 2] = 0.5 + colorIntensity * 0.5; // B
      } else if (colorIndex === 1) {
        colors[i * 3] = 0.0 + colorIntensity * 0.5; // R
        colors[i * 3 + 1] = 0.5 + colorIntensity * 0.5; // G
        colors[i * 3 + 2] = 1.0; // B
      } else {
        colors[i * 3] = 0.5 + colorIntensity * 0.5; // R
        colors[i * 3 + 1] = 0.0; // G
        colors[i * 3 + 2] = 1.0; // B
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <Points ref={mesh} positions={positions} colors={colorArray}>
      <PointMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
