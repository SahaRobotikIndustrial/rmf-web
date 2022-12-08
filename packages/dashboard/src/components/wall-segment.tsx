import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { GraphNode } from 'api-client';

export interface WallSegmentProps {
  v1: number[];
  v2: number[];
}

// function WallShapeSegmentBuilder(v1:GraphNode, v2:GraphNode) {
//     const shape = new THREE.Shape();
//     shape.moveTo( v1.x, v1.y );
//     shape.lineTo( v1.x, v1.y + v2.y );
//     shape.lineTo( v1.x + v2.x, v1.y + v2.y );
//     shape.lineTo( v1.x + v2.x, v1.y );
//     shape.lineTo( v1.x, v1.y );
//     return shape;
// }

function WallShapeSegmentBuilder(v1: number[], v2: number[]) {
  const shape = new THREE.Shape();
  shape.moveTo(v1[0], v1[1]);
  shape.lineTo(v1[0], v1[1] + v2[1]);
  shape.lineTo(v1[0] + v2[0], v1[1] + v2[1]);
  shape.lineTo(v1[0] + v2[0], v1[1]);
  shape.lineTo(v1[0], v1[1]);
  return shape;
}

export function WallShapeSegment({ v1, v2 }: WallSegmentProps, props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref} userData={{ depth: 5 }}>
      <extrudeGeometry args={[WallShapeSegmentBuilder(v1, v2), { depth: 2 }]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  );
}
