import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Graph } from 'api-client';
import { GraphNode } from 'rmf-models';
import { Box } from './Box';
import { WallShapeSegment } from './wall-segment';
import { LineSegments } from 'three';
import { LineE } from './line';
export interface WallProps {
  walls: Graph;
  opacity: number;
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
  rot: THREE.Euler;
}

function distance(v1: GraphNode, v2: GraphNode) {
  return Math.hypot(v2.x - v1.x, v2.y - v1.y);
}

function midPoint(v1: GraphNode, v2: GraphNode) {
  return [(v2.x + v1.x) / 2, (v2.y + v1.y) / 2];
}
function graphToWalls(graph: Graph) {
  const walls_ = [] as WallSegment[];
  let minx = 999;
  let miny = 999;
  for (const edge of graph.edges) {
    const v1 = graph.vertices[edge.v1_idx];
    const v2 = graph.vertices[edge.v2_idx];
    if (v1.x < minx) {
      minx = v1.x;
    }
    if (v1.y < miny) {
      miny = v1.y;
    }

    const depth = distance(v1, v2);
    const midpoint = midPoint(v1, v2);
    const width = 0.5;
    const heigt = 8;
    const position = midpoint.concat(heigt / 2);
    const v = new THREE.Vector3(v1.x - v2.x, 0, v1.y - v2.y);
    v.normalize();
    const b = v.angleTo(new THREE.Vector3(0, 0, 1));
    const rot = new THREE.Euler(0, 0, b);
    walls_.push({
      position: position,
      width: width,
      height: heigt,
      depth: depth,
      rot: rot,
    } as WallSegment);
  }
  return { walls_, minx, miny };
}

interface WallsProps {
  wallSegments: WallSegment[];
}

function Walls({ wallSegments }: WallsProps) {
  return wallSegments.map((wall, i) => (
    <mesh key={i} position={[wall.position[0], wall.position[1], wall.position[2]]}>
      <boxGeometry args={[wall.depth, wall.height, wall.width]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  ));
}

export function Wall({ walls }: WallProps, props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const { walls_ } = graphToWalls(walls);
  const edges = walls.edges;
  const verts = walls.vertices;
  return (
    <>
      {/* <Box color='black' vec={[0, 0, 0]} size={[0.5, 0.5, 0.5]} position={[0, 0, 0]}></Box>
      <Box color='blue' vec={[0, 0, 0]} size={[0.5, 0.5, 0.5]} position={[0, 0, 5]}></Box>
      <Box color='red' vec={[0, 0, 0]} size={[0.5, 0.5, 0.5]} position={[0, 5, 0]}></Box>
      <Box color='orange' vec={[0, 0, 0]} size={[0.5, 0.5, 0.5]} position={[5, 0, 0]}></Box> */}

      {/* {walls_.map((wall, i)=>(
      <Box color='red' vec={[0, 0, 0]} size={[0.2, 0.2, 0.2]} position={[verts[edges[i].v1_idx].x-minx, verts[edges[i].v1_idx].y -miny, 0]}></Box>
      // <Box key={-i} vec={wall.vec} size={[wall.width, wall.depth, wall.height]} position={[wall.position[0]-minx, wall.position[1]-miny, wall.position[2]]}></Box>
      // <WallShapeSegment key={i} v1={verts[edges[i].v1_idx]} v2={verts[edges[i].v2_idx]}></WallShapeSegment>
    ))}
    {walls_.map((wall, i)=>(
      <Box color='black' vec={[0, 0, 0]} size={[0.2, 0.2, 0.2]} position={[verts[edges[i].v2_idx].x-minx, verts[edges[i].v2_idx].y -miny, 0]}></Box>
      // <Box key={-i} vec={wall.vec} size={[wall.width, wall.depth, wall.height]} position={[wall.position[0]-minx, wall.position[1]-miny, wall.position[2]]}></Box>
    ))}
    {walls_.map((wall, i)=>(
      <LineE start={[verts[edges[i].v1_idx].x-minx, verts[edges[i].v1_idx].y-miny]} end={[verts[edges[i].v2_idx].x-minx, verts[edges[i].v2_idx].y-miny]}></LineE>
    ))}
    {/* {walls_.map((wall, i)=>(
      i<10?
      (
      <Box key={9} vec={walls_[i].vec} size={[walls_[i].width, walls_[i].depth, walls_[i].height]} position={[walls_[i].position[0]-minx, walls_[i].position[1]-miny, walls_[i].position[2]]}></Box>
      ):(null)
    ))} */}
      {walls_.map((wall, i) => (
        <Box
          key={9}
          rot={walls_[i].rot}
          size={[walls_[i].width, walls_[i].depth, walls_[i].height]}
          position={[walls_[i].position[0], walls_[i].position[1], walls_[i].position[2]]}
        ></Box>
      ))}

      {/* {walls_.map((wall, i)=>( */}
      {/* <Box key={99} vec={walls_[0].vec} size={[walls_[0].width, walls_[0].depth, walls_[0].height]} position={[walls_[0].position[0]-minx, walls_[0].position[1]-miny, walls_[0].position[2]]}></Box>
      <Box key={9} vec={walls_[1].vec} size={[walls_[1].width, walls_[1].depth, walls_[1].height]} position={[walls_[1].position[0]-minx, walls_[1].position[1]-miny, walls_[1].position[2]]}></Box>
      <Box key={9} vec={walls_[2].vec} size={[walls_[2].width, walls_[2].depth, walls_[2].height]} position={[walls_[2].position[0]-minx, walls_[2].position[1]-miny, walls_[2].position[2]]}></Box>
      <Box key={9} vec={walls_[3].vec} size={[walls_[3].width, walls_[3].depth, walls_[3].height]} position={[walls_[3].position[0]-minx, walls_[3].position[1]-miny, walls_[3].position[2]]}></Box> */}

      {/* // ))}  */}
      {/* {walls_.map((wall, i)=>(
      <WallShapeSegment key={i} v1={[verts[edges[i].v1_idx].x-minx, verts[edges[i].v1_idx].y-miny]} v2={[verts[edges[i].v2_idx].x-minx, verts[edges[i].v2_idx].y-miny]}></WallShapeSegment>
    ))} */}
      {/* {walls_.map((wall, i)=>(
      <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={2}
          itemSize={3}
          array={[verts[edges[i].v1_idx].x-minx, verts[edges[i].v1_idx].y-miny, 0, verts[edges[i].v2_idx].x-minx, verts[edges[i].v2_idx].y-miny, 0]}
        />
      </bufferGeometry>
          <lineBasicMaterial
          attach="material"
          color={"#9c88ff"}
          linewidth={0.3}
        />
        </mesh>
    ))} */}
    </>
    // <>
    // {walls_.length > 0
    //   ? walls_.map((wall, i) => {
    //       <mesh
    //       key={i}
    //         {...props}
    //         position={[1.2,0,0]}
    //         ref={ref}
    //       >
    //         <boxGeometry args={[walls_[0].depth, walls_[0].width, walls_[0].height]} />
    //         <meshStandardMaterial color={'orange'} />
    //       </mesh>;
    //     })
    //   : null}
    //   </>
    // <Walls wallSegments={walls_}></Walls>
  );
}
