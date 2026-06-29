import  { useState, useRef, FC, useEffect } from 'react';
import { Canvas,  useLoader } from '@react-three/fiber';
import { OrbitControls, Html, } from '@react-three/drei';
import * as THREE from 'three';
import { Button, Card, Tooltip } from 'antd';
import { UseContextMainPage } from '../../Context/ContextMainPage';
import { gen_positions } from '../../utils/node.utils';
import DataScienceJson from "../../../../infoToShow/Nodes.json"
import DescriptionsJson from "../../../../infoToShow/AllTreev2.json"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import NeuronConnection from './components/NeuronConnection';

interface NodeProps {
  position: [number, number, number];
  id_connected?: [string];
  id_node: string;
  legend_code?: string;
  color: string;
  hoverColor: string;
  label: string;
  info?: {summary: string, all_info: string, more_info?:boolean}
  onButtonClick?: () => void;
}

const Node: FC<NodeProps> = ({
  position,
  color,
  hoverColor,
  label,
  id_node,
  info,
}) => {
  const { setModalOpen, setIdComponent } = UseContextMainPage()
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  const originalObj = useLoader(OBJLoader, '/Neuron.obj')
  const [obj, setObj] = useState<THREE.Object3D | null>(null)

useEffect(() => {
  if (originalObj) {
    const cloned = originalObj.clone(true)
    setObj(cloned)
  }
}, [originalObj])

  // Actualizamos el color de cada malla cuando cambia el estado hovered.
  useEffect(() => {
    if (obj) { 
      obj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
        color: hovered ? hoverColor : color,
        metalness: 0.2,
        roughness: 0.5,
        map: null,
        normalMap: null,
        roughnessMap: null,
        displacementMap: null,
      });
      }
    })
    }
    
  }, [hovered, color, hoverColor, obj])

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

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Se muestra el modelo OBJ cargado */}
      {obj && <primitive object={obj} scale={1.7} />}
      
      {/* Tooltip con información */}
      <Html position={[0, 0, 0]} center style={{ zIndex: "1", position: "absolute" }}>
        <Tooltip
          title={
            <>
              <Card
                size="small"
                title={label}
                extra={
                  info?.more_info ? (
                    <Button size="small" onClick={handleShowMore}>
                      Más info
                    </Button>
                  ) : null
                }
                style={{ width: 300 }}
              >
                {info?.all_info}
              </Card>
            </>
          }
        >
          <div style={{ color: 'white', borderRadius: '2rem', padding: '10px' }} />
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
  info?: {summary: string, all_info: string, more_info?: boolean};
}

const Scene: FC = () => {
  const random_positions = gen_positions(DataScienceJson.DataScience.nodes.length)

  const nodeData: nodePositions[] = [];
  let help_index = 0;
  const dict_nodes: { [key: string]: {position: [number, number, number], label: string} } = {};
  const dict_colors: { [key: string] : {color: string}} = DataScienceJson.DataScience.colors_node;
  const dict_nodes_description: {[key:string] : {summary: string, all_info: string, more_info?: boolean}} = DescriptionsJson.NodesDescription;

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
    };
    help_index++;
  })

  
  const handleNodeAction = (label: string) => {
    alert(`Button clicked on ${label}`);
  };
  console.log(nodeData)
  return (
    <Canvas camera={{position: [90, 90, 25], fov: 30}}>
      <ambientLight intensity={20} />
      <pointLight position={[20, 20, 20]} />
      <directionalLight
        position={[5, 5, 5]}
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
          />
          ))}

      {
        connections_all.map((connection, index) => (
          <NeuronConnection key={index} start={dict_nodes[connection.from].position} end={dict_nodes[connection.to].position}
          color="white"
          branchDensity={0.2} 
          thickness={0.3}
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
    <div style={{ height: '90vh', width: '99vw', border: "" }}>
      <Scene />
    </div>
  );
};

export default MainTree;
