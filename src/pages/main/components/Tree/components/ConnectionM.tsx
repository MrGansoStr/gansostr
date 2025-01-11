import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  pulseSpeed?: number;
  thickness?: number;
  flowIntensity?: number;
}

const ConnectionM: React.FC<ConnectionProps> = ({
  start,
  end,
  color = "#4fc3f7",
  pulseSpeed = 1,
  thickness = 0.1,
  flowIntensity = 1,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generar curva Bezier para una conexión más orgánica
  const points = useMemo(() => {
    const segments = 50;
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Punto de control para la curva
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const offset = Math.abs(startVec.z - endVec.z) * 0.5;
    mid.y += offset;
    
    const curve = new THREE.QuadraticBezierCurve3(
      startVec,
      mid,
      endVec
    );

    return Array.from({ length: segments + 1 }, (_, i) => 
      curve.getPoint(i / segments)
    );
  }, [start, end]);

  // Animar el shader
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
          itemSize={3}
          count={points.length}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          color: { value: new THREE.Color(color) },
          time: { value: 0 },
          thickness: { value: thickness },
          pulseSpeed: { value: pulseSpeed },
          flowIntensity: { value: flowIntensity },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = vec2(position.y, 0.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float time;
          uniform float thickness;
          uniform float pulseSpeed;
          uniform float flowIntensity;
          varying vec2 vUv;

          void main() {
            // Efecto de flujo
            float flow = sin(vUv.x * 10.0 - time * pulseSpeed) * 0.5 + 0.5;
            
            // Efecto de destello
            float sparkle = pow(flow, 3.0) * flowIntensity;
            
            // Efecto de brillo en los bordes
            float edge = pow(1.0 - abs(vUv.y), 2.0) * thickness;
            
            // Color base con brillo
            vec3 baseColor = color + sparkle * 0.5;
            
            // Añadir brillo blanco para el efecto de energía
            vec3 finalColor = mix(baseColor, vec3(1.0), sparkle * 0.3);
            
            // Opacidad variable para efecto de pulso
            float alpha = edge * (0.5 + flow * 0.5);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
};

export default ConnectionM;