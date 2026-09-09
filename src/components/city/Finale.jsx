import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useScroll } from '@react-three/drei'
import * as THREE from 'three'

function makeSmokeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(64, 64, 3, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(196, 211, 225, 0.36)')
  gradient.addColorStop(0.35, 'rgba(116, 132, 150, 0.2)')
  gradient.addColorStop(1, 'rgba(11, 14, 20, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

export default function Finale() {
  const group = useRef()
  const titleAnchor = useRef()
  const title = useRef()
  const scroll = useScroll()
  const smokeTexture = useMemo(makeSmokeTexture, [])
  const smoke = useMemo(() => Array.from({ length: 34 }, (_, index) => ({
    position: [(Math.random() - 0.5) * 26, (Math.random() - 0.2) * 13, (Math.random() - 0.5) * 14],
    scale: 4 + Math.random() * 10,
    drift: 0.2 + Math.random() * 0.55,
    phase: index * 0.71,
  })), [])

  useFrame((state) => {
    const reveal = THREE.MathUtils.smoothstep(scroll.offset, 0.89, 0.975)
    if (group.current) group.current.visible = reveal > 0.01
    if (title.current) title.current.style.opacity = reveal
    if (titleAnchor.current) {
      const direction = state.camera.getWorldDirection(new THREE.Vector3())
      titleAnchor.current.position.copy(state.camera.position).addScaledVector(direction, 10)
    }
    if (group.current) {
      group.current.children.forEach((child, index) => {
        if (index > 0) child.position.y += Math.sin(state.clock.elapsedTime * smoke[index - 1].drift + smoke[index - 1].phase) * 0.002
      })
    }
  })

  return (
    <group ref={group} position={[0, 3, -387]}>
      <group ref={titleAnchor}>
        <Html center portal={{ current: scroll.fixed }} style={{ pointerEvents: 'none' }}>
          <div ref={title} className="finale-title">
            <span className="finale-title__eyebrow">ACM DJSCE</span>
            <span className="finale-title__main">COMING SOON</span>
            <span className="finale-title__rule" />
          </div>
        </Html>
      </group>
      {smoke.map((puff, index) => (
        <sprite key={index} position={puff.position} scale={[puff.scale, puff.scale, 1]}>
          <spriteMaterial map={smokeTexture} transparent opacity={0.24} depthWrite={false} color="#c1d1dd" />
        </sprite>
      ))}
    </group>
  )
}
