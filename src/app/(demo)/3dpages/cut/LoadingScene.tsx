'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import Cutter from './cutter';

interface LoadingSceneProps {
  onFinishLoading: () => void;
  progress: number; // 0-1 loading progress
}

function createShapeFromSvgPath(svgPath: string): THREE.Shape {
  const loader = new SVGLoader();
  const svgData = loader.parse(svgPath);
  const paths = svgData.paths;

  if (paths.length === 0) {
    // Fallback to a basic shape if SVG parsing fails
    const shape = new THREE.Shape();
    shape.moveTo(-1, -1);
    shape.lineTo(1, -1);
    shape.lineTo(1, 1);
    shape.lineTo(-1, 1);
    return shape;
  }

  // Use the first path from the SVG
  const path = paths[0];
  const shapes = path.toShapes(true);
  return shapes[0];
}

const tShapeSvg = `<svg width="300" height="360" viewBox="0 0 300 360" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M290 0H10C4.47715 0 0 4.47715 0 10V20C0 25.5228 4.47716 30 10 30H110C113.283 30 116.534 30.6466 119.567 31.903C122.6 33.1594 125.356 35.0009 127.678 37.3223C129.999 39.6438 131.841 42.3998 133.097 45.4329C134.352 48.463 134.999 51.7105 135 54.9902V306C134.999 309.148 134.352 312.266 133.097 315.175C131.841 318.087 129.999 320.732 127.678 322.961C125.356 325.189 122.6 326.957 119.567 328.163C116.534 329.369 113.283 329.99 110 329.99L10 330C4.47715 330 0 334.477 0 340V350C0 355.523 4.47716 360 10 360H290C295.523 360 300 355.523 300 350V340C300 334.477 295.523 330 290 330L190 329.99C186.717 329.99 183.466 329.369 180.433 328.163C177.4 326.957 174.644 325.189 172.322 322.961C170.001 320.732 168.159 318.087 166.903 315.175C165.648 312.266 165 306 165 306V54.9902C165.001 51.7105 165.648 48.463 166.903 45.4329C168.159 42.3998 170.001 39.6438 172.322 37.3223C174.644 35.0009 177.4 33.1594 180.433 31.903C183.466 30.6466 186.717 30 190 30H290C295.523 30 300 25.5228 300 20V10C300 4.47715 295.523 0 290 0Z" />
</svg>`;

function Scene({ progress, onFinishLoading }: LoadingSceneProps) {
  // T型对象的参数
  const extrudeDepth = 3000;
  const scaleFactor = 0.01;
  const actualDepth = extrudeDepth * scaleFactor; // 实际深度

  // Create a plane for cutting - 设置初始位置在对象外侧
  const [xPlane] = useState(
    new THREE.Plane(new THREE.Vector3(0, 0, 1), -actualDepth / 2),
  );
  const meshRef = useRef<THREE.Mesh>(null!);
  const animationDone = useRef(false);
  const [tShape, setTShape] = useState<THREE.Shape | null>(null);

  // 使用ref存储计算出的模型尺寸
  const modelSizeRef = useRef({
    width: 10,
    height: 10,
    depth: actualDepth,
    centerOffsetX: 0,
    centerOffsetY: 0,
  });

  // Create T-shape on component mount
  useEffect(() => {
    const shape = createShapeFromSvgPath(tShapeSvg);
    setTShape(shape);

    // 计算SVG形状的边界框
    const svgBounds = shape.getPoints().reduce(
      (bounds, p) => {
        bounds.min.x = Math.min(bounds.min.x, p.x);
        bounds.min.y = Math.min(bounds.min.y, p.y);
        bounds.max.x = Math.max(bounds.max.x, p.x);
        bounds.max.y = Math.max(bounds.max.y, p.y);
        return bounds;
      },
      {
        min: { x: Infinity, y: Infinity },
        max: { x: -Infinity, y: -Infinity },
      },
    );

    // 计算模型的尺寸
    const shapeWidth = (svgBounds.max.x - svgBounds.min.x) * scaleFactor;
    const shapeHeight = (svgBounds.max.y - svgBounds.min.y) * scaleFactor;

    // 计算形状的中心点偏移
    const centerX = -((svgBounds.min.x + svgBounds.max.x) / 2) * scaleFactor;
    const centerY = -((svgBounds.min.y + svgBounds.max.y) / 2) * scaleFactor;

    // 保存模型尺寸和中心点偏移
    modelSizeRef.current = {
      width: Math.max(shapeWidth, 10), // 确保最小尺寸
      height: Math.max(shapeHeight, 10),
      depth: actualDepth,
      centerOffsetX: centerX,
      centerOffsetY: centerY,
    };
  }, [actualDepth, scaleFactor]);

  // Animate the cutting plane
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // 基于时间和加载进度计算切割平面位置
    const time = clock.getElapsedTime();
    let targetPosition;

    // 使用实际深度计算切割平面的移动范围
    const startPos = -actualDepth / 2 - 15; // 切割平面起始位置
    const endPos = actualDepth / 2 - 15; // 切割平面终止位置

    // 确保至少动画有3秒
    if (time < 3.0) {
      // 在前3秒，基于时间平滑移动切割平面
      targetPosition = THREE.MathUtils.lerp(
        startPos,
        endPos,
        Math.min(time / 3.0, 1.0),
      );
    } else {
      // 3秒后，如果加载进度完成，则完成切割
      targetPosition = THREE.MathUtils.lerp(startPos, endPos, progress);

      // 当加载和动画都完成时，通知父组件
      if (progress >= 0.99 && !animationDone.current) {
        animationDone.current = true;
        setTimeout(() => {
          onFinishLoading();
        }, 500); // 加一点延迟以便看到完整的切割
      }
    }

    // 更新切割平面位置
    xPlane.constant = targetPosition;
  });

  if (!tShape) {
    return null; // Wait for shape to be created
  }

  // 计算planeHelper的大小，基于模型的尺寸
  const helperSize = Math.max(
    modelSizeRef.current.width,
    modelSizeRef.current.height,
    modelSizeRef.current.depth / 10,
  );

  return (
    <>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Cutter plane={xPlane} wireframeCap={true} hideCapPlanes={true}>
        <mesh
          ref={meshRef}
          position={[
            modelSizeRef.current.centerOffsetX,
            modelSizeRef.current.centerOffsetY,
            -15,
          ]}
          castShadow
          receiveShadow
          scale={scaleFactor}
        >
          <extrudeGeometry
            args={[
              tShape,
              {
                depth: extrudeDepth,
                bevelEnabled: true,
                bevelSegments: 5,
                bevelSize: 1,
                bevelThickness: 1,
              },
            ]}
          />
          <meshStandardMaterial color="#ffd700" roughness={0.5} />
        </mesh>
      </Cutter>

      {/* Wireframe outline of the complete shape */}
      <mesh
        position={[
          modelSizeRef.current.centerOffsetX,
          modelSizeRef.current.centerOffsetY,
          -15,
        ]}
        scale={scaleFactor}
      >
        <extrudeGeometry
          args={[
            tShape,
            {
              depth: extrudeDepth,
              bevelEnabled: true,
              bevelSegments: 5,
              bevelSize: 1,
              bevelThickness: 1,
            },
          ]}
        />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Cutting plane helper */}
      <planeHelper args={[xPlane, helperSize, 0xffff00]} />
    </>
  );
}

export default function LoadingScene({
  onFinishLoading,
}: {
  onFinishLoading: () => void;
}) {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    let startTime = Date.now();
    const minLoadingTime = 3000; // Minimum 3-second loading animation

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / minLoadingTime, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        camera={{
          position: [-30, 20, -10],

          near: 0.1,
          far: 100,
          zoom: 40,
        }}
        orthographic
        gl={{ localClippingEnabled: true }}
      >
        <Scene progress={progress} onFinishLoading={onFinishLoading} />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      {/* Loading text and progress bar */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex flex-col items-center">
        <div className="text-md rounded-md bg-black/50 px-4 py-2 font-medium text-white backdrop-blur-sm">
          Loading {Math.round(progress * 100)}%
        </div>
        <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-black/40 backdrop-blur-sm">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
