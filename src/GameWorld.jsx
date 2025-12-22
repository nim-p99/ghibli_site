import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';


const MOVIE_DATA = [
  { id: 0, title: "Spirited Away", year: "2001", description: "A young girl wanders into a spirit world", x:10, color: "gold" },
  { id: 1, title: "My Neighbour Totoro", year: "1988", description: "Two sisters befriend forest spirits.", x:30, color: "green" },
];
//const LOOP_DISTANCE = 500;
const LOOP_DISTANCE = 40;


function TrainModel() {
  // useGLTF checks /public folder by default
  const { scene } = useGLTF('/train.glb');

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, -5.25, 0]}
      rotation={[0,0,0]}
    />
  );
}

function WorldContent() {
  return (
    <>
      {/* floor */}
      <mesh rotation={[-Math.PI/2, 0,0]} position={[0,-3,0]}>
        <planeGeometry args={[40,10]} />
        <meshPhysicalMaterial color='#2e5a88' transparent opacity={0.9} transmission={1} roughness={0.2}/>
      </mesh>

      {/* marker */}
      {MOVIE_DATA.map(movie => (
        <group key={movie.id} position={[movie.x, 1.5, -3]}>
          <mesh>
            <sphereGeometry args={[0.5]} />
            <meshStandardMaterial color={movie.color} />
          </mesh>
        </group>
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
        <Html center position={[0,-3,0]}>
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
      {/* the world (floorRef) */}
      <group ref={floorRef}>
        <WorldContent />

        <group position={[LOOP_DISTANCE, 0,0]}>
          <WorldContent />
        </group>

        <group position={[-LOOP_DISTANCE,0,0]}>
          <WorldContent />
        </group>
      </group>
    </>
  );
}
