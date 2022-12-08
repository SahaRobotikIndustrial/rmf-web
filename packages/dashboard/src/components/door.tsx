import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { Ref, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Euler, StringKeyframeTrack } from 'three';
import { DoorState, GraphNode } from 'api-client';
// import { Door } from 'api-client';
import { Box } from './Box';
import { Door } from 'rmf-models';
import { RmfAppContext } from './rmf-app';
import { DoorMode } from 'rmf-models';

function distance(v1_x: number, v1_y: number, v2_x: number, v2_y: number) {
  return Math.hypot(v2_x - v1_x, v2_y - v1_y);
}

function midPoint(v1_x: number, v1_y: number, v2_x: number, v2_y: number) {
  return [(v2_x + v1_x) / 2, (v2_y + v1_y) / 2];
}

export interface DoorVisualProps {
  door: Door;
  opacity: number;
}

interface SingleDoorProps {
  door: Door;
  opacity: number;
  meshRef: React.Ref<THREE.Mesh>;
  doorState: number;
}

function SingleSwingDoorClosed({ meshRef, opacity, door, doorState }: SingleDoorProps) {
  const { v1_x, v1_y, v2_x, v2_y, door_type, motion_direction, name } = door;
  const thickness = 0.5;
  const height = 8;
  const v = new THREE.Vector3(v1_x - v2_x, 0, v1_y - v2_y);
  v.normalize();
  const b = v.angleTo(new THREE.Vector3(0, 0, 1));
  const rot = new THREE.Euler(0, 0, b);
  const pos = midPoint(v1_x, v1_y, v2_x, v2_y).concat(height / 2);
  const dist = distance(v1_x, v1_y, v2_x, v2_y);
  return (
    <Box
      meshRef={meshRef}
      position={pos}
      size={[thickness, dist, height]}
      rot={rot}
      color={'red'}
    ></Box>
  );
}

export function DoorVisual(doorVisProps: DoorVisualProps, props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const { door } = doorVisProps;
  const rmf = React.useContext(RmfAppContext);
  const [doorState, setDoorState] = React.useState<DoorState | null>(null);
  React.useEffect(() => {
    if (!rmf) {
      return;
    }
    const sub = rmf.getDoorStateObs(door.name).subscribe(setDoorState);
    return () => sub.unsubscribe();
  }, [rmf, door]);

  useFrame(() => {
    if (ref.current) {
      if (doorState?.current_mode.value === 1) {
        ref.current.rotation.z += 0.1;
      }
    }
  });

  // switch (doorState?.current_mode.value){
  //   case DoorMode.MODE_CLOSED:
  //     return <SingleSwingDoorClosed {...doorVisProps} {...doorState} />
  //   case DoorMode.MODE_OPEN:
  //     ref.current.rotateZ(0.5);
  //     return <SingleSwingDoorOpened {...doorVisProps} {...doorState} />
  //   default:
  //     return null;
  // }

  // switch (doorState?.current_mode.value){
  //   case DoorMode.MODE_CLOSED:
  //     break;
  //   case DoorMode.MODE_OPEN:
  //     ref.current.rotateZ(0.5);
  //     break;
  //   case DoorMode.MODE_MOVING:
  //     ref.current.rotateY(0.5);
  //     break;
  //   }

  return (
    <SingleSwingDoorClosed
      {...doorVisProps}
      meshRef={ref}
      doorState={doorState?.current_mode.value || DoorMode.MODE_CLOSED}
    />
  );
  // switch (door.door_type) {
  //   case Door.DOOR_TYPE_DOUBLE_SWING:
  //     return <SingleSwingDoor {...doorVisProps} />
  //   default:
  //     return null;
  // }
}
