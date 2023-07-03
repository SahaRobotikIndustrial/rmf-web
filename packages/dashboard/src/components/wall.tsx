import * as THREE from 'three';
import { useRef } from 'react';
import { MeshProps } from '@react-three/fiber';
import { Graph } from 'api-client';
import { GraphNode } from 'rmf-models';
import { Cube } from './cube';

interface WallProps {
  walls: Graph;
  opacity: number;
  elevation: number;
}

interface WallSegment {
  position: number[];
  width: number;
  height: number;
  depth: number;
  rot: THREE.Euler;
}

const distance = (v1: GraphNode, v2: GraphNode) => Math.hypot(v2.x - v1.x, v2.y - v1.y);

// const distance = (v1: GraphNode, v2: GraphNode) => Math.sqrt(Math.pow((v2.x - v1.x), 2) + Math.pow((v2.y - v1.y), 2));

const midPoint = (v1: GraphNode, v2: GraphNode) => [(v2.x + v1.x) / 2, (v2.y + v1.y) / 2];

const calculateZ = (v1: GraphNode, v2: GraphNode) => {
  const vector1 = new THREE.Vector3(v1.x, v1.y, 0);
  const vector2 = new THREE.Vector3(v2.x, v2.y, 0);
  const cross = new THREE.Vector3().crossVectors(vector1, vector2);

  return cross.z;
};

const graphToWalls = (graph: Graph, elevation: number) => {
  const walls = [] as WallSegment[];
  const { edges, vertices } = graph;
  // for (let i = 0; i < 7; i++) {
  //   // console.log(vertices)
  //   // console.log(edges)
  //   const v1 = vertices[edges[i].v1_idx];
  //   const v2 = vertices[edges[i].v2_idx];

  //   const depth = distance(v1, v2);

  //   let midpoint = midPoint(v1, v2);
  //   if (i === 7) {
  //     // console.log(v1)
  //     // console.log(v2)
  //     const z = calculateZ(v1, v2)
  //     // console.log(midpoint)
  //     // midpoint = [23.51659164428711, -4.347129716873169]
  //   }

  //   const width = 0.3;
  //   const height = 8;
  //   let position = midpoint.concat(height / 2 + elevation)

  //   if (i === 7) {
  //     const precision = 10;
  //     // position = midpoint.concat(4);
  //     const position = [
  //       Math.round((midpoint[0] + Number.EPSILON) * precision) / precision,
  //       Math.round((midpoint[1] + Number.EPSILON) * precision) / precision,
  //       Math.round(((height / 2 + elevation) + Number.EPSILON) * precision) / precision
  //     ];

  //     // position = [vertices[edges[i].v1_idx].x, vertices[edges[i].v1_idx].y, 4]
  //     console.log(position)
  //   }
  //   const v = new THREE.Vector3(v1.x - v2.x, 0, v1.y - v2.y);
  //   v.normalize();

  //   let rot = new THREE.Euler(0, 0, v.angleTo(new THREE.Vector3(0, 0, 1)));
  //   if (i === 7) {
  //     // const matrix = new THREE.Matrix4().lookAt(v, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
  //     // const rotation = new THREE.Euler().setFromRotationMatrix(matrix);
  //     const upVector = new THREE.Vector3(0, 1, 0);
  //     const cross = new THREE.Vector3().crossVectors(upVector, v);
  //     const rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(upVector, cross));

  //     // console.log('Rotación:', rotation);
  //     // console.log("rotation")
  //     // console.log(rotation)
  //     // // console.log(v.angleTo(new THREE.Vector3(0, 0, 1)))
  //     rot = new THREE.Euler(0, 0, 0);
  //     // console.log("rotation")
  //     // console.log(rot)
  //     // 0.16
  //   }
  //   walls.push({
  //     position,
  //     width,
  //     height,
  //     depth,
  //     rot,
  //   });

  //   if (i === 8) {
  //     // console.log(walls)
  //   }

  // }
  edges.map((edge) => {
    const v1 = vertices[edge.v1_idx];
    const v2 = vertices[edge.v2_idx];

    const depth = distance(v1, v2);
    const midpoint = midPoint(v1, v2);
    const width = 0.3;
    const height = 8;
    const position = midpoint.concat(height / 2 + elevation);
    const v = new THREE.Vector3(v1.x - v2.x, 0, v1.y - v2.y);
    v.normalize();
    const rot = new THREE.Euler(0, 0, v.angleTo(new THREE.Vector3(0, 0, 1)));
    return walls.push({
      position,
      width,
      height,
      depth,
      rot,
    });
  });

  return walls;
};

export function Wall({ walls, elevation, opacity }: WallProps, props: MeshProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const walls_ = graphToWalls(walls, elevation);
  return (
    <>
      {walls_.map((wall, i) => {
        // console.log(wall)
        return (
          <Cube
            key={i}
            rot={wall.rot}
            size={[wall.width, wall.depth, wall.height]}
            position={[wall.position[0], wall.position[1], wall.position[2]]}
          />
        );
      })}
    </>
  );
}
