import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Graph } from 'api-client';
import { GraphNode } from 'rmf-models';

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

export interface WallSegment {
  position: number[];
  width: number;
  height: number;
  depth: number;
}

function distance(v1: GraphNode, v2: GraphNode) {
  return Math.hypot(v2.x - v1.x, v2.y - v1.y);
}

function midPoint(v1: GraphNode, v2: GraphNode) {
  return [(v2.x + v1.x) / 2, (v2.y + v1.y) / 2];
}
function graphToWalls(graph: Graph) {
  const walls = [] as WallSegment[];
  for (const edge of graph.edges) {
    const depth = distance(graph.vertices[edge.v1_idx], graph.vertices[edge.v1_idx]);
    const midpoint = midPoint(graph.vertices[edge.v1_idx], graph.vertices[edge.v1_idx]);
    const width = 1;
    const heigt = 5;
    const position = midpoint.concat(heigt);
    walls.push({ position: position, width: width, height: heigt, depth: depth } as WallSegment);
  }
  return walls;
}

export function Wall({ walls }: WallProps, props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  return (
    <>
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
      {graphToWalls(walls).length > 0
        ? graphToWalls(walls).map((wall) => {
            <mesh
              {...props}
              position={[wall.position[0], wall.position[1], wall.position[2]]}
              ref={ref}
              scale={clicked ? 1.5 : 1}
              onClick={(event) => click(!clicked)}
              onPointerOver={(event) => hover(true)}
              onPointerOut={(event) => hover(false)}
            >
              <boxGeometry args={[wall.depth, wall.width, wall.height]} />
              <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            </mesh>;
          })
        : null}
    </>
  );
}
