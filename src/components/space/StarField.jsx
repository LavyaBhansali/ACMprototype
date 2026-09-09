import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 4000
const SPREAD = 400
const DEPTH = 500

export default function StarField() {
  const meshRef = useRef()
  const initialized = useRef(false)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const { positions, scales, twinklePhases } = useMemo(() => {
    const positions = []
    const scales = []
    const twinklePhases = []
    
    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute stars around the entire camera path
      const x = (Math.random() - 0.5) * SPREAD
      const y = (Math.random() - 0.5) * SPREAD
      const z = (Math.random()) * -DEPTH + 20 // From z=20 to z=-480
      
      positions.push(x, y, z)
      
      // Varying sizes — most are small, few are large
      const r = Math.random()
      let size
      if (r < 0.7) size = 0.02 + Math.random() * 0.04       // small
      else if (r < 0.92) size = 0.06 + Math.random() * 0.08  // medium
      else size = 0.12 + Math.random() * 0.15                 // large bright stars
      
      scales.push(size)
      twinklePhases.push(Math.random() * Math.PI * 2)
    }
    
    return { 
      positions: new Float32Array(positions), 
      scales, 
      twinklePhases 
    }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    
    // Initialize on first frame
    if (!initialized.current) {
      for (let i = 0; i < STAR_COUNT; i++) {
        dummy.position.set(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        )
        dummy.scale.setScalar(scales[i])
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      initialized.current = true
      return
    }
    
    const time = state.clock.elapsedTime
    
    // Subtle twinkle — only update a subset each frame for performance
    const batchSize = 200
    const startIdx = (Math.floor(time * 10) * batchSize) % STAR_COUNT
    
    for (let j = 0; j < batchSize; j++) {
      const i = (startIdx + j) % STAR_COUNT
      const twinkle = 0.6 + 0.4 * Math.sin(time * 0.8 + twinklePhases[i])
      
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      )
      dummy.scale.setScalar(scales[i] * twinkle)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, STAR_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </instancedMesh>
  )
}
