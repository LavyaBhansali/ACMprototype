import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import CameraRig from './CameraRig'
import StarField from './space/StarField'
import Nebula from './space/Nebula'
import HeroTitle from './space/HeroTitle'
import SpaceObjects from './space/SpaceObjects'
import Transition from './Transition'
import CityEnvironment from './city/CityEnvironment'
import Buildings from './city/Buildings'
import Street from './city/Street'
import Atmosphere from './city/Atmosphere'
import Finale from './city/Finale'

export default function Experience({ onBuildingClick }) {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 2000, position: [0, 0, 5] }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      style={{ background: '#000000' }}
    >
      <color attach="background" args={['#000000']} />
      
      <ScrollControls pages={14} damping={0.16}>
        {/* Camera rig reads scroll and moves camera */}
        <CameraRig />
        
        {/* World 1: Space */}
        <StarField />
        <Nebula />
        <Suspense fallback={null}>
          <HeroTitle />
        </Suspense>
        <SpaceObjects />
        
        {/* Transition zone */}
        <Transition />
        
        {/* World 2: City */}
        <CityEnvironment />
        <Buildings onBuildingClick={onBuildingClick} />
        <Street />
        <Atmosphere />
        <Finale />
      </ScrollControls>

      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          intensity={0.8}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
    </Canvas>
  )
}
