import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Text } from '@react-three/drei'
import * as THREE from 'three'

export default function HeroTitle() {
  const groupRef = useRef()
  const scroll = useScroll()
  const glowRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = scroll.offset
    
    // Hero title rises up as user scrolls (0.06 → 0.18)
    if (t < 0.06) {
      groupRef.current.position.y = 0
      groupRef.current.position.z = 0
      groupRef.current.visible = true
    } else if (t < 0.20) {
      const progress = (t - 0.06) / 0.14
      const smooth = progress * progress * (3 - 2 * progress)
      // Title rises dramatically
      groupRef.current.position.y = smooth * 40
      groupRef.current.position.z = -smooth * 15
      groupRef.current.visible = true
    } else {
      groupRef.current.visible = false
    }
    
    // Subtle floating animation
    const float = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    if (t < 0.06) {
      groupRef.current.position.y = float
    }
    
    // Glow pulse
    if (glowRef.current) {
      glowRef.current.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Glow backdrop */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[20, 12]} />
        <meshBasicMaterial 
          ref={glowRef}
          color="#0066aa" 
          transparent 
          opacity={0.08} 
          depthWrite={false}
        />
      </mesh>
      
      {/* ACM — Main title */}
      <Text
        fontSize={2.8}
        font="/fonts/SpaceGrotesk.woff"
        color="#e8e8f0"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.3, 0]}
        letterSpacing={0.35}
        fontWeight={300}
      >
        ACM
      </Text>
      
      {/* Subtitle */}
      <Text
        fontSize={0.22}
        font="/fonts/SpaceGrotesk.woff"
        color="#8888a0"
        anchorX="center"
        anchorY="middle"
        position={[0, -1.3, 0]}
        letterSpacing={0.4}
      >
        DJ SANGHVI COLLEGE OF ENGINEERING
      </Text>
      
      {/* Thin line separator */}
      <mesh position={[0, -0.8, 0]}>
        <planeGeometry args={[3, 0.003]} />
        <meshBasicMaterial color="#334455" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
