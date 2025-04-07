// src/components/NeuronModel.tsx
import { useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Group, MeshStandardMaterial } from 'three'

export default function LoaderNeuron() {
  const obj = useLoader(OBJLoader, '/Neuron.obj')
  const ref = useRef<Group>(null)
    obj.traverse((child:any) => {
        // Asegúrate de que el child sea una malla
        if ('isMesh' in child && child.isMesh) {
        child.material = new MeshStandardMaterial({ color: 0xff0000 })
        }
    })

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002
    }
  })

  return <primitive ref={ref} object={obj} scale={0.1} />
}
