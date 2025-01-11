import { useState, useRef, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  color: string;
  hoverColor: string;
  onHover?: (hovered: boolean) => void;
}

const Node: FC<NodeProps> = ({ position, color, hoverColor, onHover }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerOver = () => {
    setHovered(true);
    if (onHover) onHover(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (onHover) onHover(false);
  };

  return (
    <mesh
      position={position}
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.25, 50, 50]} />
      <meshStandardMaterial color={hovered ? hoverColor : color} />
    </mesh>
  );
};

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}

const Connection: FC<ConnectionProps> = ({ start, end, color = 'white' }) => {
  return <Line points={[start, end]} color={color} lineWidth={1} />;
};

const Scene: FC = () => {
  const nodePositions: [number, number, number][] = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
  ];

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Nodos */}
      {nodePositions.map((pos, index) => (
        <Node
          key={index}
          position={pos}
          color="blue"
          hoverColor="red"
        />
      ))}

      {/* Conexiones */}
      <Connection start={nodePositions[0]} end={nodePositions[1]} />
      <Connection start={nodePositions[1]} end={nodePositions[2]} />
      <Connection start={nodePositions[2]} end={nodePositions[0]} />

      <OrbitControls />
    </Canvas>
  );
};

const TestNode2: FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Scene />
    </div>
  );
};

export default TestNode2;
