import { useRef, useMemo, useEffect, FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BubbleProps {
  color: string;
  hoverColor: string;
  hovered: boolean;
  scale?: number;
  seed?: number;
}

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHoverColor;
  uniform float uHovered;
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uPointLightPos;
  uniform vec3 uPointLightColor;
  uniform float uPointLightIntensity;
  uniform vec3 uDirLightDir;
  uniform vec3 uDirLightColor;
  uniform float uDirLightIntensity;
  uniform float uAmbient;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    if (!gl_FrontFacing) normal = -normal;

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndv = max(dot(normal, viewDir), 0.0);

    // Fresnel: sharp rim to prevent background bleed
    float fresnel = pow(1.0 - ndv, 5.0);

    vec3 baseColor = mix(uColor, uHoverColor, uHovered);

    // Ambient base
    vec3 ambient = baseColor * uAmbient;

    // Point light (Blinn-Phong + distance attenuation)
    vec3 toPoint = uPointLightPos - vWorldPos;
    vec3 pointDir = normalize(toPoint);
    float pointDist = length(toPoint);
    float pointAtten = 1.0 / (1.0 + pointDist * pointDist * 0.0005);
    float pointDiff = max(dot(normal, pointDir), 0.0);
    vec3 pointHalf = normalize(pointDir + viewDir);
    float pointSpec = pow(max(dot(normal, pointHalf), 0.0), 80.0);
    vec3 pointContrib = (baseColor * pointDiff + vec3(pointSpec))
      * uPointLightColor * uPointLightIntensity * pointAtten;

    // Directional light (Blinn-Phong, parallel rays)
    vec3 dirDir = normalize(uDirLightDir);
    float dirDiff = max(dot(normal, dirDir), 0.0);
    vec3 dirHalf = normalize(dirDir + viewDir);
    float dirSpec = pow(max(dot(normal, dirHalf), 0.0), 80.0);
    vec3 dirContrib = (baseColor * dirDiff + vec3(dirSpec))
      * uDirLightColor * uDirLightIntensity;

    // Compose
    vec3 color = ambient + pointContrib + dirContrib;
    color += baseColor * fresnel * 0.5;
    color += baseColor * 0.1;

    // Alpha
    float alpha = mix(0.15, 0.9, fresnel);
    alpha = mix(alpha, alpha + 0.25, uHovered);
    alpha += sin(uTime * 1.5 + uSeed) * 0.015;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

const Bubble: FC<BubbleProps> = ({
  color,
  hoverColor,
  hovered,
  scale = 2.5,
  seed = 0,
}) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const hoverLerp = useRef(0);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uHoverColor: { value: new THREE.Color(hoverColor) },
      uHovered: { value: 0 },
      uTime: { value: 0 },
      uSeed: { value: seed },
      uPointLightPos: { value: new THREE.Vector3(20, 20, 20) },
      uPointLightColor: { value: new THREE.Color(0xffffff) },
      uPointLightIntensity: { value: 1.5 },
      uDirLightDir: { value: new THREE.Vector3(5, 5, 5) },
      uDirLightColor: { value: new THREE.Color(0xffffff) },
      uDirLightIntensity: { value: 0.8 },
      uAmbient: { value: 0.15 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uHoverColor.value.set(hoverColor);
  }, [color, hoverColor, uniforms]);

  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    hoverLerp.current += (target - hoverLerp.current) * Math.min(delta * 8, 1);
    if (matRef.current) {
      matRef.current.uniforms.uHovered.value = hoverLerp.current;
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Bubble;
