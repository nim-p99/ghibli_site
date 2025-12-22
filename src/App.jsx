import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import './App.css';
import Soundscape from './Soundscape';
import GameWorld from './GameWorld';



export default function App() {
  const soundRef = useRef();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Soundscape ref={soundRef} />
      {/* logo */}
      <img 
        src="/logo.png" alt="The Movies of Studio Ghibli"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '150px',
          zIndex: 2000,   // keep above 3d canvas 
          pointerEvents: 'none', // click through the logo
          background: 'transparent'
        }}
      />
      {/* Canvas sets up renderer, scene and camera */}
      <Canvas camera={{position: [0,0.5,10], fov:50}}>
        <fog attach="fog" args={['#C2C6D5', 21, 50]} />
        <Suspense fallback={null}>
          <Environment files="/sky.hdr" background />
          <GameWorld soundRef={soundRef}/>

          {/* post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={1.2} //strength of glow
              luminanceThreshold={1}  // things brighter than 1 will glow
              luminanceSmoothing={0.9}  // smoothness of glow edge 
              mipmapBlur // higher quality blur
            />
            <Noise opacity={0.07} />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>
        </Suspense>
        <ambientLight intensity={1.5} />
        <pointLight position={[10,10,10]} />
      </Canvas>
    </div>
  );
}
