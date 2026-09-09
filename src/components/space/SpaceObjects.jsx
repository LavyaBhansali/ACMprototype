import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Html } from '@react-three/drei'
import * as THREE from 'three'

const SPACE_OBJECTS = [
  {
    id: 'research',
    label: 'RESEARCH',
    desc: 'Exploring the frontier of computing.',
    position: [5, 2, -40],
    type: 'constellation',
    color: '#00bbff',
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    desc: 'Building tomorrow\'s technology.',
    position: [-6, -1, -65],
    type: 'satellite',
    color: '#4488ff',
  },
  {
    id: 'events',
    label: 'EVENTS',
    desc: 'Where ideas converge.',
    position: [4, 3, -90],
    type: 'cluster',
    color: '#00ddcc',
  },
  {
    id: 'community',
    label: 'COMMUNITY',
    desc: 'Connected through code.',
    position: [-5, 0, -115],
    type: 'orbital',
    color: '#6688ff',
  },
  {
    id: 'achievements',
    label: 'ACHIEVEMENTS',
    desc: 'Milestones in innovation.',
    position: [3, -2, -140],
    type: 'glow',
    color: '#ffaa44',
  },
]

// Constellation: wireframe icosahedron with glowing vertices
function Constellation({ color }) {
  const ref = useRef()
  const pointsRef = useRef()
  
  const pointPositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 0)
    const pos = geo.attributes.position.array
    geo.dispose()
    return new Float32Array(pos)
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2
    }
  })
  
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={pointPositions}
            count={pointPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.12} sizeAttenuation toneMapped={false} />
      </points>
    </group>
  )
}

// Satellite: torus knot with metallic look
function Satellite({ color }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15
      ref.current.rotation.z = state.clock.elapsedTime * 0.08
    }
  })
  return (
    <group ref={ref}>
      <mesh>
        <torusKnotGeometry args={[0.8, 0.25, 64, 8, 2, 3]} />
        <meshStandardMaterial 
          color="#1a1a2a" 
          metalness={0.9} 
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      <pointLight color={color} intensity={2} distance={8} />
    </group>
  )
}

// Cluster: many small glowing spheres
function Cluster({ color }) {
  const ref = useRef()
  const spheres = useMemo(() => {
    const s = []
    for (let i = 0; i < 30; i++) {
      s.push({
        pos: [
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
        ],
        scale: 0.05 + Math.random() * 0.12,
      })
    }
    return s
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <group ref={ref}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

// Orbital: rotating octahedron wireframe with ring
function Orbital({ color }) {
  const ref = useRef()
  const ringRef = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
      ref.current.rotation.x = state.clock.elapsedTime * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -state.clock.elapsedTime * 0.15
    }
  })
  return (
    <group>
      <group ref={ref}>
        <mesh>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </mesh>
      </group>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.02, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  )
}

// Glow: bright sphere with large halo
function GlowSphere({ color }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      ref.current.scale.setScalar(pulse)
    }
  })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.03} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={3} distance={15} />
    </group>
  )
}

const COMPONENTS = {
  constellation: Constellation,
  satellite: Satellite,
  cluster: Cluster,
  orbital: Orbital,
  glow: GlowSphere,
}

function SpaceObject({ data }) {
  const groupRef = useRef()
  const labelRef = useRef()
  const scroll = useScroll()
  const Component = COMPONENTS[data.type]
  
  useFrame((state) => {
    if (!groupRef.current || !labelRef.current) return
    
    // Calculate distance from camera to object
    const camZ = state.camera.position.z
    const objZ = data.position[2]
    const dist = Math.abs(camZ - objZ)
    
    // Show label when camera is close
    const maxDist = 25
    const minDist = 3
    const opacity = 1 - THREE.MathUtils.clamp((dist - minDist) / (maxDist - minDist), 0, 1)
    
    labelRef.current.style.opacity = opacity
    labelRef.current.style.display = opacity < 0.01 ? 'none' : 'block'
  })

  return (
    <group ref={groupRef} position={data.position}>
      <Component color={data.color} />
      <Html
        portal={{ current: scroll.fixed }}
        center
        position={[0, -2.5, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div ref={labelRef} className="space-label" style={{ opacity: 0 }}>
          <div className="space-label__title">{data.label}</div>
          <div className="space-label__desc">{data.desc}</div>
        </div>
      </Html>
    </group>
  )
}

export default function SpaceObjects() {
  return (
    <group>
      {SPACE_OBJECTS.map((obj) => (
        <SpaceObject key={obj.id} data={obj} />
      ))}
      
      {/* Ambient light for the satellite metallic material */}
      <ambientLight intensity={0.3} />
    </group>
  )
}
