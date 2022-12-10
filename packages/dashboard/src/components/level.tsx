import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Graph } from 'api-client';
import { GraphNode } from 'rmf-models';
import { Level as BuildingLevel } from 'api-client';
import { Wall } from './wall';
import { DoorVisual } from './door';
import { Box } from './Box';

export interface LevelProps {
  level: BuildingLevel;
  selected: boolean;
  minx: number;
  miny: number;
}

export function Level({ level, selected, minx, miny }: LevelProps, props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const { doors } = level;
  const rot = new THREE.Euler(0, 0, 0);
  return (
    <>
      {level.wall_graph.edges.length > 0 ? (
        <Wall key={1} opacity={Number(selected)} walls={level.wall_graph}></Wall>
      ) : null}
      {level.doors.map((door, i) => (
        <DoorVisual key={i} opacity={Number(selected)} door={door} />
      ))}
    </>
  );
}
