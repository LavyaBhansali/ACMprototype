import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

function makeEarthTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext('2d')
  context.fillStyle = '#01040b'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const continents = [[180, 150, 125, 74], [390, 112, 155, 95], [595, 208, 135, 80], [780, 130, 104, 62], [460, 320, 100, 92], [235, 325, 105, 72]]
  continents.forEach(([x, y, width, height]) => {
    const gradient = context.createRadialGradient(x + width / 2, y + height / 2, 4, x + width / 2, y + height / 2, width)
    gradient.addColorStop(0, '#0b2432')
    gradient.addColorStop(1, '#031018')
    context.fillStyle = gradient
    context.beginPath()
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, -0.2, 0, Math.PI * 2)
    context.fill()
    for (let i = 0; i < 95; i += 1) {
      const px = x + Math.random() * width
      const py = y + Math.random() * height
      const inside = Math.pow((px - x - width / 2) / (width / 2), 2) + Math.pow((py - y - height / 2) / (height / 2), 2) < 0.94
      if (inside && Math.random() > 0.32) {
        context.fillStyle = Math.random() > 0.86 ? '#b7e8ff' : '#d6a65c'
        context.globalAlpha = 0.35 + Math.random() * 0.55
        context.fillRect(px, py, 1 + Math.random() * 2.2, 1 + Math.random() * 2.2)
      }
    }
  })
  context.globalAlpha = 1
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Earth() {
  const group = useRef()
  const texture = useMemo(makeEarthTexture, [])
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.018
    group.current.rotation.z = -0.17
    group.current.visible = state.camera.position.z > -180
  })
  return (
    <group ref={group} position={[0, 2.5, -205]}>
      <mesh>
        <sphereGeometry args={[30, 64, 64]} />
        <meshStandardMaterial map={texture} emissive="#07111d" emissiveMap={texture} emissiveIntensity={0.72} roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh scale={1.018}>
        <sphereGeometry args={[30, 64, 64]} />
        <meshBasicMaterial color="#2d8fcc" transparent opacity={0.075} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight position={[-25, 18, 20]} color="#5da8ff" intensity={1.6} distance={120} />
    </group>
  )
}

function CloudDive() {
  const group = useRef()
  const scroll = useScroll()
  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(232, 241, 250, 0.54)')
    gradient.addColorStop(0.38, 'rgba(156, 180, 199, 0.19)')
    gradient.addColorStop(1, 'rgba(14, 21, 30, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])
  const puffs = useMemo(() => Array.from({ length: 155 }, (_, index) => {
    const radius = 1 + Math.pow(Math.random(), 0.48) * 25
    const angle = Math.random() * Math.PI * 2
    return {
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.68 + 2, -174 - Math.random() * 66],
      scale: 2.5 + Math.random() * 7,
      phase: index * 0.37,
    }
  }), [])
  useFrame((state) => {
    const active = THREE.MathUtils.smoothstep(scroll.offset, 0.515, 0.61)
    if (group.current) {
      group.current.visible = active > 0.01 && scroll.offset < 0.67
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })
  return (
    <group ref={group}>
      {puffs.map((puff, index) => (
        <sprite key={index} position={puff.position} scale={[puff.scale, puff.scale, 1]}>
          <spriteMaterial map={smokeTexture} transparent opacity={0.42} depthWrite={false} color="#d2e0eb" />
        </sprite>
      ))}
    </group>
  )
}

export default function Transition() {
  return <group><Earth /><CloudDive /></group>
}
