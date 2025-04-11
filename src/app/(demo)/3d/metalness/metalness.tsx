'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  useHelper,
  Grid,
  Text,
  useScroll,
  ScrollControls,
} from '@react-three/drei';

import * as THREE from 'three';
import { Model as Datsun } from './datsun';

export default function MetallicMaterialsDemo() {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollControls, setScrollControls] = useState<any>(null);
  const [activeMaterial, setActiveMaterial] = useState('');

  useEffect(() => {
    // 强制重新计算画布大小
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };

    // 页面加载后延迟触发一次resize事件
    const timeoutId = setTimeout(handleResize, 900);

    // 添加键盘导航
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollControls || !scrollControls.el) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextSection = Math.min(currentSection + 1, 6);
        scrollControls.el.scrollTo(
          0,
          (nextSection / 7) * scrollControls.el.scrollHeight,
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevSection = Math.max(currentSection - 1, 0);
        scrollControls.el.scrollTo(
          0,
          (prevSection / 7) * scrollControls.el.scrollHeight,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, scrollControls]);

  // 处理点击导航到特定部分
  const handleSectionClick = (index: number) => {
    if (scrollControls && scrollControls.el) {
      // 使用DOM元素的scrollTo方法而非直接调用scrollControls.scrollTo
      scrollControls.el.scrollTo(
        0,
        (index / 7) * scrollControls.el.scrollHeight,
      );
    }
  };

  // Section names for the navigation indicator
  const sectionNames = [
    'Overview',
    'Alloy Wheels',
    'Headlights',
    'Chrome Trim',
    'Tires',
    'Black Paint',
    'Metallic Materials',
  ];

  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [0, -2, 8], fov: 45 }}>
        <ScrollControls
          pages={7}
          damping={0.2}
          distance={1.5}
          infinite={false}
          horizontal={false}
        >
          <Scene
            onSectionChange={setCurrentSection}
            setScrollControls={setScrollControls}
            setActiveMaterial={setActiveMaterial}
          />
          <Environment preset="warehouse" />
        </ScrollControls>
      </Canvas>
      <div className="absolute right-8 top-8 rounded-md bg-black/70 p-3 text-white">
        <p>Scroll/Keyboard⬇️⬆️ to navigate</p>
      </div>

      {/* 材质信息 - 只保留2D界面版本 */}
      {activeMaterial && (
        <div className="absolute left-8 top-8 max-w-xs rounded-md bg-black/90 p-4 text-white">
          <h3 className="text-lg font-bold text-yellow-400">
            {materialInfo[activeMaterial].title}
          </h3>
          <p className="mt-2">{materialInfo[activeMaterial].description}</p>
        </div>
      )}

      {/* Section indicator */}
      <div className="absolute bottom-8 left-8 p-3 text-white">
        <div className="flex flex-col items-center space-y-1">
          {sectionNames.map((name, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-md px-3 py-1 text-sm transition-all hover:bg-yellow-400/70 ${
                currentSection === index
                  ? 'bg-yellow-500 font-bold text-black'
                  : 'bg-black/50'
              }`}
              onClick={() => handleSectionClick(index)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Material information for popups
interface MaterialInfoType {
  [key: string]: {
    title: string;
    description: string;
    position: [number, number, number];
  };
}

const materialInfo: MaterialInfoType = {
  alloy: {
    title: 'Alloy Wheels',
    description:
      'Lightweight aluminum alloy wheels with high strength-to-weight ratio.',
    position: [1.5, -2, 1],
  },
  headlights: {
    title: 'Headlights',
    description: 'Classic round headlights with chrome bezels.',
    position: [1.5, -0.5, 1.5],
  },
  black_paint: {
    title: 'Black Paint',
    description: 'Matte black paint used for various accent parts.',
    position: [0, -0.5, 1.5],
  },
  tire: {
    title: 'Tires',
    description: 'Period-correct radial tires with textured sidewalls.',
    position: [-1.5, -2, 1],
  },
  black_matte: {
    title: 'Black Matte Parts',
    description:
      'Non-reflective black components used for interior and details.',
    position: [0, -1, 2],
  },
  chrome: {
    title: 'Chrome Trim',
    description:
      'Highly polished chrome trim with high metalness and low roughness.',
    position: [0, -0.5, 2],
  },
};

function Scene({
  onSectionChange,
  setScrollControls,
  setActiveMaterial,
}: {
  onSectionChange: (section: number) => void;
  setScrollControls: React.Dispatch<React.SetStateAction<any>>;
  setActiveMaterial: React.Dispatch<React.SetStateAction<string>>;
}) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'green');

  // Add scroll controls
  const data = useScroll();
  const { camera } = useThree();
  const [currentMaterial, setCurrentMaterial] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [currentSection, setCurrentSection] = useState(0);
  const positionRef = useRef({ x: 0, y: -2, z: 8 });
  const lookAtRef = useRef({ x: 0, y: -1.5, z: 0 });

  // 获取ScrollControls实例
  useEffect(() => {
    if (data && data.el) {
      setScrollControls(data);
    }
  }, [data, setScrollControls]);

  // 设置相机路径点 - 定义七个关键帧
  const cameraKeyframes = [
    { pos: { x: 3, y: -0.5, z: 5 }, lookAt: { x: 0, y: -1.5, z: 0 } },
    { pos: { x: 2.5, y: -2, z: 3 }, lookAt: { x: 1, y: -2, z: 0 } },
    { pos: { x: 2, y: -0.5, z: 3 }, lookAt: { x: 0.5, y: -0.5, z: 0 } },
    { pos: { x: -1, y: -0.5, z: 3 }, lookAt: { x: 0, y: -0.5, z: 0 } },
    { pos: { x: -2.5, y: -2, z: 3 }, lookAt: { x: -1, y: -2, z: 0 } },
    { pos: { x: 0, y: 0, z: 3 }, lookAt: { x: 0, y: -1, z: 0 } },
    { pos: { x: 0, y: 3, z: 5 }, lookAt: { x: 0, y: 3, z: -4 } },
  ];

  useFrame(() => {
    // 获取滚动位置 (0-1)
    const scrollOffset = data.offset;

    // 计算当前部分
    const section = Math.floor(scrollOffset * 7);

    // 更新部分指示器
    if (section !== currentSection) {
      setCurrentSection(section);
      onSectionChange(section);
    }

    // 计算相机位置和查看目标 - 使用连续插值而非离散步骤
    // 将滚动偏移量乘以(关键帧数量-1)得到一个浮点数索引
    const frameIndex = scrollOffset * 6; // 0到6之间的值

    // 获取当前帧和下一帧的索引
    const currentFrameIndex = Math.min(Math.max(Math.floor(frameIndex), 0), 6);
    // 根据滚动方向确定插值的第二个关键帧
    const nextFrameIndex = Math.min(Math.max(Math.ceil(frameIndex), 0), 6);

    // 我们需要确保当索引相同时（如在整数点上）不会出现错误
    const isOnExactFrame = currentFrameIndex === nextFrameIndex;

    // 计算两帧之间的插值因子 (0-1)
    const frameFactor = isOnExactFrame
      ? 0
      : (frameIndex - currentFrameIndex) / (nextFrameIndex - currentFrameIndex);

    // 获取当前帧和下一帧
    const currentFrame = cameraKeyframes[currentFrameIndex];
    const nextFrame = cameraKeyframes[nextFrameIndex];

    // 安全检查确保引用有效
    if (!currentFrame || !nextFrame) {
      console.error('相机关键帧索引无效:', {
        currentFrameIndex,
        nextFrameIndex,
        frameCount: cameraKeyframes.length,
      });
      return;
    }

    // 在两个关键帧之间插值计算相机位置
    positionRef.current = {
      x: isOnExactFrame
        ? currentFrame.pos.x
        : THREE.MathUtils.lerp(
            currentFrame.pos.x,
            nextFrame.pos.x,
            frameFactor,
          ),
      y: isOnExactFrame
        ? currentFrame.pos.y
        : THREE.MathUtils.lerp(
            currentFrame.pos.y,
            nextFrame.pos.y,
            frameFactor,
          ),
      z: isOnExactFrame
        ? currentFrame.pos.z
        : THREE.MathUtils.lerp(
            currentFrame.pos.z,
            nextFrame.pos.z,
            frameFactor,
          ),
    };

    // 在两个关键帧之间插值计算目标位置
    lookAtRef.current = {
      x: isOnExactFrame
        ? currentFrame.lookAt.x
        : THREE.MathUtils.lerp(
            currentFrame.lookAt.x,
            nextFrame.lookAt.x,
            frameFactor,
          ),
      y: isOnExactFrame
        ? currentFrame.lookAt.y
        : THREE.MathUtils.lerp(
            currentFrame.lookAt.y,
            nextFrame.lookAt.y,
            frameFactor,
          ),
      z: isOnExactFrame
        ? currentFrame.lookAt.z
        : THREE.MathUtils.lerp(
            currentFrame.lookAt.z,
            nextFrame.lookAt.z,
            frameFactor,
          ),
    };

    // 平滑移动相机 - 使用更大的插值系数使移动更快且更平滑
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      positionRef.current.x,
      0.15,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      positionRef.current.y,
      0.15,
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      positionRef.current.z,
      0.15,
    );

    // 平滑设置相机目标
    const targetLookAt = new THREE.Vector3(
      lookAtRef.current.x,
      lookAtRef.current.y,
      lookAtRef.current.z,
    );

    // 为避免旋转问题，使用更安全的方法来平滑相机的朝向
    try {
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);

      // 计算目标方向向量（从相机到目标点）
      const targetDirection = new THREE.Vector3()
        .copy(targetLookAt)
        .sub(camera.position)
        .normalize();

      // 检查向量是否有效（防止零向量）
      if (targetDirection.lengthSq() > 0.0001) {
        // 计算当前方向与目标方向之间的四元数
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          currentLookAt,
          targetDirection,
        );

        // 应用平滑旋转，更小的系数使旋转更平滑
        camera.quaternion.slerp(quaternion, 0.08);
      } else {
        // 如果目标方向无效，直接使用lookAt
        camera.lookAt(targetLookAt);
      }
    } catch (error) {
      // 如果四元数计算失败，回退到安全的lookAt
      console.warn('相机旋转计算错误，使用默认lookAt', error);
      camera.lookAt(targetLookAt);
    }

    // 处理材质高亮和弹出框
    let material = '';
    let highlight: [number, number, number] = [0, 0, 0];

    // 根据部分设置当前材质
    switch (section) {
      case 0:
        material = '';
        highlight = [0, 0, 0];
        break;
      case 1:
        material = 'alloy';
        highlight = [1.5, -2, 1];
        break;
      case 2:
        material = 'headlights';
        highlight = [1.5, -0.5, 1.5];
        break;
      case 3:
        material = 'chrome';
        highlight = [0, -0.5, 2];
        break;
      case 4:
        material = 'tire';
        highlight = [-1.5, -2, 1];
        break;
      case 5:
        material = 'black_paint';
        highlight = [0, -0.5, 1.5];
        break;
      case 6:
        material = '';
        highlight = [0, 0, 0];
        break;
    }

    // 设置当前材质的弹出框
    if (material !== currentMaterial) {
      setCurrentMaterial(material);
      setShowPopup(!!material);
      setHighlightPosition(highlight);
      setActiveMaterial(material); // 更新外部UI
    }
  });

  return (
    <>
      {/* Directional light */}
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
        sectionColor="#eeeeee"
        position={[0, -2, 0]}
      />

      {/* Datsun Model  */}
      <group position={[0, -1.5, 0]} rotation={[0, Math.PI / 4, 0]} scale={1}>
        <Datsun />
      </group>

      {/* Metallic Materials Showcase */}
      <group position={[0, 3, -4]}>
        {/* Chrome-like material */}
        <MetallicObject
          position={[-4, 0, 0]}
          metalness={1}
          roughness={0.1}
          color="#ffffff"
          label="Chrome"
        />
        <Text
          position={[-4, -1, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Chrome
        </Text>

        {/* Gold-like material */}
        <MetallicObject
          position={[-2, 0, 0]}
          metalness={1}
          roughness={0.2}
          color="#ffd700"
          label="Gold"
        />
        <Text
          position={[-2, -1, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Gold
        </Text>

        {/* Brushed aluminum */}
        <MetallicObject
          position={[0, 0, 0]}
          metalness={0.8}
          roughness={0.5}
          color="#a8a8a8"
          label="Brushed Aluminum"
        />
        <Text
          position={[0, -1, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Brushed Aluminum
        </Text>

        {/* Copper */}
        <MetallicObject
          position={[2, 0, 0]}
          metalness={1}
          roughness={0.3}
          color="#b87333"
          label="Copper"
        />
        <Text
          position={[2, -1, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Copper
        </Text>

        {/* Steel */}
        <MetallicObject
          position={[4, 0, 0]}
          metalness={0.9}
          roughness={0.4}
          color="#71797E"
          label="Steel"
        />
        <Text
          position={[4, -1, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Steel
        </Text>
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
    </group>
  );
}
