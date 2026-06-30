import { useRef, useMemo, useEffect, FC } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Tube } from "@react-three/drei";
import Bubble from "./Neuron";
import type { ConnLightState } from "./Neuron";

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  startColor?: string;
  endColor?: string;
  thickness?: number;
  connLightState?: ConnLightState;
}

const brightenColor = (color: string, minLightness = 0.35): THREE.Color => {
  const c = new THREE.Color(color);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(hsl.s + 0.15, 1), Math.max(hsl.l, minLightness));
  return c;
};

const NeuronConnection: FC<ConnectionProps> = ({
  start,
  end,
  startColor = "#4fc3f7",
  endColor = "#4fc3f7",
  thickness = 0.3,
  connLightState,
}) => {
  const tubeMatRef = useRef<THREE.ShaderMaterial>(null);

  const { tubePath, brightPoints } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const distance = startVec.distanceTo(endVec);

    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const offset = distance * 0.15;
    mid.x += (Math.random() - 0.5) * offset;
    mid.y += (Math.random() - 0.5) * offset;
    mid.z += (Math.random() - 0.5) * offset;

    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    const segments = 50;
    const points = Array.from({ length: segments + 1 }, (_, i) =>
      curve.getPoint(i / segments)
    );
    const tubePath = new THREE.CatmullRomCurve3(points);

    const numMid = 2 + Math.floor(Math.random() * 3);
    const sc = brightenColor(startColor, 0.45);
    const ec = brightenColor(endColor, 0.45);
    const allT = [
      0,
      ...Array.from({ length: numMid }, (_, i) => (i + 1) / (numMid + 1)),
      1,
    ];
    const brightPoints = allT.map((t) => {
      const color = sc.clone().lerp(ec, t);
      const isEndpoint = t === 0 || t === 1;
      return {
        pos: curve.getPoint(t),
        colorHex: `#${color.getHexString()}`,
        size: thickness * (isEndpoint ? 1.0 + Math.random() * 0.5 : 0.5 + Math.random() * 1.2),
      };
    });

    return { tubePath, brightPoints };
  }, [start, end, startColor, endColor, thickness]);

  const tubeUniforms = useMemo(
    () => ({
      uStartColor: { value: brightenColor(startColor) },
      uEndColor: { value: brightenColor(endColor) },
      uTime: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    tubeUniforms.uStartColor.value.copy(brightenColor(startColor));
    tubeUniforms.uEndColor.value.copy(brightenColor(endColor));
  }, [startColor, endColor, tubeUniforms]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (tubeMatRef.current) {
      tubeMatRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <>
      {/* Tube with color gradient (node fusion) */}
      <Tube args={[tubePath, 64, thickness * 0.5, 8, false]}>
        <shaderMaterial
          ref={tubeMatRef}
          uniforms={tubeUniforms}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uStartColor;
            uniform vec3 uEndColor;
            uniform float uTime;
            varying vec2 vUv;

            void main() {
              // Color fusion: gradient start -> end
              vec3 color = mix(uStartColor, uEndColor, vUv.x);

              // Flowing energy particles
              float flow = 0.0;
              for (int i = 0; i < 4; i++) {
                float offset = float(i) * 0.25;
                float pos = fract(uTime * 0.25 + offset);
                float particle = smoothstep(0.05, 0.0, abs(vUv.x - pos));
                flow += particle;
              }

              // Pulse wave
              float wave = sin(vUv.x * 8.0 - uTime * 1.5) * 0.15 + 0.85;
              color *= wave;
              color += vec3(flow) * 0.6;

              float alpha = 0.35 + flow * 0.5;
              gl_FragColor = vec4(color, alpha);
            }
          `}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Tube>

      {/* Static bubbles along the connection */}
      {brightPoints.map((bp, i) => (
        <group key={i} position={[bp.pos.x, bp.pos.y, bp.pos.z]}>
          <Bubble
            color={bp.colorHex}
            hoverColor={bp.colorHex}
            hovered={false}
            scale={bp.size}
            seed={i}
            isStatic
            connLightState={connLightState}
          />
        </group>
      ))}
    </>
  );
};

export default NeuronConnection;
