import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import './App.css';
import Soundscape from './Soundscape';
import GameWorld from './GameWorld';
import * as THREE from 'three';


// function SkyBox({ url }) {
//   const texture = useLoader(THREE.TextureLoader, url);
//
//   return (
//     <mesh position={[0, -15, -150]}>
//       <planeGeometry args={[800, 400]} /> 
//       <meshBasicMaterial
//         map={texture}
//         fog={false}
//         transparent={true}
//       />
//     </mesh>
//   );
// }
// const texture = useLoader(THREE.TextureLoader, '/sky2.png');
//
// useMemo(() => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   texture.offset.y = -0.15;
//   texture.wrapT = THREE.RepeatWrapping;
// }, [texture]);


export default function App() {
  const soundRef = useRef();
  
  // const texture = useLoader(THREE.TextureLoader, '/sky2.png');
  // texture.mapping = THREE.EquirectangularReflectionMapping;
  // texture.offset.y = 10;
  const texture = useLoader(THREE.TextureLoader, '/sky2.png');
  useMemo(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);

  

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
      <Canvas camera={{position: [0,-2.5,25], fov:45}}>
        {/* <fog attach="fog" args={['#ffad66', 38, 55]} /> */}
        {/* <color attach="background" args={['#ffad66']} /> */}
        {/* <Environment files="/sky.hdr" /> */}
        <primitive object={texture} attach="background" />
        <Environment map={texture} rotation={[Math.PI * 0.05, 0,0]}/>

        <Suspense fallback={null}>
          {/* <Sky  */}
          {/*   sunPosition={[0, 10, 100]} */}
          {/*   turbidity={0.1} */}
          {/*   rayleigh={2} */}
          {/* /> */}
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
  );
}
