import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF, useTexture, Clone, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';


const MOVIE_DATA = [
  { id: 0, title: "Spirited Away", year: "2001", description: "A young girl wanders into a spirit world", x:20, posterUrl: "/spirited-away.jpg", color: "gold" },
  { id: 1, title: "My Neighbour Totoro", year: "1988", description: "Two sisters befriend forest spirits.", x:45, posterUrl: "/totoro.jpg", color: "green" },
];
//const LOOP_DISTANCE = 500;
const LOOP_DISTANCE = 65;


function TrainModel() {
  // useGLTF checks /public folder by default
  const { scene } = useGLTF('/train.glb');
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color("#442200");
        child.material.emissiveIntensity = 0.2;
      }
    });
  }, [scene]);


  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, -5.25, 0]}
      rotation={[0,0,0]}
    />
  );
}

function Lampost({ movie }) {
  const { scene } = useGLTF('/street-lamp.glb');
  // clone so each lampost can exist independently
  const clonedScene = scene.clone();
  const lampColor = "#ffcc80";

  return (
    <group position={[movie.x, -5.2, -14]}>
      {/* 3d model */}
      <primitive object={clonedScene} scale={0.35} />

      {/* light source */}
      <pointLight
        position={[-1,13,0.5]}
        intensity={15}
        distance={10}
        color={lampColor}
      />

      {/* the movie poster */}
      <mesh position={[0,8.5,0.2]}>
        <planeGeometry args={[5,7.5]} />
        <Suspense fallback={<meshStandardMaterial color="gray" />}>
          <PosterMaterial url={movie.posterUrl} />
        </Suspense>
      </mesh>
    </group>
  );
}

// helper to load multiple images in a loop 
function PosterMaterial({ url }) {
  const texture = useTexture(url);
  return <meshStandardMaterial map={texture} side={2} emissive={"#ffffff"} emissiveIntensity={0.05} />;
}


function WorldContent({ maps }) {
  const { normalMap, roughnessMap, aoMap } = maps;

  return (
    <>
      {MOVIE_DATA.map((movie) => (
        <Lampost key={movie.id} movie={movie} />
      ))}
    </>
  );
}


export default function GameWorld({ soundRef }) {
  const floorRef = useRef();
  const keys = useRef({});

  // we use refs for values that change every frame
  // similar to python variables
  const speed = useRef(0);
  const distance = useRef(0);

  // water maps 
  const [normalMap, roughnessMap, aoMap] = useTexture([
    '/water_norm.jpg',
    '/water_rough.jpg',
    '/water_occ.jpg'
  ]);

  useMemo(() => {
    [normalMap, roughnessMap, aoMap].forEach((map) => {
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(6.5, 4.5);
    });
  }, [normalMap, roughnessMap, aoMap]);

  // state to track which movie we are next to 
  const [nearbyMovie, setNearbyMovie] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // for side effects - things that happen outside of react cycle
  // eg keyboard events 
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.code] = true;
      // toggle expansion when space is pressed
      if (e.code === 'Space') {
        setIsExpanded(prev => !prev);
      }
    };
    const handleKeyUp = (e) => { keys.current[e.code] = false; };

    // register the events 
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // need to clean up the listeners if component is removed
    // to prevent memory leaks 
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);



  useFrame((state, delta ) => {
    // runs 60 times per second
    // every time a new frame is draw, run this math 
    if (keys.current['ArrowRight']) {
      speed.current = Math.min(speed.current + 0.1, 5); // max speed 5 
    } else if (keys.current['ArrowLeft']) {
      speed.current = Math.max(speed.current - 0.1, -5); // max reverse -5 
    } else {
      // friction -> gradually slow down to 0 
      speed.current *= 0.95;
    }

    // update distance
    distance.current += speed.current * delta;

    // use modulo to wrap the distance
    // JS % can return negative numbers
    const wrappedDist = ((distance.current % LOOP_DISTANCE) + LOOP_DISTANCE) % LOOP_DISTANCE;


    // move the floor in negative direction of distance 
    if (floorRef.current) {
      floorRef.current.position.x = -wrappedDist;
    }

    // rotate sky background 
    state.scene.backgroundRotation.y = distance.current * 0.005;
    // rotate lighting environment
    state.scene.environmentRotation.y = distance.current * 0.005;

    // ripple effect as train moves through water
    if (normalMap) {
      // const flowSpeed = wrappedDist * 0.1;
      const flowSpeed = distance.current * 0.05;
      const constantDrift = state.clock.elapsedTime * 0.02;

      // normalMap.offset.x = flowSpeed;
      // roughnessMap.offset.x = flowSpeed;
      // aoMap.offset.x = flowSpeed;
      normalMap.offset.set(flowSpeed, constantDrift);
      roughnessMap.offset.set(flowSpeed, constantDrift);
      aoMap.offset.set(flowSpeed, constantDrift);
      normalMap.needsUpdate = true;

      // // tiny y drift
      // normalMap.offset.y += delta * 0.02;
      // normalMap.offset.y = constantDrift;
      // roughnessMap.offset.y = constantDrift;
      // aoMap.offset.y = constantDrift;
     


    }

    // proximity - find a movie where distance is < 2 units away 
    const found = MOVIE_DATA.find(m => Math.abs(m.x - wrappedDist) < 2);
    // update state if nearby movie has changed (dont rerender otherwise)
    if (found?.id !== nearbyMovie?.id) {
      setNearbyMovie(found || null);
      // if we drive away, set isExpanded to false
      if (!found) setIsExpanded(false);
    }
    // brake - if menu is open, train should slow down automatically
    if (isExpanded) {
      speed.current *= 0.8;
    }
  
    if (soundRef.current) {
      soundRef.current.updateTracks(speed.current)
    }

  });

  return (
    <>
      {/* UI prompt- only show if nearbyMovie is not null */}
      {nearbyMovie && !isExpanded && (
        <Html center position={[0,-5,0]}>
          <div style={{
            background:'black', color:'white', padding:'10px',
            borderRadius: '10px', whiteSpace: 'nowrap', fontFamily: 'sans-serif'
          }}>
            Press [Space] to view {nearbyMovie.title}
          </div>
        </Html>
      )}

      {/* UI movie details - visible only if expanded */}
      {nearbyMovie && isExpanded && (
        <Html center>
          <div style = {{
            background: 'white',
            padding: '15px',
            borderRadius: '10px',
            width: '400px',
            color: '#333',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            fontFamily: 'serif',
          }}>
            <h3>{nearbyMovie.title}</h3>
            <p>{nearbyMovie.year}</p>
            <p>{nearbyMovie.description}</p>
            <button onClick={() => setIsExpanded(false)}>Close</button>
          </div>
        </Html>
      )}
      {/* train */}
      <TrainModel />  

     
      {/* sea */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-5,0]}>
        <planeGeometry args={[LOOP_DISTANCE + 15,40]} />
        <MeshReflectorMaterial
          normalMap={normalMap}
          normalScale={[0.6,0.6]} // ripple depth 
          roughnessMap={roughnessMap}
          aoMap={aoMap}
          blur={[400,100]} // width, height
          resolution={1024}
          mixBlur={0.7}
          mixStrength={80} //strength of reflection
          roughness={0.4} //hgiher roughness looks more like water than mirror
          depthScale={0.4}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#050a12"
          metalness={0.9}
          mirror={1}
          transparent
          opacity={1}
          depthToBlurRatioBias={0}
        />
      </mesh>


      {/* the world (floorRef) */}
      <group ref={floorRef}>
        <WorldContent maps={{ normalMap, roughnessMap, aoMap }}/>

        <group position={[LOOP_DISTANCE, -0.01,0]}>
          <WorldContent maps={{ normalMap, roughnessMap, aoMap }}/>
        </group>

        <group position={[-LOOP_DISTANCE,-0.01,0]}>
          <WorldContent maps={{ normalMap, roughnessMap, aoMap }}/>
        </group>
      </group>
    </>
  );
}
