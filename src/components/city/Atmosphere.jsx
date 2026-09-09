import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
  Atmospheric effects for the city:
  - Floating dust/light particles
  - Subtle fog layers at different heights
*/

const PARTICLE_COUNT = 300

export default function Atmosphere() {
  const particlesRef = useRef()
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = []
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40     // x
      positions[i * 3 + 1] = Math.random() * 15          // y (0 to 15)
      positions[i * 3 + 2] = -250 - Math.random() * 100  // z
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.001,
        z: (Math.random() - 0.5) * 0.001,
      })
    }
    
    return { positions, velocities }
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return
    const posAttr = particlesRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posAttr.array[i * 3] += velocities[i].x + Math.sin(time * 0.2 + i) * 0.001
      posAttr.array[i * 3 + 1] += velocities[i].y
      posAttr.array[i * 3 + 2] += velocities[i].z
      
      // Wrap particles
      if (posAttr.array[i * 3 + 1] > 15) posAttr.array[i * 3 + 1] = 0
      if (posAttr.array[i * 3 + 1] < 0) posAttr.array[i * 3 + 1] = 15
    }
    posAttr.needsUpdate = true
  })

  return (
    <group>
      {/* Floating dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#8899bb" 
          size={0.08} 
          sizeAttenuation 
          transparent 
          opacity={0.4}
          depthWrite={false}
        />
      </points>
      
      {/* Low fog layer near street */}
      <mesh position={[0, 0.5, -290]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 100]} />
        <meshBasicMaterial 
          color="#0a0e15" 
          transparent 
          opacity={0.3} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Mid-height fog */}
      <mesh position={[0, 8, -290]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 120]} />
        <meshBasicMaterial 
          color="#080c14" 
          transparent 
          opacity={0.15} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Vertical fog curtains on the sides */}
      <mesh position={[-25, 8, -290]}>
        <planeGeometry args={[5, 20]} />
        <meshBasicMaterial 
          color="#0a0e15" 
          transparent 
          opacity={0.2} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[25, 8, -290]}>
        <planeGeometry args={[5, 20]} />
        <meshBasicMaterial 
          color="#0a0e15" 
          transparent 
          opacity={0.2} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
