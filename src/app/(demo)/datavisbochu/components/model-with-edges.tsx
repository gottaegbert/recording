import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect } from 'react';

export interface MaterialControls {
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  edgeThickness: number;
  edgeColor: string;
}

interface ModelWithEdgesProps {
  materialControls: MaterialControls;
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
}

export function ModelWithEdges({
  materialControls,
  hovered,
  setHovered,
}: ModelWithEdgesProps) {
  const { scene } = useGLTF('/models/tube.glb');

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(time * 0.2) * 8;
    state.camera.position.z = Math.cos(time * 0.2) * 8;
    state.camera.position.y = 3;
    state.camera.lookAt(0, 0, 0);
  });

  // 遍历场景中的所有网格并添加边缘效果
  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // 设置材质
        object.material = new THREE.MeshPhysicalMaterial({
          metalness: materialControls.metalness,
          roughness: materialControls.roughness,
          clearcoat: materialControls.clearcoat,
          clearcoatRoughness: materialControls.clearcoatRoughness,
          transparent: true,
          opacity: 0.2,
        });

        // 添加边缘几何体
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(object.geometry),
          new THREE.LineBasicMaterial({
            color: hovered ? '#00dffd' : materialControls.edgeColor,
            linewidth: 1,
          }),
        );
        object.add(edges);
      }
    });
  }, [scene, hovered, materialControls]);

  return (
    <primitive
      object={scene}
      scale={0.4} // 增大模型尺寸
      position={[0, -0.05, 0]} // 调整位置更靠近中心
      rotation={[0, Math.PI / 4, 0]} // 稍微旋转以展示更好的角度
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}
