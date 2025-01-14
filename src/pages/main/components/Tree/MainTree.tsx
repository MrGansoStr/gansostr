import React, { useState, useRef, FC, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, Line,  } from '@react-three/drei';
import * as THREE from 'three';
import { Button, Card, Tooltip } from 'antd';
// import { Line } from "@react-three/drei";
import { UseContextMainPage } from '../../Context/ContextMainPage';
import { gen_positions } from '../../utils/node.utils';
import DataScienceJson from "../../../../infoToShow/Nodes.json"
import DescriptionsJson from "../../../../infoToShow/AllTreev2.json"
// import AsphaltTexture from "./assets/asphalt_track_diff_2k.jpg"
import { EXRLoader } from 'three/examples/jsm/Addons.js';
import ConnectionM from './components/ConnectionM';

interface NodeProps {
  position: [number, number, number];
  id_connected?: [any];
  id_node?: any;
  legend_code?: string;
  color: string;
  hoverColor: string;
  label: string;
  info?: {summary: string, all_info: string, more_info?:boolean}
  onButtonClick?: () => void;
}

const Node: FC<NodeProps> = ({ position, color, hoverColor, label, id_node, info, }) => {
  const { setModalOpen, setIdComponent} = UseContextMainPage();
  // console.log("el Modal esta abierto",modalOpen)
  // const texture = useLoader(THREE.TextureLoader, "/rubber_tiles_diff_2k.jpg");
  const normalMap = useLoader(EXRLoader, '/rubber_tiles_nor_gl_2k.exr');
  const roughnessMap = useLoader(EXRLoader, '/rubber_tiles_rough_2k.exr');
  const displacementMap = useLoader(THREE.TextureLoader, '/rubber_tiles_disp_2k.png');
  const diffuseMap = useLoader(THREE.TextureLoader, '/rubber_tiles_diff_2k.jpg');

  // setModalOpen(false)
  const [hovered, setHovered] = useState(false);
  const [_tooltipVisible, setTooltipVisible] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  // console.log("NODO HOVER",hovered)

  const handlePointerOver = () => {
    setHovered(true);
    setTooltipVisible(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    setTooltipVisible(false);
  };

  // const handleTooltipMouseEnter = () => {
  //   setTooltipVisible(true);
  // };

  // const handleTooltipMouseLeave = () => {
  //   setTooltipVisible(true);
  // };

  const handleShowMore = () => {
    setModalOpen(true);
    setIdComponent(id_node);
  }
  

  // Animación de pulsación
  // useEffect(() => {
  //   if (hovered && meshRef.current) {
  //     const mesh = meshRef.current;
  //     let scale = 1;
  //     const animate = () => {
  //       scale = 1 + Math.sin(Date.now() * 0.005) * 0.05; // Oscila entre 1 y 1.05
  //       mesh.scale.set(scale, scale, scale);
  //       requestAnimationFrame(animate);
  //     };
  //     animate();
  //   } else if (meshRef.current) {
  //     meshRef.current.scale.set(1, 1, 1); // Restablecer escala
  //   }
  // }, [hovered]);

  return (
    <mesh
      position={position}
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial
          map={diffuseMap} // Textura base
          normalMap={normalMap} // Simula relieve
          roughnessMap={roughnessMap} // Controla rugosidad
          displacementMap={displacementMap} // Relieve físico
          displacementScale={0.1} // Ajusta la intensidad del relieve
          // displacementScale={0.1} // Ajusta la intensidad del relieve
          // metalness={0.01} // Nivel metálico
          roughness={0.5} // Rugosidad base
        // map={texture}
        color={hovered ? hoverColor : color}
        // roughness={0.45} // Controla el acabado mate/brillante
        // metalness={0.2} // Da un efecto metálico
        // emissive={hovered ? hoverColor : "white"} // Añade un brillo
        // emissiveMap={texture}
        // emissiveIntensity={hovered ? 0.5 : 0} // Brillo solo al "hover"
        // transparent
        // opacity={1} // Efecto de transparencia
      />
      {/* <meshStandardMaterial color={hovered ? hoverColor : color} /> */}
      {(
        <Html position={[0, 0, 0]} center style={{border: '', zIndex: "1", position: "absolute"}}>
            <Tooltip style={{border: "1px solid red"}} title={() => 
            <>
            <Card  size="small" title={label} extra={info?.more_info ? <Button size='small' onClick={() => handleShowMore()}>Más info</Button> : <></>} style={{ width: 300 }}>
              {info?.all_info}
            </Card>

            </>}>
                <div style={{border: '', position: "relative", zIndex: "2", margin: "0px", color:'white', borderRadius: "2rem", padding: '19px'}}>
                    
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

export const ConnectionNew: FC<ConnectionProps> = ({ start, end }) => {
  
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <tubeGeometry args={[curve, 32, 0.15, 16, false]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uTexture: { value: new THREE.TextureLoader().load('/linetexture1.jpg') },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float spark = abs(sin(uv.y * 30.0 + uTime * 5.0)); // Línea brillante
            spark = smoothstep(0.4, 0.5, spark); // Suavizado
            vec3 color = vec3(0.49, 0.51, 0.96) * spark; // Color azul eléctrico
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

export const Connection: FC<ConnectionProps> = ({ start, end, color = 'white' }) => {

  return <Line points={[start, end]} color={color} lineWidth={0.8} />;

};

export const ConnectionNew3: React.FC<ConnectionProps> = ({ start, end, color = "white" }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generar puntos para la curva
  const points = useMemo(() => {
    const segments = 50; // Número de puntos en la línea
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const pointsArray: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const position = new THREE.Vector3().lerpVectors(startVec, endVec, t);
      pointsArray.push(position);
    }

    return pointsArray;
  }, [start, end]);

  // Animar el shader uniform
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flatMap((p) => p.toArray()))}
          itemSize={7}
          count={points.length}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          color: { value: new THREE.Color(color) },
          time: { value: 0 },
        }}
        vertexShader={`
          varying float vUv;
          void main() {
            vUv = position.y; // Usar la posición para variar el efecto
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float time;
          varying float vUv;
          void main() {
            float pulse = sin(vUv * 10.0 + time * 5.0) * 0.5 + 0.5; // Onda animada
            vec3 finalColor = mix(color, vec3(1.0, 1.0, 1.0), pulse); // Gradiente dinámico
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
        transparent
      />
    </line>
  );
};

export const ConnectionNew2: React.FC<ConnectionProps> = ({ start, end, color = "white" }) => {
  const lineRef = useRef<THREE.Line | any>(null);

  // Generar puntos con una onda dinámica
  const points = useMemo(() => {
    const segments = 10; // Número de puntos en la curva
    const waveFrequency = 15; // Frecuencia de las ondas
    const waveAmplitude = 0.7; // Amplitud de las ondas
    const pointsArray: THREE.Vector3[] = [];

    const startVec = new THREE.Vector3(...start); // Convertir a Vector3
    const endVec = new THREE.Vector3(...end); // Convertir a Vector3

    for (let i = 0; i <= segments; i++) {
      const t = i / segments; // Progresión a lo largo de la línea
      const x = THREE.MathUtils.lerp(startVec.x, endVec.x, t); // Interpolación entre start.x y end.x
      const y =
        THREE.MathUtils.lerp(startVec.y, endVec.y, t) +
        Math.sin(t * waveFrequency * Math.PI) * waveAmplitude; // Onda sinusoidal en y
      const z = THREE.MathUtils.lerp(startVec.z, endVec.z, t); // Interpolación entre start.z y end.z

      pointsArray.push(new THREE.Vector3(x, y, z));
    }
    return pointsArray;
  }, [start, end]);

  // Animación de los puntos intermedios
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (lineRef.current) {
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length / 3; i++) {
        const t = i / (positions.length / 3 - 1);
        positions[i * 3 + 1] += Math.sin(t * 5 * Math.PI + time) * 0.05; // Oscilación en y
      }

      geometry.attributes.position.needsUpdate = true; // Actualizar geometría
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points.map((point) => point.toArray())} // Convertir Vector3 a [x, y, z]
      color={color}
      lineWidth={1} // Grosor de la línea
      dashed={false} // Línea continua
    />
  );
};




interface nodePositions {
  id_node: string;
  position: [number, number, number];
  label: string;
  color?: string;
  info?: {summary: string, all_info: string, more_info?: boolean};
}

const Scene: FC = () => {
  const random_positions = gen_positions(DataScienceJson.DataScience.nodes.length)

  let nodeData: nodePositions[] = [];
  let help_index = 0;
  let dict_nodes: { [key: string]: {position: [number, number, number], label: string} } = {};
  let dict_colors: { [key: string] : {color: string}} = DataScienceJson.DataScience.colors_node;
  let dict_nodes_description: {[key:string] : {summary: string, all_info: string, more_info?: boolean}} = DescriptionsJson.NodesDescription;

  let nodes_all = DataScienceJson.DataScience.nodes;
  let connections_all = DataScienceJson.DataScience.connections;
  

  
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
  // console.log(nodeData)
  // console.log(dict_nodes)
  
  const handleNodeAction = (label: string) => {
    alert(`Button clicked on ${label}`);
  };

  return (
    <Canvas camera={{position: [170, 250, -10], fov: 50}}>
      <ambientLight intensity={20} />
      <pointLight position={[20, 20, 20]} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* <AccumulativeShadows
  temporal
  frames={100}
  alphaTest={0.9}
  scale={10}
  position={[0, -5, 0]}
>
  <RandomizedLight
    amount={8}
    radius={10}
    intensity={1}
    ambient={0.5}
    position={[5, 5, -10]}
    bias={0.001}
  />
      </AccumulativeShadows> */}
      {/* Nodos */}
      {nodeData.map((node, index) => (
        <Node
          key={index}
          position={node.position}
          id_node={node.id_node}
          color={node.color ? node.color : "black"}
          info={node.info}
          hoverColor="white"
          label={node.label}
          onButtonClick={() => handleNodeAction(node.label)}
          />
          ))}

      {
        connections_all.map((connection, index) => (
          <ConnectionM key={index} start={dict_nodes[connection.from].position} end={dict_nodes[connection.to].position}
          color="#4fc3f7"
  pulseSpeed={3.5}
  thickness={1.65}
  flowIntensity={3.2}/>
        ))
      }

      {/* Conexiones */}
      {/* <Connection start={nodeData[0].position} end={nodeData[1].position} /> */}
      {/* <Connection start={nodeData[1].position} end={nodeData[2].position} /> */}
      {/* <Connection start={nodeData[2].position} end={nodeData[0].position} /> */}

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
