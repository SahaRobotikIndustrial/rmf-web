import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Graph } from 'api-client';

export interface WallProps {
  walls: Graph;
}

function RoundedRect(width: number, height: number, radius: number) {
  const roundedRectShape = new THREE.Shape();

  roundedRectShape.moveTo(-(width / 2), -(height / 2) + radius);
  roundedRectShape.lineTo(-(width / 2), height / 2 - radius);
  roundedRectShape.quadraticCurveTo(-(width / 2), height / 2, -(width / 2) + radius, height / 2);
  roundedRectShape.lineTo(width / 2 - radius, height / 2);
  roundedRectShape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - radius);
  roundedRectShape.lineTo(width / 2, -(height / 2) + radius);
  roundedRectShape.quadraticCurveTo(width / 2, -(height / 2), width / 2 - radius, -(height / 2));
  roundedRectShape.lineTo(-(width / 2) + radius, -(height / 2));
  roundedRectShape.quadraticCurveTo(
    -(width / 2),
    -(height / 2),
    -(width / 2),
    -(height / 2) + radius,
  );

  return roundedRectShape;
}

export function Wall({ walls }: WallProps, props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <shapeGeometry args={[RoundedRect(1, 1, 0.2)]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
