import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import LoaderNeuron from "./LoaderNeuron"

export default function TestNeuron() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <LoaderNeuron />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}
