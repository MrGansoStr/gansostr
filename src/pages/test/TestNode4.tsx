import { useState, useRef, FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Button, Tooltip } from 'antd';

interface NodeProps {
  position: [number, number, number];
  color: string;
  hoverColor: string;
  label: string;
  onButtonClick?: () => void;
}

const Node: FC<NodeProps> = ({ position, color, hoverColor, label  }) => {
  const [hovered, setHovered] = useState(false);
  const [, setTooltipVisible] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  console.log("NODO HOVER",hovered)

  const handlePointerOver = () => {
    setHovered(true);
    setTooltipVisible(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    setTooltipVisible(false);
  };

  return (
    <mesh
      position={position}
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={hovered ? hoverColor : color} />
      {(
        <Html position={[0, 0, 0]} center style={{border: ''}}>
            <Tooltip title={() => <>{label} <Button size='small'>Ver modal</Button></>}>
                <div style={{border: '1px solid white', margin: "0px", color:'blue', borderRadius: "2rem", padding: ''}}>
                    test
                </div>
            </Tooltip>
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

  const handleNodeAction = (label: string) => {
    alert(`Button clicked on ${label}`);
  };

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
          onButtonClick={() => handleNodeAction(node.label)}
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

const TestNode4: FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Scene />
    </div>
  );
};

export default TestNode4;
