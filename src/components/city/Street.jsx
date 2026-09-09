import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/*
  Street: road surface, lane markings, street lights
  Runs along Z axis from -255 to -340
*/

export default function Street() {
  // Road surface texture
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Dark asphalt
    ctx.fillStyle = '#0c0c10'
    ctx.fillRect(0, 0, 256, 512)
    
    // Subtle asphalt noise
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 512
      const b = Math.floor(8 + Math.random() * 8)
      ctx.fillStyle = `rgb(${b}, ${b}, ${b + 2})`
      ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2)
    }
    
    // Center dashed line
    ctx.fillStyle = '#222230'
    for (let y = 0; y < 512; y += 40) {
      ctx.fillRect(126, y, 4, 24)
    }
    
    // Edge lines
    ctx.fillStyle = '#1a1a28'
    ctx.fillRect(20, 0, 2, 512)
    ctx.fillRect(234, 0, 2, 512)
    
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1, 20)
    return tex
  }, [])

  // Street light positions
  const streetLights = useMemo(() => {
    const lights = []
    for (let z = -245; z > -385; z -= 16) {
      lights.push({ x: -5.5, z })
      lights.push({ x: 5.5, z })
    }
    return lights
  }, [])

  return (
    <group>
      {/* Road surface */}
      <mesh 
        position={[0, 0.01, -335]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[14, 220]} />
        <meshStandardMaterial 
          map={roadTexture}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Sidewalks */}
      <mesh position={[-7.5, 0.15, -335]}>
        <boxGeometry args={[2, 0.3, 220]} />
        <meshStandardMaterial color="#0e0e14" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[7.5, 0.15, -335]}>
        <boxGeometry args={[2, 0.3, 220]} />
        <meshStandardMaterial color="#0e0e14" metalness={0.3} roughness={0.6} />
      </mesh>
      
      {/* Street lights */}
      {streetLights.map((light, i) => (
        <StreetLight key={i} position={[light.x, 0, light.z]} />
      ))}
    </group>
  )
}

function StreetLight({ position }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 6, 6]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Arm */}
      <mesh position={[position[0] > 0 ? -1 : 1, 5.8, 0]} rotation={[0, 0, position[0] > 0 ? 0.3 : -0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 2, 4]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Light fixture */}
      <mesh position={[position[0] > 0 ? -1.8 : 1.8, 5.6, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#ddeeff" toneMapped={false} />
      </mesh>
      
      {/* Light source */}
      <pointLight
        position={[position[0] > 0 ? -1.8 : 1.8, 5.5, 0]}
        color="#aabbdd"
        intensity={2}
        distance={20}
        decay={2}
      />
    </group>
  )
}
