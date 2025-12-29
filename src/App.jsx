import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import './App.css';
import Soundscape from './Soundscape';
import GameWorld from './GameWorld';
import LoadingScreen from './LoadingScreen';
import * as THREE from 'three';



export default function App() {
  const soundRef = useRef();
  

  const texture = useLoader(THREE.TextureLoader, '/sky.png');
  useMemo(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);

  

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* logo */}
      <img 
        src="/logo7.png" alt="The Movies of Studio Ghibli"
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '200px',
          zIndex: 2000,   // keep above 3d canvas 
          pointerEvents: 'none', // click through the logo
          background: 'transparent'
        }}
      />
      {/* Canvas sets up renderer, scene and camera */}
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <Canvas 
          camera={{position: [0,-5,25], fov:50}}
          style={{ pointerEvents: 'auto' }}
        >
          <primitive object={texture} attach="background" />
          <Environment map={texture} rotation={[Math.PI * 0.05, 0,0]}/>

          <Suspense fallback={<LoadingScreen />}>
            <GameWorld soundRef={soundRef}/>
            <directionalLight
              position={[10, 20, 200]}
              intensity={4}
              color="#ffaa00"
              castShadow
            />
            
            <ambientLight intensity={0.6} color="#ff9d66" />

            {/* post-processing effects */}
            <EffectComposer>
              <Bloom
                intensity={1.5} //strength of glow
                luminanceThreshold={1}  // things brighter than 1 will glow
                mipmapBlur // higher quality blur
              />
              <Noise opacity={0.04} />
              <Vignette eskil={false} offset={0.1} darkness={0.7} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      <Soundscape ref={soundRef} />
    </div>
  );
}
