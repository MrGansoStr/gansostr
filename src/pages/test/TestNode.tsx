import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Node = ({ position, color, hoverColor }: {position: [number, number, number], color: string, hoverColor: string}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <>
    <mesh
      position={position}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={hovered ? hoverColor : color} />
    </mesh>
    </>
  );
};

const Scene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Node position={[-1, 0, 0]} color="blue" hoverColor="red" />
      <Node position={[1, 0, 0]} color="green" hoverColor="yellow" />
      
      <OrbitControls />
    </Canvas>
  );
};

export default function TestNode() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Scene />
    </div>
  );
}
