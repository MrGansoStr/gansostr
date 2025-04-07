// src/three-stdlib.d.ts (o donde lo hayas creado)

declare module 'athree-stdlib/lines/MeshLine' {
  import * as THREE from 'three';

  // Declaración básica para MeshLine (puedes añadir más métodos si los usas)
  export class MeshLine extends THREE.BufferGeometry {
    constructor();
    setPoints(points: THREE.Vector3[] | Float32Array, p?: (t: number) => number): void;
    // geometry: THREE.BufferGeometry; // Propiedad interna, no siempre necesaria declarar
  }

  // Declaración para MeshLineMaterial con parámetros comunes y los tuyos
  export class MeshLineMaterial extends THREE.ShaderMaterial {
    constructor(parameters?: {
      lineWidth?: number;
      color?: THREE.Color | string | number;
      map?: THREE.Texture;
      useMap?: boolean;
      alphaMap?: THREE.Texture;
      useAlphaMap?: boolean;
      resolution: THREE.Vector2; // ¡Importante! Necesita la resolución del canvas
      sizeAttenuation?: boolean; // true = el grosor es en unidades del mundo, false = en píxeles
      dashArray?: number;
      dashOffset?: number;
      dashRatio?: number;
      useDash?: boolean;
      visibility?: number;
      alphaTest?: number;
      repeat?: THREE.Vector2;
      // Hereda otros parámetros de ShaderMaterial/Material...
    });

    // Asegúrate de que los uniformes que usas estén aquí (incluidos los de MeshLine y los tuyos)
    uniforms: {
      lineWidth: { value: number };
      map: { value: THREE.Texture | null };
      useMap: { value: number }; // 0 o 1
      alphaMap: { value: THREE.Texture | null };
      useAlphaMap: { value: number }; // 0 o 1
      resolution: { value: THREE.Vector2 };
      sizeAttenuation: { value: number }; // 0 o 1
      dashArray: { value: number };
      dashOffset: { value: number };
      dashRatio: { value: number };
      color: { value: THREE.Color };
      // Tus uniformes personalizados:
      uColor: { value: THREE.Color };
      uTime: { value: number };
      uPulseSpeed: { value: number };
      uPulseIntensity: { value: number };
      uPulseLength: { value: number };
      // Otros posibles uniformes internos de MeshLineMaterial
      visibility?: { value: number };
      alphaTest?: { value: number };
      repeat?: { value: THREE.Vector2 };
    };

    // Propiedades importantes que puedes necesitar establecer directamente
    lineWidth: number;
    resolution: THREE.Vector2;
    sizeAttenuation: boolean; // O número (0/1) dependiendo de cómo lo uses
    color: THREE.Color;
    // ...otras propiedades...
  }
}