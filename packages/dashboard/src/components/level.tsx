import * as THREE from 'three';
import { useRef } from 'react';
import { MeshProps } from '@react-three/fiber';
import { Level as BuildingLevel } from 'api-client';
import { Wall } from './wall';
import { Door } from './door';

export interface LevelProps {
  level: BuildingLevel;
  show: boolean;
}

export function Level({ level, show }: LevelProps, props: MeshProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { doors, elevation } = level;
  // console.log(level)
  return (
    <>
      {level.wall_graph.edges.length > 0 ? (
        <Wall elevation={elevation} opacity={Number(show)} walls={level.wall_graph} />
      ) : null}

      {doors.length &&
        doors.map((door, i) => (
          <Door key={i} door={door} opacity={0.1} height={8} elevation={elevation} />
        ))}
    </>
  );
}
