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
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHoverColor;
  uniform float uHovered;
  uniform float uTime;
  uniform float uSeed;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  vec3 thinFilm(float t) {
    return vec3(
      sin(t * 3.0) * 0.5 + 0.5,
      sin(t * 3.0 + 2.1) * 0.5 + 0.5,
      sin(t * 3.0 + 4.2) * 0.5 + 0.5
    );
  }

  void main() {
    vec3 normal = vNormal;
    if (!gl_FrontFacing) normal = -normal;

    float ndv = max(dot(normal, vViewDir), 0.0);

    // Fresnel: transparent center, opaque rim
    float fresnel = pow(1.0 - ndv, 3.0);

    vec3 baseColor = mix(uColor, uHoverColor, uHovered);

    // Iridescence at grazing angles
    vec3 irid = thinFilm((1.0 - ndv) * 7.0 + uTime * 0.4 + uSeed * 1.3);

    // Two specular highlights (key + fill)
    vec3 light1 = normalize(vec3(0.5, 0.85, 0.6));
    vec3 light2 = normalize(vec3(-0.4, -0.3, 0.6));
    float spec1 = pow(max(dot(vViewDir, reflect(-light1, normal)), 0.0), 90.0);
    float spec2 = pow(max(dot(vViewDir, reflect(-light2, normal)), 0.0), 40.0) * 0.35;

    // Bright pinch hotspot (top-left)
    vec3 pinch = normalize(vec3(-0.6, 0.7, 0.4));
    float pinchSpec = pow(max(dot(vViewDir, reflect(-pinch, normal)), 0.0), 200.0);

    // Compose
    vec3 color = baseColor * (0.2 + ndv * 0.3);
    color += irid * fresnel * 0.7;
    color += vec3(spec1) * 1.0;
    color += vec3(spec2) * 0.5;
    color += vec3(pinchSpec) * 1.2;
    color += baseColor * fresnel * 0.5;
    color += baseColor * 0.08;

    // Alpha
    float alpha = mix(0.05, 0.88, fresnel);
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
