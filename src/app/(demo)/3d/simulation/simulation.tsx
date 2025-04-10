import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  useHelper,
  Grid,
  useGLTF,
  Html,
  GizmoHelper,
  GizmoViewport,
  RoundedBox,
  OrthographicCamera,
  Edges,
  Outlines,
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';

import { useTheme } from 'next-themes';

// 修改DebugSettings接口
interface DebugSettings {
  showEffects: boolean;
  zSpeed: number;
  lightIntensity: number;
  showWireframe: boolean;
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  zoom: number; // 添加正交相机的缩放控制
}

interface SceneProps {
  debugSettings: DebugSettings;
}

export default function Simulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [debugSettings, setDebugSettings] = useState<DebugSettings>({
    showEffects: false,
    zSpeed: 1,
    lightIntensity: 0.6,
    showWireframe: false,
    cameraPosition: { x: 10, y: 20, z: 10 },
    zoom: 50, // 初始缩放值
  });

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
      {/* 调试面板 */}
      <div className="absolute left-2 top-2 z-10 w-64 rounded-lg bg-white/80 p-3 text-xs backdrop-blur-sm dark:bg-black/50 dark:text-white">
        <h3 className="mb-2 font-bold">Debug Controls</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label>Effects</label>
            <input
              type="checkbox"
              checked={debugSettings.showEffects}
              onChange={(e) =>
                setDebugSettings({
                  ...debugSettings,
                  showEffects: e.target.checked,
                })
              }
            />
          </div>

          <div>
            <label>Z Speed: {debugSettings.zSpeed.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={debugSettings.zSpeed}
              onChange={(e) =>
                setDebugSettings({
                  ...debugSettings,
                  zSpeed: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full"
            />
          </div>

          <div>
            <label>
              Light Intensity: {debugSettings.lightIntensity.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={debugSettings.lightIntensity}
              onChange={(e) =>
                setDebugSettings({
                  ...debugSettings,
                  lightIntensity: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <label>Wireframe</label>
            <input
              type="checkbox"
              checked={debugSettings.showWireframe}
              onChange={(e) =>
                setDebugSettings({
                  ...debugSettings,
                  showWireframe: e.target.checked,
                })
              }
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full text-xs"
            onClick={() => {
              // 重置所有调试设置
              setDebugSettings({
                ...debugSettings,
                showWireframe: false,
                lightIntensity: 0.6,
                zSpeed: 1,
              });
            }}
          >
            Reset Materials
          </Button>

          <div>
            <label>Camera Zoom: {debugSettings.zoom.toFixed(1)}</label>
            <input
              type="range"
              min="10"
              max="200"
              step="1"
              value={debugSettings.zoom}
              onChange={(e) =>
                setDebugSettings({
                  ...debugSettings,
                  zoom: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-1">
            <div>
              <label>Camera X</label>
              <input
                type="number"
                value={debugSettings.cameraPosition.x}
                onChange={(e) =>
                  setDebugSettings({
                    ...debugSettings,
                    cameraPosition: {
                      ...debugSettings.cameraPosition,
                      x: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full rounded border px-1 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div>
              <label>Camera Y</label>
              <input
                type="number"
                value={debugSettings.cameraPosition.y}
                onChange={(e) =>
                  setDebugSettings({
                    ...debugSettings,
                    cameraPosition: {
                      ...debugSettings.cameraPosition,
                      y: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full rounded border px-1 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div>
              <label>Camera Z</label>
              <input
                type="number"
                value={debugSettings.cameraPosition.z}
                onChange={(e) =>
                  setDebugSettings({
                    ...debugSettings,
                    cameraPosition: {
                      ...debugSettings.cameraPosition,
                      z: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full rounded border px-1 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <Canvas
        shadows
        gl={{
          antialias: true,
          outputColorSpace: 'srgb',
        }}
        style={{ width: '100%', height: '100%' }}
        resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
      >
        <color
          attach="background"
          args={[theme === 'dark' ? '#1E1E1E' : '#F2F3F5']}
        />
        <OrthographicCamera
          makeDefault
          position={[
            debugSettings.cameraPosition.x,
            debugSettings.cameraPosition.y,
            debugSettings.cameraPosition.z,
          ]}
          zoom={debugSettings.zoom}
          near={0.1}
          far={1000}
        />
        <Scene debugSettings={debugSettings} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minZoom={10}
          maxZoom={200}
        />
        <Environment files="/environment.hdr" background blur={0.5} />
        <axesHelper args={[5]} />

        {/* <Plane
          args={[100, 100]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -4, 0]}
        /> */}

        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          renderPriority={1}
        >
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="black"
          />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>

        {debugSettings.showEffects && (
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
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

function Scene({ debugSettings }: SceneProps) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const laserRef = useRef<THREE.Mesh | null>(null);
  const laserLightRef = useRef<THREE.PointLight | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const [boxMoving, setBoxMoving] = useState(0);
  const [hovered, setHovered] = useState(false);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'green');

  // 旋转动画
  useFrame((state) => {
    setBoxMoving(state.clock.getElapsedTime() * debugSettings.zSpeed);
  });

  // Load the tube model
  const { scene } = useGLTF('/models/tube.glb');
  const { nodes, materials } = useGLTF('/models/tube.glb');

  // 打印模型结构以便调试

  // console.log('Model nodes:', nodes);
  // console.log('Model materials:', materials);

  const laserHeadPosition = nodes.切割头旋转轴.position;
  // console.log('laserHeadPosition:', laserHeadPosition);

  // 更新所有材质的线框模式
  useEffect(() => {
    // 遍历所有材质
    if (materials) {
      Object.values(materials).forEach((material) => {
        // 设置材质的透明度和颜色，当wireframe开启时
        if (
          material instanceof THREE.MeshStandardMaterial ||
          material instanceof THREE.MeshPhysicalMaterial
        ) {
          if (debugSettings.showWireframe) {
            material.transparent = true;
            material.opacity = 0.1; // 几乎透明
            material.color.set('#2a6fc9'); // 蓝色调
            material.emissive.set('#103665'); // 发光效果
            material.metalness = 0.9;
            material.roughness = 0.1;
          } else {
            material.transparent = false;
            material.opacity = 1;
            // 恢复原始颜色 (假设现在没有存储原始颜色，使用默认值)
            material.metalness = 0.7;
            material.roughness = 0.3;
          }
        } else if (
          material instanceof THREE.MeshBasicMaterial ||
          material instanceof THREE.MeshPhongMaterial ||
          material instanceof THREE.MeshLambertMaterial
        ) {
          if (debugSettings.showWireframe) {
            material.transparent = true;
            material.opacity = 0.1;
          } else {
            material.transparent = false;
            material.opacity = 1;
          }
        }
      });
    }
  }, [materials, debugSettings.showWireframe]);

  // 为模型添加边缘效果
  useEffect(() => {
    if (scene && debugSettings.showWireframe) {
      // 遍历场景中的所有对象
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          // 删除之前可能添加的边缘组件，避免重复
          const existingEdges = object.children.filter(
            (child) => child.userData.isEdges || child.userData.isOutlines,
          );
          existingEdges.forEach((edge) => object.remove(edge));

          // 添加边缘辅助线 (手动模拟Edges组件)
          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(object.geometry, 15),
            new THREE.LineBasicMaterial({ color: '#00a0ff', linewidth: 1 }),
          );
          edges.userData.isEdges = true;
          object.add(edges);
        }
      });
    } else if (scene && !debugSettings.showWireframe) {
      // 移除所有边缘效果
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const existingEdges = object.children.filter(
            (child) => child.userData.isEdges || child.userData.isOutlines,
          );
          existingEdges.forEach((edge) => object.remove(edge));
        }
      });
    }
  }, [scene, debugSettings.showWireframe]);

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
        intensity={debugSettings.lightIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={debugSettings.lightIntensity} />
      {/* <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#999999"
        position={[0, -2, 0]}
        infiniteGrid
      /> */}

      {/* 添加圆角盒子 */}
      <RoundedBox
        args={[0.25, 0.25, 10]} // 宽度, 高度, 深度
        radius={0.1} // 圆角半径
        smoothness={4} // 圆角平滑度
        position={[
          laserHeadPosition.x / 20,
          laserHeadPosition.y / 20 - 2.8,
          laserHeadPosition.z / 20 - 7 - boxMoving / 10,
        ]} // 位置
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={debugSettings.showWireframe ? '#1a3e78' : '#eeeeee'}
          metalness={debugSettings.showWireframe ? 0.9 : 0.6}
          roughness={debugSettings.showWireframe ? 0.1 : 0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          transparent={debugSettings.showWireframe}
          opacity={debugSettings.showWireframe ? 0.2 : 1}
        />
        {debugSettings.showWireframe && (
          <>
            <Edges
              threshold={15} // 边缘角度阈值，只显示大于这个角度的边缘
              color={hovered ? '#00ffff' : '#00a0ff'}
              scale={1.001} // 稍微放大以避免z-fighting
              lineWidth={1.5}
            />
            <Outlines
              thickness={0.003}
              color={hovered ? '#00ffff' : '#00a0ff'}
              transparent={true}
              opacity={0.8}
            />
          </>
        )}
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
