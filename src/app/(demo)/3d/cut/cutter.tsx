/* eslint-disable react/display-name */
import * as React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';

export type CutterProps = {
  children: React.ReactNode;
  plane: THREE.Plane;
  wireframeCap?: boolean;
  hideCapPlanes?: boolean;
};

export type CutterRef = {
  update: () => void;
};

const Cutter = React.forwardRef<CutterRef, CutterProps>(
  (
    {
      children,
      plane,
      wireframeCap = false,
      hideCapPlanes = false,
    }: CutterProps,
    fRef,
  ) => {
    const rootGroupRef = React.useRef<THREE.Group>(null);

    const [meshList, setMeshList] = React.useState<THREE.Mesh[]>([]);
    const [capMaterialList, setCapMaterialList] = React.useState<
      THREE.Material[]
    >([]);
    const [planeSize, setPlaneSize] = React.useState(2);

    const update: () => void = React.useCallback(() => {
      const meshChildren: THREE.Mesh[] = [];
      const capMatList: THREE.Material[] = [];
      const rootGroup = rootGroupRef.current;
      if (rootGroup) {
        rootGroup.traverse((child: THREE.Object3D) => {
          const mesh = child as THREE.Mesh;
          // 检查对象是否为Mesh并有材质
          if (
            mesh.isMesh &&
            mesh.material &&
            !('isBrush' in mesh && mesh.isBrush)
          ) {
            mesh.matrixAutoUpdate = false;
            mesh.geometry.computeBoundingBox();
            //
            // Add clipping planes to each mesh and make sure that the material is
            // double sided. This is needed to create PlaneStencilGroup for the
            // mesh.
            //
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat: THREE.Material) => {
                (mat as any).clippingPlanes = [plane];
                mat.side = THREE.DoubleSide;
              });
            } else {
              (mesh.material as any).clippingPlanes = [plane];
              mesh.material.side = THREE.DoubleSide;
            }
            meshChildren.push(mesh);
            //
            // Create material for the cap based on the stencil created by
            // PlaneStencilGroup for the mesh.
            //
            // :TODO: This implementation does not work if the mesh uses and array
            // of materials. This needs to be fixed.
            //
            const capMaterial = Array.isArray(mesh.material)
              ? mesh.material[0].clone()
              : mesh.material.clone();
            (capMaterial as any).clippingPlanes = null;
            (capMaterial as any).stencilWrite = true;
            (capMaterial as any).stencilRef = 0;
            capMaterial.side = THREE.DoubleSide;
            (capMaterial as any).stencilFunc = THREE.NotEqualStencilFunc;
            (capMaterial as any).stencilFail = THREE.ReplaceStencilOp;
            (capMaterial as any).stencilZFail = THREE.ReplaceStencilOp;
            (capMaterial as any).stencilZPass = THREE.ReplaceStencilOp;

            // 如果wireframeCap为true，设置为线框模式
            if (wireframeCap) {
              (capMaterial as any).wireframe = true;
              (capMaterial as any).transparent = true;
              (capMaterial as any).opacity = 0.7;
              // 可以设置线框颜色，使其更加明显
              (capMaterial as any).color = new THREE.Color(0x00ffff);
            }

            capMatList.push(capMaterial);
          }
        });
        //
        const bbox = new THREE.Box3();
        bbox.setFromObject(rootGroup);
        //
        const boxSize = new THREE.Vector3();
        bbox.getSize(boxSize);
        //
        setPlaneSize(2.0 * boxSize.length());
      }
      //
      // Update the list of children that are meshes.
      //
      setMeshList(meshChildren);
      //
      // Dispose old cap materials.
      //
      capMaterialList.forEach((item: THREE.Material) => item.dispose());
      //
      // Save the new cap material list.
      //
      setCapMaterialList(capMatList);
      //
      // Cleanup function for when this component is unmounted
      //
      // return () => {
      //   capMaterialList.forEach((item: THREE.material) => item.dispose());
      // };
    }, [capMaterialList, plane, wireframeCap, hideCapPlanes]);

    const planeListRef = React.useRef<Map<number, any>>(new Map());

    // See
    // https://react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
    function getPlaneListMap() {
      if (!planeListRef.current) {
        // Initialize the Map on first usage.
        planeListRef.current = new Map();
      }
      return planeListRef.current;
    }

    useFrame(() => {
      const map = getPlaneListMap();
      map.forEach((planeObj) => {
        if (planeObj) {
          plane.coplanarPoint(planeObj.position);
          planeObj.lookAt(
            planeObj.position.x - plane.normal.x,
            planeObj.position.y - plane.normal.y,
            planeObj.position.z - plane.normal.z,
          );
        }
      });
    });

    React.useEffect(() => void update(), [children, update]);
    React.useImperativeHandle(fRef, () => ({ update }), [update]);

    return (
      <group>
        <group ref={rootGroupRef}>{children}</group>
        <group>
          {meshList.map((meshObj, index) => (
            // eslint-disable-next-line no-use-before-define
            <PlaneStencilGroup
              key={meshObj.id}
              meshObj={meshObj}
              plane={plane}
              renderOrder={index + 1}
            />
          ))}
        </group>
        {!hideCapPlanes &&
          meshList.map((meshObj, index) => (
            <group key={meshObj.id}>
              <Plane
                ref={(node) => {
                  const map = getPlaneListMap();
                  if (node) {
                    map.set(index, node);
                  } else {
                    map.delete(index);
                  }
                }}
                args={[planeSize, planeSize]}
                renderOrder={index + 1.1}
                onAfterRender={(gl) => gl.clearStencil()}
                material={capMaterialList[index]}
              />
            </group>
          ))}
      </group>
    );
  },
);

type PlaneStencilGroupProps = {
  meshObj: THREE.Mesh;
  plane: THREE.Plane;
  renderOrder: number;
};

function PlaneStencilGroup({
  meshObj,
  plane,
  renderOrder,
}: PlaneStencilGroupProps) {
  //
  meshObj.updateMatrix();
  meshObj.updateMatrixWorld();
  //
  // :IMPORTANT: We must apply all the world transformations of the meshObj to
  // the stencil too. Otherwise, the stencil may have different
  // position/scale/rotation as compared to the original meshObj.
  //
  const parentPosition = new THREE.Vector3();
  meshObj.getWorldPosition(parentPosition);
  //
  const parentScale = new THREE.Vector3();
  meshObj.getWorldScale(parentScale);
  //
  const parentQuaternion = new THREE.Quaternion();
  meshObj.getWorldQuaternion(parentQuaternion);
  //
  return (
    meshObj && (
      <group
        position={parentPosition}
        scale={parentScale}
        quaternion={parentQuaternion}
      >
        <mesh geometry={meshObj.geometry} renderOrder={renderOrder}>
          <meshBasicMaterial
            depthWrite={false}
            depthTest={false}
            colorWrite={false}
            stencilWrite={true}
            stencilFunc={THREE.AlwaysStencilFunc}
            side={THREE.FrontSide}
            clippingPlanes={[plane]}
            stencilFail={THREE.DecrementWrapStencilOp}
            stencilZFail={THREE.DecrementWrapStencilOp}
            stencilZPass={THREE.DecrementWrapStencilOp}
          />
        </mesh>
        <mesh geometry={meshObj.geometry} renderOrder={renderOrder}>
          <meshBasicMaterial
            depthWrite={false}
            depthTest={false}
            colorWrite={false}
            stencilWrite={true}
            stencilFunc={THREE.AlwaysStencilFunc}
            side={THREE.BackSide}
            clippingPlanes={[plane]}
            stencilFail={THREE.IncrementWrapStencilOp}
            stencilZFail={THREE.IncrementWrapStencilOp}
            stencilZPass={THREE.IncrementWrapStencilOp}
          />
        </mesh>
      </group>
    )
  );
}

export default Cutter;
