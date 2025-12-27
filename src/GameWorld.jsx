import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF, useTexture, Clone, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';


// const MOVIE_DATA = [
//   { id: 0, title: "Spirited Away", year: "2001", director: "Hayao Miyazaki", description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.", x:20, posterUrl: "/spirited-away.jpg", stills:["/spirited/still1.webp","/spirited/still2.webp", "/spirited/still3.webp",],},
//   { id: 1, title: "My Neighbour Totoro", year: "1988", director: "Hayo Miyazaki", description: "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.", x:45, posterUrl: "/totoro.jpg", color: "green" },
// ];

const MOVIE_DATA = [
  { id: 0, title: "Nausicaä of the Valley of the Wind", year: "1984", director: "Hayao Miyazaki", description: "Far in the future, after an apocalyptic war has destroyed civilization, Princess Nausicaä strives to stop two warring nations from destroying themselves and their dying planet.", x: 10, posterUrl: "/nausicaa.jpg", stills: [] },
  { id: 1, title: "Castle in the Sky", year: "1986", director: "Hayao Miyazaki", description: "A young boy and a girl with a magic crystal must race against pirates and foreign agents in a search for a legendary floating castle.", x: 30, posterUrl: "/castle-sky.jpg", stills: [] },
  { id: 2, title: "Grave of the Fireflies", year: "1988", director: "Isao Takahata", description: "A young boy and his little sister struggle to survive in Japan during World War II.", x: 50, posterUrl: "/fireflies.jpg", stills: [] },
  { id: 3, title: "My Neighbour Totoro", year: "1988", director: "Hayao Miyazaki", description: "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.", x: 70, posterUrl: "/totoro.jpg", stills: [] },
  { id: 4, title: "Kiki's Delivery Service", year: "1989", director: "Hayao Miyazaki", description: "A young witch, on her mandatory year of independent life, finds fitting into a new community difficult while she supports herself by running an air courier service.", x: 90, posterUrl: "/kiki.jpg", stills: [] },
  { id: 5, title: "Only Yesterday", year: "1991", director: "Isao Takahata", description: "A twenty-seven-year-old office worker travels to the countryside while reminiscing about her childhood in Tokyo.", x: 110, posterUrl: "/yesterday.jpg", stills: [] },
  { id: 6, title: "Porco Rosso", year: "1992", director: "Hayao Miyazaki", description: "In 1930s Italy, a veteran World War I pilot is cursed to look like an anthropomorphic pig.", x: 130, posterUrl: "/porco.jpg", stills: [] },
  { id: 7, title: "Ocean Waves", year: "1993", director: "Tomomi Mochizuki", description: "As a young man returns to his hometown for his high school reunion, he reminisces about the arrival of a beautiful transfer student and the rift she caused between him and his best friend.", x: 150, posterUrl: "/ocean-waves.jpg", stills: [] },
  { id: 8, title: "Pom Poko", year: "1994", director: "Isao Takahata", description: "A community of magical shape-shifting raccoons desperately struggles to prevent their forest home from being destroyed by urban development.", x: 170, posterUrl: "/pompoko.jpg", stills: [] },
  { id: 9, title: "Whisper of the Heart", year: "1995", director: "Yoshifumi Kondō", description: "A love story between a girl who loves reading books, and a boy who has previously checked out all of the library books she chooses.", x: 190, posterUrl: "/whisper.jpg", stills: [] },
  { id: 10, title: "Princess Mononoke", year: "1997", director: "Hayao Miyazaki", description: "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.", x: 210, posterUrl: "/mononoke.jpg", stills: [] },
  { id: 11, title: "My Neighbors the Yamadas", year: "1999", director: "Isao Takahata", description: "The life and misadventures of a family in contemporary Japan.", x: 230, posterUrl: "/yamadas.jpg", stills: [] },
  { id: 12, title: "Spirited Away", year: "2001", director: "Hayao Miyazaki", description: "During her family's move to the suburbs, a 10-year-old girl wanders into a world ruled by gods, witches and spirits.", x: 250, posterUrl: "/spirited-away.jpg", stills: ["/spirited/still1.webp", "/spirited/still2.webp", "/spirited/still3.webp"] },
  { id: 13, title: "The Cat Returns", year: "2002", director: "Hiroyuki Morita", description: "After helping a cat, a girl finds herself involuntarily engaged to a cat prince in a magical world.", x: 270, posterUrl: "/cat-returns.jpg", stills: [] },
  { id: 14, title: "Howl's Moving Castle", year: "2004", director: "Hayao Miyazaki", description: "When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard.", x: 290, posterUrl: "/howl.jpg", stills: [] },
  { id: 15, title: "Tales from Earthsea", year: "2006", director: "Gorō Miyazaki", description: "In a mythical land, a man and a young boy investigate a series of unusual occurrences.", x: 310, posterUrl: "/earthsea.jpg", stills: [] },
  { id: 16, title: "Ponyo", year: "2008", director: "Hayao Miyazaki", description: "A five-year-old boy develops a relationship with Ponyo, a goldfish princess who longs to become a human after falling in love with him.", x: 330, posterUrl: "/ponyo.jpg", stills: [] },
  { id: 17, title: "Arrietty", year: "2010", director: "Hiromasa Yonebayashi", description: "The Clock family are four-inch-tall people who live anonymously in another family's residence, borrowing simple items to make their home.", x: 350, posterUrl: "/arrietty.jpg", stills: [] },
  { id: 18, title: "From Up on Poppy Hill", year: "2011", director: "Gorō Miyazaki", description: "A group of Yokohama teens look to save their school's clubhouse from the wrecking ball in preparations for the 1964 Tokyo Olympics.", x: 370, posterUrl: "/poppy-hill.jpg", stills: [] },
  { id: 19, title: "The Wind Rises", year: "2013", director: "Hayao Miyazaki", description: "A lifelong love of flight inspires Japanese aviation engineer Jiro Horikoshi, whose storied career includes the creation of the A-6M World War II fighter plane.", x: 390, posterUrl: "/wind-rises.jpg", stills: [] },
  { id: 20, title: "The Tale of The Princess Kaguya", year: "2013", director: "Isao Takahata", description: "Found inside a shining stalk of bamboo by an old bamboo cutter and his wife, a tiny girl grows rapidly into an exquisite young lady.", x: 410, posterUrl: "/kaguya.png", stills: [] },
  { id: 21, title: "When Marnie Was There", year: "2014", director: "Hiromasa Yonebayashi", description: "Upon being sent to live with relatives in the countryside due to an illness, a girl becomes obsessed with an abandoned mansion and meets a girl named Marnie.", x: 430, posterUrl: "/marnie.jpg", stills: [] },
  { id: 22, title: "The Red Turtle", year: "2016", director: "Michaël Dudok de Wit", description: "A man is shipwrecked on a deserted island and encounters a giant red turtle.", x: 450, posterUrl: "/red-turtle.jpg", stills: [] },
  { id: 23, title: "Earwig and the Witch", year: "2020", director: "Gorō Miyazaki", description: "An orphan girl, Earwig, is adopted by a witch and comes home to a spooky house filled with mystery and magic.", x: 470, posterUrl: "/earwig.jpg", stills: [] },
  { id: 24, title: "The Boy and the Heron", year: "2023", director: "Hayao Miyazaki", description: "A young boy named Mahito venturing into a world shared by the living and the dead.", x: 490, posterUrl: "/boy-heron.png", stills: [] }
];
//const LOOP_DISTANCE = 500;
const LOOP_DISTANCE = 520;


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
      position={[0, -5.75, 0]}
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
  const [expandedImage, setExpandedImage] = useState(null);

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
      const flowSpeed = distance.current * 0.05;
      const constantDrift = state.clock.elapsedTime * 0.02;


      normalMap.offset.set(flowSpeed, constantDrift);
      roughnessMap.offset.set(flowSpeed, constantDrift);
      aoMap.offset.set(flowSpeed, constantDrift);
      normalMap.needsUpdate = true;

    }

    // proximity - find a movie where distance is < 2 units away 
    const found = MOVIE_DATA.find(m => Math.abs(m.x - wrappedDist) < 4);
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
      {/* Instructions */}
      <Html center position={[0,-11,0]}>
        <div style ={{
          color:'#CB99C3', whiteSpace: 'nowrap', opacity: 0.7
        }}>
          ← Use the Arrow Keys to move → 
        </div>
      </Html>

      {/* UI prompt- only show if nearbyMovie is not null */}
      {nearbyMovie && !isExpanded && (
        <Html center position={[0,-7,0]}>
          <div style={{
            background:'#6F576E', color:'#ffffff', padding:'10px',
            borderRadius: '15px', whiteSpace: 'nowrap', fontFamily: 'Futura', fontWeight: 500, opacity: 0.9,
            
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
            textAlign: 'left',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            fontFamily: 'Futura',
            fontWeight: 400,
          }}>
            <h3 style={{ marginBottom: '4px', fontWeight:700}}>{nearbyMovie.title}</h3>
            <p style={{ marginTop:0, opacity:0.6 }}>Year: {nearbyMovie.year}</p>
            <p style={{ marginTop:'10px', lineHeight:1.45}}>Director: {nearbyMovie.director}</p>
            <p>{nearbyMovie.description}</p>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px'
            }}>
              {nearbyMovie.stills.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  onClick={() => setExpandedImage(src)}
                  style={{
                    width: '120px',
                    height: '65px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                />
              ))}
            </div>
            {/* close image button */}
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                marginTop: '14px',
                fontFamily: 'Futura',
                fontWeight: 400,
                background: '#AC85A9',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>

            {expandedImage && (
              <div
                onClick={() => setExpandedImage(null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'relative',
                  }}
                >
                  <img
                    src={expandedImage}
                    alt=""
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '80vh',
                      borderRadius: '10px',
                      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                    }}
                  />

                  {/* close button */}
                  <button
                    onClick={() => setExpandedImage(null)}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-8x',
                      width: '21px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      background: '#463D55',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontFamily: 'Futura',
                      lineHeight: '12px',
                    }}
                  >
                    close
                  </button>
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
      {/* train */}
      <TrainModel />  

     
      {/* sea */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-5,0]}>
        <planeGeometry args={[LOOP_DISTANCE + 30,40]} />
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
