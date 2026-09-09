import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
  City Environment
  
  Ground plane with subtle grid, fog, and lighting
  Positioned at y=0 (street level) from Z -220 to Z -360
*/

export default function CityEnvironment() {
  // Create a subtle grid texture for the ground
  const groundTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Dark asphalt base
    ctx.fillStyle = '#0a0a0e'
    ctx.fillRect(0, 0, 512, 512)
    
    // Subtle grid lines
    ctx.strokeStyle = '#151520'
    ctx.lineWidth = 1
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 512)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }
    
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(20, 20)
    return tex
  }, [])

  // Dynamic atmospheric fog when descending into the city
  useFrame((state) => {
    const camZ = state.camera.position.z
    if (camZ > -160) {
      if (state.scene.fog) state.scene.fog = null
    } else {
      const t = Math.min(1, Math.max(0, (-camZ - 160) / 40)) // 0 at -160, 1 at -200
      const near = 20 + (1 - t) * 100
      const far = 120 + (1 - t) * 300
      if (!state.scene.fog) {
        state.scene.fog = new THREE.Fog('#050508', near, far)
      } else {
        state.scene.fog.near = near
        state.scene.fog.far = far
      }
    }
  })

  return (
    <group>
      {/* Ground plane */}
      <mesh position={[0, 0, -290]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 200]} />
        <meshStandardMaterial 
          map={groundTexture}
          color="#0d0d12"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Ambient light — cool blue tone */}
      <ambientLight intensity={0.15} color="#4466aa" />
      
      {/* Directional moonlight */}
      <directionalLight 
        position={[50, 80, -250]} 
        intensity={0.3} 
        color="#6688bb"
      />
      
      {/* Overhead city glow */}
      <hemisphereLight
        skyColor="#0a1020"
        groundColor="#050508"
        intensity={0.2}
      />
    </group>
  )
}
