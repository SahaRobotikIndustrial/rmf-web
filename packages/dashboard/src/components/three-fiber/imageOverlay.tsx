import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Level } from 'api-client';

export interface ImageThreeProps {
  level: Level;
  imageUrl: string;
}

export const ImageThree = ({ level, imageUrl }: ImageThreeProps) => {
  const texture = useLoader(TextureLoader, imageUrl);
  const image = level.images[0];
  const scale = image.scale;
  const x_offset = (texture.image.width * scale) / 2 + image.x_offset;
  const y_offset = -(texture.image.height * scale) / 2 + image.y_offset;

  return (
    <mesh position={[x_offset, y_offset, 0]}>
      <planeGeometry
        attach="geometry"
        args={[texture.image.width * scale, texture.image.height * scale]}
      />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
};
