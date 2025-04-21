'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  MeshReflectorMaterial,
  BakeShadows,
  useHelper,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  DotScreen,
  TiltShift2,
} from '@react-three/postprocessing';
import { easing } from 'maath';
import { Instances, Computers } from './computers';

// const suzi = import('@pmndrs/assets/models/bunny.glb')

export default function ComputersPage() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1, 0], fov: 45, near: 1, far: 20 }}
        eventPrefix="client"
      >
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
          <TiltShift2 blur={0.1} />
          {/* <DotScreen scale={10} /> */}
        </EffectComposer>
        {/* Camera movements */}
        <CameraRig />
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

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -1 - (state.pointer.x * state.viewport.width) / 3,
        (2 - state.pointer.y) / 2,
        0.7,
      ],
      1,
      delta,
    );
    state.camera.lookAt(-3.15, 0.75, -10);
  });

  return null;
}
