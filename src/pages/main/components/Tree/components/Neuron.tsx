import { useRef, useMemo, useEffect, FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_CONN_LIGHTS = 32;

export interface ConnLightState {
  positions: THREE.Vector3[];
  startEnds: Array<{ s: THREE.Vector3; e: THREE.Vector3 }>;
}

interface BubbleProps {
  color: string;
  hoverColor: string;
  hovered: boolean;
  scale?: number;
  seed?: number;
  connLightState?: ConnLightState;
  isStatic?: boolean;
  brightness?: number;
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
  uniform vec3 uConnLights[32];
  uniform int uConnLightCount;
  uniform vec3 uConnLightColor;
  uniform float uConnLightIntensity;
  uniform float uBrightness;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    if (!gl_FrontFacing) normal = -normal;

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float ndv = max(dot(normal, viewDir), 0.0);

    // Fresnel: sharp rim
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

    // Directional light (Blinn-Phong)
    vec3 dirDir = normalize(uDirLightDir);
    float dirDiff = max(dot(normal, dirDir), 0.0);
    vec3 dirHalf = normalize(dirDir + viewDir);
    float dirSpec = pow(max(dot(normal, dirHalf), 0.0), 80.0);
    vec3 dirContrib = (baseColor * dirDiff + vec3(dirSpec))
      * uDirLightColor * uDirLightIntensity;

    // Compose scene lights
    vec3 color = ambient + pointContrib + dirContrib;

    // Connection lights (moving energy pulses)
    for (int i = 0; i < 32; i++) {
      if (i >= uConnLightCount) break;
      vec3 toLight = uConnLights[i] - vWorldPos;
      float dist = length(toLight);
      vec3 lightDir = toLight / max(dist, 0.001);
      float atten = 1.0 / (1.0 + dist * dist * 0.003);
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 64.0);
      float pulse = 0.7 + sin(uTime * 2.5 + float(i) * 0.8) * 0.3;
      vec3 lc = uConnLightColor * uConnLightIntensity * atten * pulse;
      color += baseColor * diff * lc;
      color += vec3(spec) * lc;
    }

    color += baseColor * fresnel * 0.5 * uBrightness;
    color += baseColor * 0.35 * uBrightness;

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
  connLightState,
  isStatic = false,
  brightness = 1.0,
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
      uPointLightIntensity: { value: 2.5 },
      uDirLightDir: { value: new THREE.Vector3(5, 5, 5) },
      uDirLightColor: { value: new THREE.Color(0xffffff) },
      uDirLightIntensity: { value: 1.5 },
      uAmbient: { value: 0.4 },
      uConnLights: {
        value: Array.from({ length: MAX_CONN_LIGHTS }, () => new THREE.Vector3()),
      },
      uConnLightCount: { value: 0 },
      uConnLightColor: { value: new THREE.Color(0xccddff) },
      uConnLightIntensity: { value: 3.0 },
      uBrightness: { value: brightness },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uHoverColor.value.set(hoverColor);
    uniforms.uBrightness.value = brightness;
  }, [color, hoverColor, brightness, uniforms]);

  useFrame((_, delta) => {
    if (!matRef.current) return;

    if (!isStatic) {
      const target = hovered ? 1 : 0;
      hoverLerp.current += (target - hoverLerp.current) * Math.min(delta * 8, 1);
      matRef.current.uniforms.uHovered.value = hoverLerp.current;
    }
    matRef.current.uniforms.uTime.value += delta;

    if (connLightState) {
      const lights = connLightState.positions;
      const count = Math.min(lights.length, MAX_CONN_LIGHTS);
      const uniformLights = uniforms.uConnLights.value as THREE.Vector3[];
      for (let i = 0; i < count; i++) {
        uniformLights[i].copy(lights[i]);
      }
      uniforms.uConnLightCount.value = count;
    }
  });

  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[1, isStatic ? 32 : 64, isStatic ? 32 : 64]} />
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
