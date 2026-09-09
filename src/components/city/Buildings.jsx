import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useScroll } from '@react-three/drei'
import * as THREE from 'three'

/*
  Buildings system:
  
  1. Background buildings — InstancedMesh with window textures
  2. Featured buildings — 6 unique buildings along the street with labels
  
  Street runs along the Z axis from z=-260 to z=-340
  Buildings are on the left (x < -5) and right (x > 5)
*/

// Featured building data
const FEATURED_BUILDINGS = [
  {
    id: 'research',
    name: 'RESEARCH',
    desc: "Explore ACM's research.",
    side: 'left',    // x negative
    zPos: -268,
    width: 8,
    height: 20,
    depth: 10,
    accentColor: '#0066cc',
    emissiveIntensity: 0.4,
  },
  {
    id: 'projects',
    name: 'PROJECTS',
    desc: 'Discover technical projects.',
    side: 'right',
    zPos: -280,
    width: 10,
    height: 16,
    depth: 12,
    accentColor: '#4488ff',
    emissiveIntensity: 0.35,
  },
  {
    id: 'events',
    name: 'EVENTS',
    desc: 'Upcoming ACM events.',
    side: 'left',
    zPos: -292,
    width: 14,
    height: 14,
    depth: 10,
    accentColor: '#00ccaa',
    emissiveIntensity: 0.45,
  },
  {
    id: 'tech',
    name: 'TECH',
    desc: 'Technology & workshops.',
    side: 'right',
    zPos: -304,
    width: 9,
    height: 22,
    depth: 9,
    accentColor: '#0088dd',
    emissiveIntensity: 0.3,
  },
  {
    id: 'community',
    name: 'COMMUNITY',
    desc: 'Join the ACM community.',
    side: 'left',
    zPos: -316,
    width: 12,
    height: 12,
    depth: 14,
    accentColor: '#6666ff',
    emissiveIntensity: 0.35,
  },
  {
    id: 'about',
    name: 'ABOUT ACM',
    desc: 'Learn about ACM DJSCE.',
    side: 'right',
    zPos: -328,
    width: 10,
    height: 18,
    depth: 10,
    accentColor: '#ffaa44',
    emissiveIntensity: 0.4,
  },
]

// Generate window texture using Canvas
function createWindowTexture(width, height, accentColor) {
  const canvas = document.createElement('canvas')
  const res = 256
  canvas.width = res
  canvas.height = res
  const ctx = canvas.getContext('2d')
  
  // Dark building surface
  ctx.fillStyle = '#08080e'
  ctx.fillRect(0, 0, res, res)
  
  // Window grid
  const cols = 6
  const rows = 10
  const winW = (res / cols) * 0.5
  const winH = (res / rows) * 0.45
  const padX = (res / cols - winW) / 2
  const padY = (res / rows - winH) / 2
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Some windows lit, some dark
      const lit = Math.random() > 0.4
      if (lit) {
        const brightness = 0.3 + Math.random() * 0.7
        // Mostly warm white/amber, occasional accent color
        if (Math.random() > 0.8) {
          ctx.fillStyle = accentColor
          ctx.globalAlpha = brightness * 0.6
        } else {
          const warmth = Math.floor(180 + Math.random() * 60)
          ctx.fillStyle = `rgb(${warmth}, ${warmth - 20}, ${warmth - 60})`
          ctx.globalAlpha = brightness * 0.4
        }
      } else {
        ctx.fillStyle = '#0a0a12'
        ctx.globalAlpha = 0.5
      }
      
      const x = col * (res / cols) + padX
      const y = row * (res / rows) + padY
      ctx.fillRect(x, y, winW, winH)
    }
  }
  ctx.globalAlpha = 1
  
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}

// A single featured building
function FeaturedBuilding({ data, onBuildingClick }) {
  const groupRef = useRef()
  const labelRef = useRef()
  const accentRef = useRef()
  const scroll = useScroll()
  
  const xPos = data.side === 'left' ? -(data.width / 2 + 8) : (data.width / 2 + 8)
  
  const windowTex = useMemo(
    () => createWindowTexture(data.width, data.height, data.accentColor),
    [data]
  )
  
  useFrame((state) => {
    if (!labelRef.current) return
    
    // Show label based on camera proximity
    const camZ = state.camera.position.z
    const dist = Math.abs(camZ - data.zPos)
    const opacity = 1 - THREE.MathUtils.clamp((dist - 5) / 20, 0, 1)
    labelRef.current.style.opacity = opacity
    labelRef.current.style.display = opacity < 0.01 ? 'none' : 'block'
    
    // Accent glow pulse
    if (accentRef.current) {
      accentRef.current.emissiveIntensity = 
        data.emissiveIntensity + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })
  
  return (
    <group ref={groupRef} position={[xPos, data.height / 2, data.zPos]}>
      {/* Main building body */}
      <mesh>
        <boxGeometry args={[data.width, data.height, data.depth]} />
        <meshStandardMaterial 
          map={windowTex}
          color="#1a1a24"
          metalness={0.6}
          roughness={0.4}
          emissive={data.accentColor}
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Accent strip on the side facing the street */}
      <mesh position={[data.side === 'left' ? data.width / 2 + 0.05 : -data.width / 2 - 0.05, 0, 0]}>
        <boxGeometry args={[0.1, data.height * 0.8, 0.3]} />
        <meshStandardMaterial 
          ref={accentRef}
          color={data.accentColor}
          emissive={data.accentColor}
          emissiveIntensity={data.emissiveIntensity}
          toneMapped={false}
        />
      </mesh>
      
      {/* Top accent light */}
      <pointLight 
        position={[0, data.height / 2 + 1, 0]} 
        color={data.accentColor} 
        intensity={1} 
        distance={15}
      />
      
      {/* Label */}
      <Html
        portal={{ current: scroll.fixed }}
        center
        position={[data.side === 'left' ? data.width / 2 + 3.5 : -data.width / 2 - 3.5, -data.height / 2 + 3.5, 0]}
        style={{ pointerEvents: 'auto' }}
      >
        <div 
          ref={labelRef}
          className="building-label" 
          style={{ opacity: 0 }}
          onClick={() => onBuildingClick(data.id)}
        >
          <div className="building-label__name">{data.name}</div>
          <div className="building-label__desc">{data.desc}</div>
          <div className="building-label__cta">CLICK TO ENTER →</div>
        </div>
      </Html>
    </group>
  )
}

// Background buildings — InstancedMesh
function BackgroundBuildings() {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const COUNT = 150
  
  const windowTex = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#060608'
    ctx.fillRect(0, 0, 128, 256)
    
    // Generic windows
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 4; col++) {
        const lit = Math.random() > 0.5
        if (lit) {
          const b = Math.floor(100 + Math.random() * 100)
          ctx.fillStyle = `rgb(${b}, ${b - 10}, ${b - 30})`
          ctx.globalAlpha = 0.3 + Math.random() * 0.3
        } else {
          ctx.fillStyle = '#040406'
          ctx.globalAlpha = 0.5
        }
        ctx.fillRect(col * 32 + 4, row * 16 + 2, 24, 12)
      }
    }
    ctx.globalAlpha = 1
    
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [])
  
  const buildings = useMemo(() => {
    const b = []
    for (let i = 0; i < COUNT; i++) {
      // Place buildings in a grid pattern around the street,
      // avoiding the street corridor (-6 to 6 on X)
      let x
      if (Math.random() > 0.5) {
        x = 15 + Math.random() * 80 // right side
      } else {
        x = -15 - Math.random() * 80 // left side
      }
      
      const z = -220 - Math.random() * 140
      const h = 5 + Math.random() * 35
      const w = 3 + Math.random() * 8
      const d = 3 + Math.random() * 8
      
      b.push({ x, z, h, w, d })
    }
    return b
  }, [])
  
  useEffect(() => {
    if (!meshRef.current) return
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z)
      dummy.scale.set(b.w, b.h, b.d)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [buildings])

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        map={windowTex}
        color="#0d0d14"
        metalness={0.5}
        roughness={0.5}
        emissive="#111122"
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  )
}

export default function Buildings({ onBuildingClick }) {
  return (
    <group>
      <BackgroundBuildings />
      {FEATURED_BUILDINGS.map((b) => (
        <FeaturedBuilding 
          key={b.id} 
          data={b} 
          onBuildingClick={onBuildingClick} 
        />
      ))}
    </group>
  )
}
