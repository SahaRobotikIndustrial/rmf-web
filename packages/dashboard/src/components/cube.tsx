import * as THREE from 'three';
import { useRef } from 'react';
import React from 'react';
import { MeshProps, useThree, Canvas } from '@react-three/fiber';

export interface CubeProps {
  position: number[];
  // thickness, length, height
  rot: THREE.Euler;
  size: number[];
  meshRef?: React.Ref<THREE.Mesh>;
  color?: string;
}

export function Cube({ position, size, rot, color, meshRef }: CubeProps, props: MeshProps) {
  const ref = useRef<THREE.Mesh>(null!);

  return (
    // <group scale={0.5}>
    <mesh
      {...props}
      position={[position[0], position[1], position[2]]}
      rotation={rot}
      scale={[size[0], size[1], size[2]]}
      ref={meshRef || null}
      material-transparent
      material-opacity={0.2}
      material-depthWrite={false}
    >
      {/* <boxGeometry args={[size[0], size[1], size[2]]} /> */}
      <planeBufferGeometry attach="geometry" />
      {/* <boxGeometry /> */}
      <meshStandardMaterial color={color || 'blue'} opacity={0.2} transparent />
    </mesh>
    // </group>
  );
}
