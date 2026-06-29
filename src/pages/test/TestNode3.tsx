import  { useState, useRef, useEffect, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  color: string;
  hoverColor: string;
  label: string;
}

const Node: FC<NodeProps> = ({ position, color, hoverColor, label }) => {
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  // Retraso para mostrar el tooltip
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (hovered) {
      timeout = setTimeout(() => setShowTooltip(true), 1000); // Retraso de 200ms
    } else {
      setShowTooltip(false);
      clearTimeout(timeout);
    }
    return () => clearTimeout(timeout);
  }, [hovered]);

  return (
    <mesh
      position={position}
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color="transparent" transparent opacity={0} />
      <meshStandardMaterial color={hovered ? hoverColor : color} />
      {showTooltip && (
        <Html position={[0, 0.4, 0]} center>
          <div
            style={{
              backgroundColor: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              color: 'black'
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
};

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}

const Connection: FC<ConnectionProps> = ({ start, end, color = 'white' }) => {
  return <Line points={[start, end]} color={color} lineWidth={2} />;
};

const Scene: FC = () => {
  const nodeData = [
    { position: [-1, 0, 0] as [number, number, number], label: 'Node 1' },
    { position: [1, 0, 0] as [number, number, number], label: 'Node 2' },
    { position: [0, 1, 0] as [number, number, number], label: 'Node 3' },
  ];

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Nodos */}
      {nodeData.map((node, index) => (
        <Node
          key={index}
          position={node.position}
          color="blue"
          hoverColor="red"
          label={node.label}
        />
      ))}

      {/* Conexiones */}
      <Connection start={nodeData[0].position} end={nodeData[1].position} />
      <Connection start={nodeData[1].position} end={nodeData[2].position} />
      <Connection start={nodeData[2].position} end={nodeData[0].position} />

      <OrbitControls />
    </Canvas>
  );
};

const TestNode3: FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Scene />
    </div>
  );
};

export default TestNode3;
