import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying vec2 vUv;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    
    float n1 = snoise(uv * 2.0 + uTime * 0.02);
    float n2 = snoise(uv * 4.0 - uTime * 0.015);
    float n3 = snoise(uv * 1.0 + uTime * 0.01);
    
    float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    noise = smoothstep(-0.2, 0.8, noise);
    
    vec3 color = mix(uColor1, uColor2, noise);
    
    // Radial fade from center
    float dist = length(uv - 0.5) * 2.0;
    float alpha = (1.0 - smoothstep(0.0, 1.0, dist)) * noise * uOpacity;
    
    gl_FragColor = vec4(color, alpha);
  }
`

function NebulaPlane({ position, rotation, scale, color1, color2, opacity }) {
  const matRef = useRef()
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(color1) },
    uColor2: { value: new THREE.Color(color2) },
    uOpacity: { value: opacity },
  }), [])

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function Nebula() {
  return (
    <group>
      {/* Main cyan nebula — behind hero */}
      <NebulaPlane
        position={[15, 5, -30]}
        rotation={[0, -0.3, 0.1]}
        scale={[60, 40, 1]}
        color1="#001a33"
        color2="#003355"
        opacity={0.12}
      />
      
      {/* Subtle violet hint — far right */}
      <NebulaPlane
        position={[-20, -8, -80]}
        rotation={[0.1, 0.2, -0.1]}
        scale={[50, 35, 1]}
        color1="#0d0020"
        color2="#1a0033"
        opacity={0.06}
      />
      
      {/* Deep blue — along the path */}
      <NebulaPlane
        position={[10, 10, -120]}
        rotation={[0.2, -0.1, 0.15]}
        scale={[70, 50, 1]}
        color1="#000d1a"
        color2="#002244"
        opacity={0.08}
      />
    </group>
  )
}
