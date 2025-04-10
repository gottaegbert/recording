import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
import { useControls, folder, Leva, button } from 'leva';
import { useTheme } from 'next-themes';

// 修改DebugSettings接口为可选，以便与Leva共存过渡期间
interface DebugSettings {
  showEffects?: boolean;
  zSpeed?: number;
  lightIntensity?: number;
  showWireframe?: boolean;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
  zoom?: number;
  cameraMode?: string;
  animationEnabled?: boolean;
  animationSpeed?: number;
}

interface SceneProps {
  debugSettings: DebugSettings;
}

export default function Simulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const cameraControlsRef = useRef(null);
  const [animationState, setAnimationState] = useState({
    time: 0,
    lastTimestamp: 0,
  });

  // 使用Leva替换调试UI
  const debugControls = useControls({
    'Post-Processing': folder({
      showEffects: { value: false, label: 'Enable Effects' },
    }),
    Scene: folder({
      lightIntensity: { value: 0.6, min: 0, max: 2, step: 0.1 },
      wireframe: { value: false, label: 'Wireframe Mode' },
    }),
    Animation: folder({
      zSpeed: {
        value: 1,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Z Movement Speed',
      },
    }),
    Camera: folder({
      zoom: { value: 50, min: 10, max: 200, step: 1 },
      position: {
        value: { x: 10, y: 5, z: 10 },
        step: 1,
      },
    }),
    'Camera Animation': folder({
      cameraMode: {
        value: 'Orbit',
        options: ['Orbit', 'FlyOver'],
        label: 'Camera Path',
      },
      animationEnabled: { value: false, label: 'Enable Animation' },
      animationSpeed: {
        value: 0.5,
        min: 0.1,
        max: 2,
        step: 0.1,
        label: 'Speed',
      },
      resetCamera: button(() => {
        if (cameraControlsRef.current) {
          // 重置动画时间
          setAnimationState({
            time: 0,
            lastTimestamp: Date.now(),
          });
        }
      }),
    }),
  });

  // 为了兼容，转换Leva控制值到DebugSettings格式
  const debugSettings: DebugSettings = {
    showEffects: debugControls.showEffects,
    zSpeed: debugControls.zSpeed,
    lightIntensity: debugControls.lightIntensity,
    showWireframe: debugControls.wireframe,
    cameraPosition: debugControls.position,
    zoom: debugControls.zoom,
    cameraMode: debugControls.cameraMode,
    animationEnabled: debugControls.animationEnabled,
    animationSpeed: debugControls.animationSpeed,
  };

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

  // 计算相机轨迹位置
  const calculateCameraPosition = (time: number, mode: string) => {
    // 使用easeInOut缓动函数
    const easeInOut = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    if (mode === 'Orbit') {
      // 轨道模式 - 环绕目标点旋转，但保持相同的视角和高度
      const radius = 15;
      const angle = time * 0.5; // 减慢旋转速度
      const easedAngle = easeInOut(Math.sin(angle) * 0.5 + 0.5) * Math.PI * 2;

      const x = Math.sin(easedAngle) * radius;
      const z = Math.cos(easedAngle) * radius;
      const y = 5; // 保持固定高度

      return {
        x,
        y,
        z,
        rotation: [0, 0, 0], // 保持相机方向不变
        zoom: debugSettings.zoom || 50, // 使用当前缩放级别
      };
    } else {
      // 自由飞行模式 - 沿着水平路径移动，但保持相同的高度和视角
      const t = time * 0.3; // 更慢的移动
      const easedT = easeInOut(Math.sin(t) * 0.5 + 0.5);

      // 做一个更柔和的往复运动
      const x = easedT * 20 - 10; // -10 到 10 范围内移动
      const z = 15 * Math.cos(t * 0.5); // 稍微的前后移动
      const y = 5; // 保持固定高度

      return {
        x,
        y,
        z,
        rotation: [0, 0, 0], // 保持相机方向不变
        zoom: debugSettings.zoom || 50, // 使用当前缩放级别
      };
    }
  };

  // 处理相机动画
  useEffect(() => {
    if (debugSettings.animationEnabled) {
      // 初始化动画时间
      if (animationState.lastTimestamp === 0) {
        setAnimationState({
          time: 0,
          lastTimestamp: Date.now(),
        });
      }

      // 设置动画帧
      const animationFrame = requestAnimationFrame(() => {
        const now = Date.now();
        const deltaTime = (now - animationState.lastTimestamp) / 1000;
        const newTime =
          animationState.time +
          deltaTime * (debugSettings.animationSpeed || 0.5);

        setAnimationState({
          time: newTime,
          lastTimestamp: now,
        });
      });

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [
    debugSettings.animationEnabled,
    animationState,
    debugSettings.animationSpeed,
    setAnimationState,
  ]);

  // 自定义正交相机动画组件
  const AnimatedOrthographicCamera = () => {
    const { camera, gl } = useThree();
    const controls = useRef<any>();

    useFrame(() => {
      if (
        debugSettings.animationEnabled &&
        camera instanceof THREE.OrthographicCamera
      ) {
        const { x, y, z, rotation, zoom } = calculateCameraPosition(
          animationState.time,
          debugSettings.cameraMode || 'Orbit',
        );

        // 更新相机位置，但保持正交投影和方向
        camera.position.set(x, y, z);

        // 确保相机始终朝向原点
        camera.lookAt(0, 0, 0);

        // 保持相同的缩放
        camera.zoom = zoom;
        camera.updateProjectionMatrix();

        // 更新控制器
        if (controls.current?.update) {
          controls.current.update();
        }
      }
    });

    return (
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minZoom={10}
        maxZoom={200}
        enabled={!debugSettings.animationEnabled}
      />
    );
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      {/* Leva面板会自动添加到DOM中 */}
      <Leva collapsed={false} titleBar={{ title: 'Debug Controls' }} />

      <Canvas
        shadows
        gl={{
          antialias: true,
          outputColorSpace: 'srgb',
        }}
        style={{ width: '100%', height: '100%' }}
        resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
        orthographic // 确保使用正交相机
      >
        <color
          attach="background"
          args={[theme === 'dark' ? '#1E1E1E' : '#F2F3F5']}
        />
        <OrthographicCamera
          makeDefault
          position={[
            debugSettings.cameraPosition?.x || 10,
            debugSettings.cameraPosition?.y || 5,
            debugSettings.cameraPosition?.z || 10,
          ]}
          zoom={debugSettings.zoom || 50}
          near={0.1}
          far={1000}
        />
        <Scene debugSettings={debugSettings} />

        {/* 使用自定义正交相机动画组件 */}
        <AnimatedOrthographicCamera />

        <Environment files="/environment.hdr" background blur={0.5} />
        <axesHelper args={[5]} />

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

        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          renderPriority={1}
        >
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="black"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}

function Scene({ debugSettings }: SceneProps) {
  // 场景中自己的控制参数也可以使用Leva
  const materialControls = useControls('Material Properties', {
    metalness: { value: 0.6, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 0.8, min: 0, max: 1, step: 0.01 },
    clearcoatRoughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    edgeThickness: { value: 0.003, min: 0.001, max: 0.01, step: 0.001 },
    edgeColor: { value: '#00a0ff' },
  });

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
    setBoxMoving(state.clock.getElapsedTime() * (debugSettings.zSpeed || 1));
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
            new THREE.LineBasicMaterial({
              color: materialControls.edgeColor,
              linewidth: 1,
            }),
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
  }, [scene, debugSettings.showWireframe, materialControls.edgeColor]);

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
      <Grid
        args={[20, 20]}
        cellSize={10}
        cellThickness={0.1}
        sectionColor="#eeeeee"
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
          laserHeadPosition.z / 20 - 7 - boxMoving / 10,
        ]} // 位置
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={debugSettings.showWireframe ? '#1a3e78' : '#eeeeee'}
          metalness={materialControls.metalness}
          roughness={materialControls.roughness}
          clearcoat={materialControls.clearcoat}
          clearcoatRoughness={materialControls.clearcoatRoughness}
          transparent={debugSettings.showWireframe}
          opacity={debugSettings.showWireframe ? 0.2 : 1}
        />
        {debugSettings.showWireframe && (
          <>
            <Edges
              threshold={15} // 边缘角度阈值，只显示大于这个角度的边缘
              color={hovered ? '#00ffff' : materialControls.edgeColor}
              scale={1.001} // 稍微放大以避免z-fighting
              lineWidth={1.5}
            />
            <Outlines
              thickness={materialControls.edgeThickness}
              color={hovered ? '#00ffff' : materialControls.edgeColor}
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
