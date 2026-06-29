import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Tube, } from "@react-three/drei";

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  pulseSpeed?: number;
  thickness?: number;
  flowIntensity?: number;
  activeState?: boolean;
  branchDensity?: number;
}

const NeuralConnection: React.FC<ConnectionProps> = ({
  start,
  end,
  color = "#4fc3f7",
  pulseSpeed = 1,
  thickness = 0.03,
  flowIntensity = 1,
  activeState = false,
  branchDensity = 5
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [active, setActive] = useState(activeState);
  
  // Efecto para activar aleatoriamente la conexión
  useEffect(() => {
    if (!activeState) {
      const interval = setInterval(() => {
        setActive(Math.random() > 0.7);
        setTimeout(() => setActive(false), Math.random() * 500 + 200);
      }, Math.random() * 3000 + 2000);
      
      return () => clearInterval(interval);
    }
  }, [activeState]);
  
  // Generar curva Bezier para la conexión principal
  const { tubePath, points, branches } = useMemo(() => {
    const segments = 50;
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    
    // Punto de control principal para la curva
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const distance = startVec.distanceTo(endVec);
    const randomOffset = distance * (Math.random() * 0.2 + 0.1);
    
    // Añadimos variación para hacer las curvas más interesantes
    mid.x += (Math.random() - 0.5) * randomOffset;
    mid.y += (Math.random() - 0.5) * randomOffset;
    mid.z += (Math.random() - 0.5) * randomOffset;
    
    // Crear curva cuadrática
    const curve = new THREE.QuadraticBezierCurve3(
      startVec,
      mid,
      endVec
    );
    
    const points = Array.from({ length: segments + 1 }, (_, i) => 
      curve.getPoint(i / segments)
    );
    
    // Crear tubo para la ruta
    const tubePath = new THREE.CatmullRomCurve3(points);
    
    // Generar ramificaciones dendríticas
    const branches: {
      path: THREE.CatmullRomCurve3;
      thickness: number;
      length: number;
      startPoint: THREE.Vector3;
      startIdx: number;
      color: string;
    }[] = [];
    
    // Número de ramificaciones basado en la densidad y distancia
    const numBranches = Math.floor(branchDensity * distance / 5);
    
    // Crear ramificaciones dendríticas
    for (let i = 0; i < numBranches; i++) {
      // Decidir si la ramificación sale del inicio o del final
      const fromStart = Math.random() > 0.5;
      const startPoint = fromStart 
        ? points[Math.floor(Math.random() * Math.floor(points.length * 0.3))]
        : points[Math.floor(Math.random() * Math.floor(points.length * 0.3) + points.length * 0.7)];
      
      const startPointCopy = startPoint.clone();
      const startIdx = fromStart ? 0 : points.length - 1;
      
      // Determinar longitud de la ramificación (más corta que el axón principal)
      const branchLength = distance * (Math.random() * 0.3 + 0.1);
      
      // Punto final de la ramificación (dirección aleatoria)
      const endPoint = startPointCopy.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * branchLength,
          (Math.random() - 0.3) * branchLength,
          (Math.random() - 0.4) * branchLength
        )
      );
      
      // Punto de control para la curva
      const ctrlPoint = startPointCopy.clone().add(
        endPoint.clone().sub(startPointCopy).multiplyScalar(0.5)
      );
      
      // Añadir variación al punto de control
      ctrlPoint.add(
        new THREE.Vector3(
          (Math.random() - 0.5) * branchLength * 0.5,
          (Math.random() - 0.5) * branchLength * 0.5,
          (Math.random() - 0.5) * branchLength * 0.5
        )
      );
      
      // Crear la curva de la ramificación
      const branchCurve = new THREE.QuadraticBezierCurve3(
        startPointCopy,
        ctrlPoint,
        endPoint
      );
      
      // Generar puntos para la curva
      const branchPoints = Array.from({ length: 30 }, (_, i) => 
        branchCurve.getPoint(i / 30)
      );
      
      // Crear el camino para el tubo
      const branchPath = new THREE.CatmullRomCurve3(branchPoints);
      
      // Variar el grosor de las ramificaciones (más delgadas que el axón principal)
      const branchThickness = thickness * (Math.random() * 0.4 + 0.2);
      
      // Variar ligeramente el color
      const branchColor = new THREE.Color(color);
      branchColor.r += (Math.random() - 0.5) * 0.1;
      branchColor.g += (Math.random() - 0.5) * 0.1;
      branchColor.b += (Math.random() - 0.5) * 0.1;
      


      branches.push({
        path: branchPath,
        thickness: branchThickness,
        length: branchLength,
        startPoint: startPointCopy,
        startIdx,
        color: branchColor.getStyle()
      });
    }
    
    return { tubePath, points, branches };
  }, [start, end, thickness, color, branchDensity]);
  let copy_points = points;
  copy_points = []
  console.log(copy_points)
  
  // Animar el shader
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.active.value = active ? 1.0 : 0.0;
    }
  });
  
  // Crear gradiente de colores a lo largo de la conexión
  const baseColor = new THREE.Color(color);
  const gradientColors = useMemo(() => {
    const colors = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const c = baseColor.clone();
      // Pequeñas variaciones en el color
      c.r += (Math.random() - 0.5) * 0.1;
      c.g += (Math.random() - 0.5) * 0.1;
      c.b += (Math.random() - 0.5) * 0.1;
      colors.push(c.r, c.g, c.b);
    }
    
    return new Float32Array(colors);
  }, [color]);
  
  return (
    <>
      {/* Tubo principal (axón) */}
      <Tube
        args={[tubePath, 64, thickness * 0.7, 8, false]}
      >
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Tube>
      
      {/* Línea brillante (efecto de "impulso eléctrico") */}
      <Line
        points={tubePath.getPoints(50)}
        color={color}
        lineWidth={active ? 3 : 1}
      >
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            color: { value: new THREE.Color(color) },
            time: { value: 0 },
            thickness: { value: thickness },
            pulseSpeed: { value: pulseSpeed },
            flowIntensity: { value: flowIntensity },
            active: { value: active ? 1.0 : 0.0 },
            gradientColors: { value: gradientColors },
          }}
          vertexShader={`
            varying vec2 vUv;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
              vUv = uv;
              vColor = color;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            uniform float time;
            uniform float thickness;
            uniform float pulseSpeed;
            uniform float flowIntensity;
            uniform float active;
            uniform vec3 gradientColors[21];
            
            varying vec2 vUv;
            varying vec3 vColor;
            
            float random(vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
            
            void main() {
              // Calcular índice para el color del gradiente
              float gradientIndex = vUv.x * 20.0;
              int index = int(gradientIndex);
              vec3 baseColor = gradientColors[index];
              
              // Efecto de flujo con velocidad variable
              float adjustedSpeed = pulseSpeed * (1.0 + active * 2.0);
              float flow = sin(vUv.x * 20.0 - time * adjustedSpeed) * 0.5 + 0.5;
              
              // Partículas que se mueven a lo largo de la conexión
              float particleEffect = 0.0;
              for (int i = 0; i < 5; i++) {
                float offset = float(i) * 0.2;
                float speed = (0.2 + offset) * adjustedSpeed;
                float pos = fract(time * speed + offset);
                float size = 0.02 + 0.02 * active;
                
                // Mover partículas a lo largo de la línea
                float particle = smoothstep(size, 0.0, abs(vUv.x - pos));
                particleEffect += particle;
              }
              
              // Efecto de destello con intensidad variable
              float sparkle = pow(flow, 2.0) * flowIntensity * (1.0 + active * 3.0);
              
              // Añadir ruido para efecto neuronal
              float noise = random(vUv + time * 0.01) * 0.1;
              
              // Aumentar brillo cuando está activa
              float brightness = 1.0 + active * 2.0;
              
              // Color final con efectos combinados
              vec3 finalColor = baseColor * brightness + sparkle * 0.5;
              finalColor += vec3(particleEffect) * 0.3 * (1.0 + active);
              finalColor += noise * finalColor;
              
              // Ajustar opacidad
              float alpha = 0.6 + flow * 0.4 + particleEffect * 0.8 + active * 0.3;
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Line>
      
      {/* Puntos de sinapsis en los extremos */}
      <mesh position={new THREE.Vector3(...start)}>
        <sphereGeometry args={[thickness * 2, 16, 16]} />
        <meshPhongMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={active ? 2 : 0.5}
        />
      </mesh>
      
      <mesh position={new THREE.Vector3(...end)}>
        <sphereGeometry args={[thickness * 2, 16, 16]} />
        <meshPhongMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={active ? 2 : 0.5}
        />
      </mesh>
      
      {/* Dendtirtas (ramificaciones) */}
      {branches.map((branch, index) => (
        <group key={`branch-${index}`}>
          <Tube
            args={[branch.path, 32, branch.thickness * 0.6, 6, false]}
          >
            <meshPhongMaterial
              color={branch.color}
              transparent
              opacity={0.2}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </Tube>
          
          <Line
            points={branch.path.getPoints(30)}
            color={"white"}
            lineWidth={active ? 1.5 : 0.8}
          >
            <shaderMaterial
              uniforms={{
                color: { value: new THREE.Color(branch.color) },
                time: { value: 0 },
                thickness: { value: branch.thickness },
                pulseSpeed: { value: pulseSpeed * 0.7 },
                flowIntensity: { value: flowIntensity * 0.8 },
                active: { value: active ? 1.0 : 0.0 },
              }}
              vertexShader={`
                varying vec2 vUv;
                
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                uniform vec3 color;
                uniform float time;
                uniform float thickness;
                uniform float pulseSpeed;
                uniform float flowIntensity;
                uniform float active;
                
                varying vec2 vUv;
                
                float random(vec2 st) {
                  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }
                
                void main() {
                  // Efecto de flujo con velocidad variable
                  float adjustedSpeed = pulseSpeed * (1.0 + active * 2.0);
                  float flow = sin(vUv.x * 15.0 - time * adjustedSpeed) * 0.5 + 0.5;
                  
                  // Partículas más pequeñas en las ramificaciones
                  float particleEffect = 0.0;
                  for (int i = 0; i < 3; i++) {
                    float offset = float(i) * 0.3;
                    float speed = (0.15 + offset) * adjustedSpeed;
                    float pos = fract(time * speed + offset);
                    float size = 0.015 + 0.01 * active;
                    float particle = smoothstep(size, 0.0, abs(vUv.x - pos));
                    particleEffect += particle;
                  }
                  
                  // Efecto de destello con intensidad variable
                  float sparkle = pow(flow, 2.0) * flowIntensity * (1.0 + active * 2.0);
                  
                  // Añadir ruido para efecto neuronal
                  float noise = random(vUv + time * 0.01) * 0.15;
                  
                  // Aumentar brillo cuando está activa
                  float brightness = 1.0 + active * 2.0;
                  
                  // Color final con efectos combinados
                  vec3 finalColor = color * brightness + sparkle * 0.4;
                  finalColor += vec3(particleEffect) * 0.6 * (1.0 + active);
                  finalColor += noise * finalColor;
                  
                  // Ajustar opacidad - más transparente que el axón principal
                  float alpha = (0.4 + flow * 0.3 + particleEffect * 0.6 + active * 0.2) * (1.0 - vUv.x * 0.3);
                  
                  gl_FragColor = vec4(finalColor, alpha);
                }
              `}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </Line>
          
          {/* Pequeños botones sinápticos en las terminaciones dendríticas */}
          <mesh position={branch.path.getPoint(1)}>
            <sphereGeometry args={[branch.thickness * 1.5, 8, 8]} />
            <meshPhongMaterial 
              color={branch.color} 
              emissive={branch.color}
              emissiveIntensity={active ? 1.5 : 0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* Añadir espinas dendríticas (pequeñas protuberancias) */}
      {Array.from({ length: Math.floor(branchDensity * 3) }).map((_, index) => {
        // Seleccionar un punto aleatorio a lo largo de la ruta principal
        const randomT = Math.random();
        const position = tubePath.getPoint(randomT);
        const scale = thickness * (Math.random() * 0.6 + 0.3);
        
        return (
          <mesh 
            key={`spine-${index}`} 
            position={position}
            scale={[scale, scale, scale]}
            rotation={[
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2,
              Math.random() * Math.PI * 2
            ]}
          >
            <tetrahedronGeometry />
            <meshPhongMaterial 
              color={color} 
              transparent 
              opacity={0.5}
              emissive={color}
              emissiveIntensity={active ? 1 : 0.2}
            />
          </mesh>
        );
      })}
    </>
  );
};

export default NeuralConnection;
