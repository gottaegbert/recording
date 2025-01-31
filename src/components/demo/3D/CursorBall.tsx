import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { Physics, useSphere } from '@react-three/cannon';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';

// import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing"

import { useEffect, useState } from 'react';

export function useThemeColor(colorVar: string) {
  const [color, setColor] = useState('#3354f4'); // 默认颜色

  useEffect(() => {
    const updateColor = () => {
      const computedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(colorVar)
        .trim();
      setColor(computedColor);
    };

    updateColor();

    // 监听主题变化
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => observer.disconnect();
  }, [colorVar]);

  return color;
}

const rfs = THREE.MathUtils.randFloatSpread;

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

export default function CursorBall() {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-0">
        <div className="w-full h-[60vh]">
          <div
            className="flex flex-col relative"
            style={{ aspectRatio: '9/16' }}
          >
            <Canvas
              shadows
              gl={{ antialias: false }}
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
            >
              <ambientLight intensity={0.5} />
              {/* <color attach="background" args={["#dfdfdf"]} /> */}
              <spotLight
                intensity={1}
                angle={0.2}
                penumbra={1}
                position={[30, 30, 30]}
                castShadow
                shadow-mapSize={[512, 512]}
              />
              <Physics gravity={[0, 2, 0]} iterations={10}>
                <Pointer />
                <Clump />
              </Physics>
              <Environment files="/adamsbridge.hdr" />
              {/* <EffectComposer disableNormalPass multisampling={0}>
      <N8AO color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
      <SMAA />
    </EffectComposer> */}
            </Canvas>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
function Clump({
  mat = new THREE.Matrix4(),
  vec = new THREE.Vector3(),

  ...props
}) {
  const mainColor = useThemeColor('--ball');
  const baubleMaterial = new THREE.MeshStandardMaterial({
    color: mainColor,
    roughness: 0,
    envMapIntensity: 1,
  });
  const texture = useTexture('/cross.jpg');
  const [ref, api] = useSphere(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(20), rfs(20), rfs(20)],
  }));
  useFrame(() => {
    for (let i = 0; i < 40; i++) {
      // Get current whereabouts of the instanced sphere
      //@ts-ignore
      ref.current.getMatrixAt(i, mat);
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      api
        .at(i)
        .applyForce(
          vec
            .setFromMatrixPosition(mat)
            .normalize()
            .multiplyScalar(-40)
            .toArray(),
          [0, 0, 0],
        );
    }
  });
  //@ts-ignore
  return (
    <instancedMesh
      //@ts-ignore
      ref={ref}
      castShadow
      receiveShadow
      //@ts-ignore
      args={[null, null, 25]}
      geometry={sphereGeometry}
      material={baubleMaterial}
      material-map={texture}
    />
  );
}

function Pointer() {
  const viewport = useThree((state) => state.viewport);
  const [, api] = useSphere(() => ({
    type: 'Kinematic',
    args: [3],
    position: [0, 0, 0],
  }));
  return useFrame((state) =>
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      0,
    ),
  );
}
