import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

/* The route is deliberately asymmetric. Space should feel discovered, not
   like a straight rail: left and right positions trade before Earth recentres it. */
const keyframes = [
  { t: 0.00, pos: [0, 0, 5], look: [0, 0, 0] },
  { t: 0.06, pos: [0, 0, 5], look: [0, 0, 0] },
  { t: 0.10, pos: [0, -2, 0], look: [0, 2, -5] },
  { t: 0.15, pos: [0, -3, -8], look: [0, 5, -20] },
  { t: 0.20, pos: [-11, 3, -27], look: [3, 1, -48] },
  { t: 0.26, pos: [13, -3, -53], look: [-4, 1, -75] },
  { t: 0.32, pos: [-15, 4, -79], look: [4, 0, -102] },
  { t: 0.38, pos: [14, -4, -106], look: [-5, 1, -130] },
  { t: 0.44, pos: [-10, 2, -135], look: [2, 2, -164] },
  { t: 0.49, pos: [0, 2.5, -151], look: [0, 2.5, -205] },
  { t: 0.535, pos: [0, 2.25, -169], look: [0, 2.25, -205] },
  // The compressed interval makes the cloud entry feel like a rush.
  { t: 0.585, pos: [0, 2, -242], look: [0, 1.5, -265] },
  { t: 0.66, pos: [-1.5, 2.2, -261], look: [0, 1.8, -282] },
  { t: 0.75, pos: [1.2, 2.1, -290], look: [0, 1.8, -310] },
  { t: 0.84, pos: [-1, 2, -319], look: [0, 1.7, -342] },
  { t: 0.92, pos: [0, 2.4, -350], look: [0, 2.5, -380] },
  { t: 1.00, pos: [0, 3, -365], look: [0, 3, -388] },
]

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function interpolateKeyframes(t) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1)
  let index = keyframes.length - 2
  for (let i = 0; i < keyframes.length - 1; i += 1) {
    if (clamped >= keyframes[i].t && clamped <= keyframes[i + 1].t) {
      index = i
      break
    }
  }
  const from = keyframes[index]
  const to = keyframes[index + 1]
  const local = (clamped - from.t) / (to.t - from.t)
  const eased = easeInOutCubic(THREE.MathUtils.clamp(local, 0, 1))
  return {
    pos: from.pos.map((value, i) => THREE.MathUtils.lerp(value, to.pos[i], eased)),
    look: from.look.map((value, i) => THREE.MathUtils.lerp(value, to.look[i], eased)),
  }
}

const targetPosition = new THREE.Vector3()
const targetLook = new THREE.Vector3()
const currentPosition = new THREE.Vector3(0, 0, 5)
const currentLook = new THREE.Vector3(0, 0, 0)

export default function CameraRig() {
  const scroll = useScroll()

  useFrame((state) => {
    const target = interpolateKeyframes(scroll.offset)
    targetPosition.fromArray(target.pos)
    targetLook.fromArray(target.look)
    const diving = scroll.offset > 0.525 && scroll.offset < 0.61
    const damping = diving ? 0.19 : 0.075
    currentPosition.lerp(targetPosition, damping)
    currentLook.lerp(targetLook, damping)
    state.camera.position.copy(currentPosition)
    state.camera.lookAt(currentLook)
  })
  return null
}
