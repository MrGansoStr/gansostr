import { useState, useRef, useMemo, FC } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, } from '@react-three/drei';
import * as THREE from 'three';
import { Button, Card, Tooltip } from 'antd';
import { UseContextMainPage } from '../../Context/ContextMainPage';
import { gen_positions } from '../../utils/node.utils';
import DataScienceJson from "../../../../infoToShow/Nodes.json"
import DescriptionsJson from "../../../../infoToShow/AllTreev2.json"
import Bubble from './components/Neuron';
import type { ConnLightState } from './components/Neuron';
import NeuronConnection from './components/NeuronConnection';
import './TreeTooltip.css';

interface NodeProps {
  position: [number, number, number];
  id_connected?: [string];
  id_node: string;
  legend_code?: string;
  color: string;
  hoverColor: string;
  label: string;
  info?: { summary: string, all_info: string, more_info?: boolean }
  onButtonClick?: () => void;
  seed?: number;
  connLightState?: ConnLightState;
}

const Node: FC<NodeProps> = ({
  position,
  color,
  hoverColor,
  label,
  id_node,
  info,
  seed,
  connLightState,
}) => {
  const { setModalOpen, setIdComponent } = UseContextMainPage()
  const [hovered, setHovered] = useState(false)
  const [overTooltip, setOverTooltip] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  const handlePointerOver = () => {
    setHovered(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
  }

  const handleShowMore = () => {
    setModalOpen(true)
    setIdComponent(id_node)
  }

  const tooltipOpen = hovered || overTooltip

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <Bubble
        color={color}
        hoverColor={hoverColor}
        hovered={hovered}
        seed={seed}
        connLightState={connLightState}
        brightness={12.0}
        scale={4}
      />

      {/* Tooltip con información */}
      <Html position={[0, 0, 0]} center style={{ zIndex: "1", position: "absolute" }}>
        <Tooltip
          open={tooltipOpen}
          overlayClassName="tree-tooltip"
          overlayInnerStyle={{ maxWidth: 300, padding: 0 }}
          title={
            <div
              onMouseEnter={() => setOverTooltip(true)}
              onMouseLeave={() => setOverTooltip(false)}
            >
              <Card
                size="small"
                title={label}
                className="tree-tooltip-card"
                extra={
                  info?.more_info ? (
                    <Button size="small" onClick={handleShowMore}>
                      Más info
                    </Button>
                  ) : null
                }
              >
                {info?.all_info}
              </Card>
            </div>
          }
        >
          <div style={{ width: 0, height: 0 }} />
        </Tooltip>
      </Html>
    </group>
  )
}

interface nodePositions {
  id_node: string;
  position: [number, number, number];
  label: string;
  color?: string;
  info?: { summary: string, all_info: string, more_info?: boolean };
}

const LightUpdater: FC<{ state: ConnLightState }> = ({ state }) => {
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const len = Math.min(state.startEnds.length, state.positions.length);
    for (let i = 0; i < len; i++) {
      const { s, e } = state.startEnds[i];
      const phase = (t * 0.25 + i * 0.1) % 1.0;
      state.positions[i].lerpVectors(s, e, phase);
    }
  });
  return null;
};

const Scene: FC = () => {
  const random_positions = gen_positions(DataScienceJson.DataScience.nodes.length)

  const nodeData: nodePositions[] = [];
  let help_index = 0;
  const dict_nodes: { [key: string]: { position: [number, number, number], label: string, color: string } } = {};
  const dict_colors: { [key: string]: { color: string } } = DataScienceJson.DataScience.colors_node;
  const dict_nodes_description: { [key: string]: { summary: string, all_info: string, more_info?: boolean } } = DescriptionsJson.NodesDescription;

  const nodes_all = DataScienceJson.DataScience.nodes;
  const connections_all = DataScienceJson.DataScience.connections;

  random_positions.forEach(value => {
    nodeData.push({
      position: value as [number, number, number],
      label: nodes_all[help_index].name,
      id_node: nodes_all[help_index].id,
      color: nodes_all[help_index]?.colorType !== undefined ? dict_colors[nodes_all[help_index]?.colorType]?.color : "white",
      info: dict_nodes_description[nodes_all[help_index].id]
    });
    dict_nodes[nodes_all[help_index].id] = {
      position: value as [number, number, number],
      label: nodes_all[help_index].name,
      color: nodes_all[help_index]?.colorType !== undefined ? dict_colors[nodes_all[help_index]?.colorType]?.color ?? "white" : "white",
    };
    help_index++;
  })


  const handleNodeAction = (label: string) => {
    alert(`Button clicked on ${label}`);
  };

  const connLightState = useMemo<ConnLightState>(() => {
    const startEnds = connections_all.map(conn => ({
      s: new THREE.Vector3(...dict_nodes[conn.from].position),
      e: new THREE.Vector3(...dict_nodes[conn.to].position),
    }));
    const positions = startEnds.map(({ s, e }) =>
      new THREE.Vector3().lerpVectors(s, e, 0.5)
    );
    return { positions, startEnds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Canvas camera={{ position: [100, 100, 70], fov: 45 }}>
      <LightUpdater state={connLightState} />

      <ambientLight intensity={20} />
      <pointLight position={[60, 60, 60]} />
      <directionalLight
        position={[50, 50, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Nodos */}
      {nodeData.map((node, index) => (
        <Node
          key={index}
          position={node.position}
          id_node={node.id_node}
          color={node.color ? node.color : "#41034d"}
          info={node.info}
          hoverColor="white"
          label={node.label}
          onButtonClick={() => handleNodeAction(node.label)}
          seed={index}
          connLightState={connLightState}
        />
      ))}

      {
        connections_all.map((connection, index) => (
          <NeuronConnection key={index}
            start={dict_nodes[connection.from].position}
            end={dict_nodes[connection.to].position}
            startColor={dict_nodes[connection.from].color}
            endColor={dict_nodes[connection.to].color}
            thickness={0.3}
            connLightState={connLightState}
          />
        ))
      }

      <OrbitControls />
      <mesh castShadow receiveShadow />
    </Canvas>
  );
};

const MainTree: FC = () => {
  return (
    <div style={{ height: '90vh', width: '100%', border: "" }}>
      <Scene />
    </div>
  );
};

export default MainTree;
