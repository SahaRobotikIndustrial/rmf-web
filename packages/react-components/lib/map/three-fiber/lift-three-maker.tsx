import React from 'react';
import { LiftState } from 'api-client';
import { Text, Line } from '@react-three/drei';
import { BufferGeometry, BufferAttribute, Vector3, Euler } from 'three';
import { LiftState as RmfLiftState } from 'rmf-models';
import { getLiftModeText } from '../lift-marker';
import { TextThreeRendering } from './text-maker';

interface LiftMakerProps {
  x: number;
  y: number;
  yaw: number;
  width: number;
  depth: number;
  liftState: LiftState;
}

interface LiftShapeMakerProps {
  motionState: number;
  fontPath?: string;
}

const LiftShapeMaker = ({ motionState, fontPath }: LiftShapeMakerProps) => {
  const vertices = new Float32Array([0, 1, 0, -0.5, -0.5, 0, 0.5, -0.5, 0]);

  const generateTriangleShape = (rotation: Euler) => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    return (
      <mesh geometry={geometry} rotation={rotation}>
        <meshBasicMaterial color="red" />
      </mesh>
    );
  };

  const generateLineShape = () => {
    const points = [
      [-0.5, 0.5, 0],
      [0.5, 0.5, 0],
      [0.5, -0.5, 0],
      [-0.5, -0.5, 0],
      [-0.5, 0.5, 0],
    ].map((point) => new Vector3(...point));

    return <Line points={points} color="black" linewidth={1} />;
  };

  const generateTextShape = () => {
    return (
      <div>
        <TextThreeRendering position={[0, 0, 0]} text={'N/A - N/A'} centered={true} />
      </div>
    );
  };

  let shapeComponent;

  switch (motionState) {
    case RmfLiftState.MOTION_UP:
      shapeComponent = generateTriangleShape(new Euler(0, 0, 0));
      break;
    case RmfLiftState.MOTION_DOWN:
      shapeComponent = generateTriangleShape(new Euler(0, 0, Math.PI));
      break;
    case RmfLiftState.MOTION_STOPPED:
      shapeComponent = generateLineShape();
      break;
    default:
      shapeComponent = generateTextShape();
      break;
  }

  return shapeComponent;
};

export const LiftThreeMaker = ({
  x,
  y,
  yaw,
  width,
  depth,
  liftState,
}: LiftMakerProps): JSX.Element => {
  return (
    <group position={[x, y, yaw]}>
      <TextThreeRendering
        position={[0, 0, 0]}
        text={`${getLiftModeText(liftState)}\n${liftState.current_floor}`}
        centered={true}
      />
      <LiftShapeMaker motionState={liftState.motion_state} />
      <mesh position={[0, 0, 0]} rotation={[0, 0, yaw]}>
        <boxGeometry args={[width, depth, 0.1]} />
        <meshStandardMaterial color={'green'} opacity={0.6} transparent />
      </mesh>
    </group>
  );
};
