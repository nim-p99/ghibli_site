import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF, useTexture, Clone, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';


const MOVIE_DATA = [
  { id: 'welcome', type: 'welcome', title: 'Welcome aboard', x: 0, posterUrl: "/welcome.png" },
  { id: 0, title: "Nausicaä of the Valley of the Wind", year: "1984", director: "Hayao Miyazaki", description: "Far in the future, after an apocalyptic war has destroyed civilization, Princess Nausicaä strives to stop two warring nations from destroying themselves and their dying planet.", x: 20, posterUrl: "/nausicaa.jpg", stills: ["/nausicaa/still1.jpg", "/nausicaa/still2.jpg", "/nausicaa/still3.jpg"] },
  { id: 1, title: "Castle in the Sky", year: "1986", director: "Hayao Miyazaki", description: "Pazu's life changes when he meets Sheeta, a girl whom pirates are chasing for her crystal amulet, which has the potential to locate Laputa, a legendary castle floating in the sky.", x: 40, posterUrl: "/castle-sky.jpg", stills: ["/castle-sky/still1.jpg", "/castle-sky/still2.jpg", "/castle-sky/still3.jpg"] },
  { id: 2, title: "Grave of the Fireflies", year: "1988", director: "Isao Takahata", description: "Grave of the Fireflies is a Japanese animated war drama film directed by Isao Takahata. Based on the 1967 semi-autobiographical short story by Akiyuki Nosaka, the film tells the heartbreaking story of two siblings, Seita and Setsuko, struggling to survive in Japan during World War II.", x: 60, posterUrl: "/fireflies.jpg", stills: ["/grave/still1.jpg", "/grave/still2.jpg", "/grave/still3.jpg"] },
  { id: 3, title: "My Neighbour Totoro", year: "1988", director: "Hayao Miyazaki", description: "Sisters Satsuki and Mei move home with their father to rural Japan to be closer to their convalescing mother. On arriving to their new house, Mei (the youngest sister) encounters susuwatari (house sprites) and soon discovers even more magical creatures sharing their garden and the surrounding woods. After following a trail to an ancient camphor tree nearby, she meets the huge, enigmatic and wonderful spirit Totoro and an adventure with nature begins for her and her family.", x: 80, posterUrl: "/totoro.jpg", stills: ["/totoro/still1.webp", "/totoro/still1.jpg", "/totoro/still2.jpg"] },
  { id: 4, title: "Kiki's Delivery Service", year: "1989", director: "Hayao Miyazaki", description: "Kiki is a 13-year-old witch in training who leaves home with her black cat, Jiji, to spend a year living independently. She flies off on her broomstick to find a town where she can hone her skills and learn about the world.", x: 100, posterUrl: "/kiki.jpg", stills: ["/kiki/still1.jpg", "/kiki/still2.jpg", "/kiki/still3.jpg"] },
  { id: 5, title: "Only Yesterday", year: "1991", director: "Isao Takahata", description: "Unlike many of Ghibli’s fantasy-filled works, this film adopts a realistic and reflective tone, exploring memory, adulthood, and existential longing through the quietly emotional life of a 27-year-old woman named Taeko.", x: 120, posterUrl: "/yesterday.jpg", stills: ["/yesterday/still1.jpg", "/yesterday/still2.jpg", "/yesterday/still3.jpg"] },
  { id: 6, title: "Porco Rosso", year: "1992", director: "Hayao Miyazaki", description: "Set in the Adriatic Sea during the interwar period, the film opens with the story of Marco Pagot, a World War I fighter pilot who has been mysteriously transformed into an anthropomorphic pig. Known now as Porco Rosso (Italian for “Red Pig”), he works as a bounty hunter, capturing air pirates who terrorize the sea.", x: 140, posterUrl: "/porco.jpg", stills: ["/porco/still1.jpg", "/porco/still2.jpg", "/porco/still3.jpg"] },
  { id: 7, title: "Ocean Waves", year: "1993", director: "Tomomi Mochizuki", description: "As a young man returns to his hometown for his high school reunion, he reminisces about the arrival of a beautiful transfer student and the rift she caused between him and his best friend.", x: 160, posterUrl: "/ocean-waves.jpg", stills: ["/ocean/still1.jpg", "/ocean/still2.jpg", "/ocean/still3.jpg"] },
  { id: 8, title: "Pom Poko", year: "1994", director: "Isao Takahata", description: "Pom Poko tells the story of a group of tanuki (Japanese raccoon dogs) who find their forest home threatened by the rapid expansion of Tokyo’s suburbs during the 1960s. The tanuki band together to reclaim their land, using their shape-shifting abilities to sabotage human development projects and remind people of the magic and importance of nature. The film seamlessly blends humor, action, and tragedy, taking viewers on an emotional rollercoaster.", x: 180, posterUrl: "/pompoko.jpg", stills: ["/pompoko/still1.jpg", "/pompoko/still2.jpg", "/pompoko/still3.jpg"] },
  { id: 9, title: "Whisper of the Heart", year: "1995", director: "Yoshifumi Kondō", description: "Shizuku Tsukishima is a 14-year-old student in Tokyo who loves reading and writing. She discovers that all the library books she checks out have been previously borrowed by someone named Seiji Amasawa. Intrigued, Shizuku sets out to find this mysterious person.", x: 200, posterUrl: "/whisper.jpg", stills: ["/whisper/still1.jpg", "/whisper/still2.jpg", "/whisper/still3.jpg"] },
  { id: 10, title: "Princess Mononoke", year: "1997", director: "Hayao Miyazaki", description: "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.", x: 220, posterUrl: "/mononoke.jpg", stills: ["/mononoke/still1.jpg", "/mononoke/still2.jpg", "/mononoke/still3.jpg"] },
  { id: 11, title: "My Neighbors the Yamadas", year: "1999", director: "Isao Takahata", description: "My Neighbors the Yamadas doesn’t have a traditional plot. Instead, it’s a series of loosely connected vignettes that follow the daily lives of the Yamada family.The film’s charm lies in its relatability. From bickering over dinner to the chaos of misplacing a child at the mall, the Yamadas’ antics are hilariously familiar. Each vignette is like a snapshot of family life—messy, chaotic, and full of love.", x: 240, posterUrl: "/yamadas.jpg", stills: ["/yamada/still1.jpg", "/yamada/still2.jpg", "/yamada/still3.jpg"] },
  { id: 12, title: "Spirited Away", year: "2001", director: "Hayao Miyazaki", description: "At its core, Spirited Away is a coming-of-age story. It follows Chihiro Ogino, a ten-year-old girl, who stumbles into a mysterious spirit world when her parents decide to explore an abandoned amusement park. Things take a surreal turn when her parents are transformed into pigs after indulging in a feast meant for spirits. Stranded and terrified, Chihiro must navigate this otherworldly realm, working at a bathhouse owned by the witch Yubaba to find a way to save her parents and return to the human world. The narrative is rich with layers of meaning. On one hand, it’s a whimsical adventure filled with bizarre creatures and magical encounters. On the other, it’s a poignant tale of resilience, maturity, and self-discovery. Every twist and turn of Chihiro’s journey keeps you glued to the screen, making you root for her every step of the way.", x: 260, posterUrl: "/spirited-away.jpg", stills: ["/spirited/still1.webp", "/spirited/still2.webp", "/spirited/still3.webp"] },
  { id: 13, title: "The Cat Returns", year: "2002", director: "Hiroyuki Morita", description: "The story follows Haru, an unassuming high school girl whose life takes a fantastical turn when she saves a cat from being hit by a truck. Little does she know, this isn’t just any cat — it’s Prince Lune from the mysterious Cat Kingdom. As a token of gratitude, Haru is showered with bizarre gifts (catnip, anyone?) and is offered the Prince’s paw in marriage. Naturally, chaos ensues when Haru is whisked away to the Cat Kingdom and begins to transform into a feline herself.", x: 280, posterUrl: "/cat-returns.jpg", stills: ["/cat/still1.jpg", "/cat/still2.jpg", "/cat/still3.jpg"] },
  { id: 14, title: "Howl's Moving Castle", year: "2004", director: "Hayao Miyazaki", description: "On the surface, Howl’s Moving Castle tells the story of Sophie, a young woman cursed by a wicked witch to live in the body of an elderly lady. Seeking a way to break the spell, she stumbles upon the titular moving castle, home to the enigmatic wizard Howl and his ragtag group of companions. But this isn’t just a fairy tale about breaking curses and finding love. It’s a story about self-discovery, inner beauty, and the courage to confront life’s challenges head-on.", x: 300, posterUrl: "/howl.jpg", stills: ["/howl/still1.jpg", "/howl/still2.jpg", "/howl/still3.jpg"] },
  { id: 15, title: "Tales from Earthsea", year: "2006", director: "Gorō Miyazaki", description: "The film begins with a mysterious disaster: dragons, ancient and magical creatures, are seen fighting far away over the sea. This occurrence signals a disturbance in the world’s natural order.", x: 320, posterUrl: "/earthsea.jpg", stills: ["/earthsea/still1.jpg", "/earthsea/still2.jpg", "/earthsea/still3.jpg"] },
  { id: 16, title: "Ponyo", year: "2008", director: "Hayao Miyazaki", description: "This story follows the journey of Ponyo, a goldfish with magical powers, who dreams of becoming human after befriending a young boy named Sōsuke. Their bond serves as the heart of the story, driving a narrative filled with wonder, humor, and warmth.", x: 340, posterUrl: "/ponyo.jpg", stills: ["/ponyo/still1.jpg", "/ponyo/still2.jpg", "/ponyo/still3.jpg"] },
  { id: 17, title: "Arrietty", year: "2010", director: "Hiromasa Yonebayashi", description: "The Clock family are four-inch-tall people who live anonymously in another family's residence, borrowing simple items to make their home.", x: 360, posterUrl: "/arrietty.jpg", stills: ["/arrietty/still1.jpg", "/arrietty/still2.jpg", "/arrietty/still3.jpg"] },
  { id: 18, title: "From Up on Poppy Hill", year: "2011", director: "Gorō Miyazaki", description: "A group of Yokohama teens look to save their school's clubhouse from the wrecking ball in preparations for the 1964 Tokyo Olympics.", x: 380, posterUrl: "/poppy-hill.jpg", stills: ["/poppy/still1.jpg", "/poppy/still2.jpg", "/poppy/still3.jpg"] },
  { id: 19, title: "The Wind Rises", year: "2013", director: "Hayao Miyazaki", description: "The Wind Rises is a semi-fictionalized tale of Jiro Horikoshi, the real-life designer of Japan’s World War II fighter planes. Jiro dreams of creating beautiful aircraft, inspired by his childhood idol, Italian aviation pioneer Giovanni Caproni. Despite being born in a turbulent era marked by war and economic hardship, Jiro’s passion for flight remains unyielding. Along the way, he finds love in Naoko, a young woman battling her own struggles with tuberculosis. Their romance is tender, bittersweet, and beautifully woven into Jiro’s journey as an artist and dreamer.", x: 400, posterUrl: "/wind-rises.jpg", stills: ["/wind/still1.jpg", "/wind/still2.jpg", "/wind/still3.jpg"] },
  { id: 20, title: "The Tale of The Princess Kaguya", year: "2013", director: "Isao Takahata", description: "Found inside a shining stalk of bamboo by an old bamboo cutter and his wife, a tiny girl grows rapidly into an exquisite young lady.", x: 420, posterUrl: "/kaguya.png", stills: ["/kaguya/still1.jpg", "/kaguya/still2.jpg", "/kaguya/still3.jpg"] },
  { id: 21, title: "When Marnie Was There", year: "2014", director: "Hiromasa Yonebayashi", description: "Upon being sent to live with relatives in the countryside due to an illness, a girl becomes obsessed with an abandoned mansion and meets a girl named Marnie.", x: 440, posterUrl: "/marnie.jpg", stills: ["/marnie/still1.jpg", "/marnie/still2.jpg", "/marnie/still3.jpg"] },
  { id: 22, title: "The Red Turtle", year: "2016", director: "Michaël Dudok de Wit", description: "Stranded on a remote island, a solitary man struggles to escape, but his attempts are repeatedly thwarted by a giant red turtle. The unlikely encounter leads to an unexpected connection as he navigates the challenges of survival and begins to question his desire to leave. Through this surreal experience, he confronts themes of freedom, connection, and the acceptance of the natural world.", x: 460, posterUrl: "/red-turtle.jpg", stills: ["/turtle/still1.jpg", "/turtle/still2.jpg", "/turtle/still3.jpg"] },
  { id: 23, title: "Earwig and the Witch", year: "2020", director: "Gorō Miyazaki", description: "Orphaned and spirited Earwig finds herself taken in by a strange couple running a magical apothecary. As she settles into her new life in the British countryside, she discovers that her guardians are eccentric witches hiding a multitude of secrets. Driven by her curiosity and determination, Earwig sets out to uncover the truth about their magic and the circumstances that led her to them, hoping to find a place where she truly belongs.", x: 480, posterUrl: "/earwig.jpg", stills: ["/earwig/still1.jpg", "/earwig/still2.jpg", "/earwig/still3.jpg"] },
  { id: 24, title: "The Boy and the Heron", year: "2023", director: "Hayao Miyazaki", description: "The story begins in 1943 Tokyo, as young Mahito Maki’s life is turned upside down by a devastating air raid that claims his mother’s life. This tragic event sets the stage for Mahito’s journey of grief, growth, and fantastical discovery.", x: 500, posterUrl: "/boy-heron.png", stills: ["/heron/still1.jpg", "/heron/still2.jpg", "/heron/still3.jpg"] }
];
//const LOOP_DISTANCE = 500;
const LOOP_DISTANCE = 550;






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
  //const clonedScene = scene.clone();
  const lampColor = "#ffcc80";

  return (
    <group position={[movie.x, -5.2, -14]}>
      {/* 3d model */}
      {/* <primitive object={clonedScene} scale={0.35} /> */}
      <Clone object={scene} scale={0.35} deep={false} />
      {/* light source */}
      <pointLight
        position={[-1,13,0.5]}
        intensity={15}
        distance={10}
        color={lampColor}
      />

      {/* the movie poster */}
      {movie.type === 'welcome' ? (
        <mesh position={[0,8.5,1]}>
          <planeGeometry args={[12,4.8]} />
          <Suspense fallback={<meshBasicMaterial color="gray" />}>
            <WelcomeMaterial url={movie.posterUrl} />
          </Suspense>
        </mesh>
      ) : (
        <mesh position={[0,8.5,0.2]}>
          <planeGeometry args={[5,7.5]} />
          <Suspense fallback={<meshStandardMaterial color="gray" />}>
            <PosterMaterial url={movie.posterUrl} />
          </Suspense>
        </mesh>
      )}
      
    </group>
  );
}



// helper to load multiple images in a loop 
function PosterMaterial({ url }) {
  const texture = useTexture(url);
  // return <meshStandardMaterial map={texture} side={2} emissive={"#ffffff"} emissiveIntensity={0.025} />;
  return <meshBasicMaterial map={texture} side={2} />;
}

function WelcomeMaterial({ url }) {
  const texture = useTexture(url);
  return <meshBasicMaterial map={texture} side={2} transparent={true} />;
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [holdingLeft, setHoldingLeft] = useState(false);
  const [holdingRight, setHoldingRight] = useState(false);

  useEffect(() => {
      if (typeof window === 'undefined') return;

      const isTouchDevice =
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.matchMedia('(pointer: coarse)').matches;

      setIsMobile(isTouchDevice);
    }, []);

  
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

    if (isExpanded || isAboutOpen) {
      speed.current *= 0.8;
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

      {/* about button */}
      <Html 
        portal={document.body} 
        fullscreen 
        style={{
          pointerEvents: isAboutOpen ? 'auto' : 'none'
        }}
      >
        <div style={{
          position: 'absolute', 
          top: '10px',
          right: '10px',
          zIndex: 3000,
        }}>
          <button
            onClick={() => {setIsAboutOpen(true); setIsExpanded(false);}}
            style={{
              background: '#AD5463',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '10px 15px',
              borderRadius: '20px',
              fontFamily: 'Futura',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              pointerEvents: 'auto', 
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#BD7941')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#AD5463')}
          >
            About
          </button>
        </div>
      </Html>

      {/* about modal */}
      {isAboutOpen && (
        <Html center>
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '14px',
              width: isMobile ? '70vw' : '420px',
              maxWidth: '420px',
              color: '#333',
              textAlign: 'left',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              fontFamily: 'Futura',
              maxHeight: '80vh', 
              overflowY: 'auto',
              pointerEvents: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0, color: '#6F576E' }}>About this site</h2>
            
            {isMobile && (
              <h4 style={{ lineHeight: 1.6}}>
                This website only works on desktop at the moment!
              </h4>
            )}

            <p style={{ lineHeight: 1.6 }}>
              This is an interactive gallery celebrating the legacy of Studio Ghibli.
              As you make your journey across the sea, you can view every major release in 
              chronological order.
            </p>

            <p style={{ lineHeight: 1.6, fontSize: '0.9em', opacity: 0.8 }}>
              Created as a tribute to the art of Hayao Miyazaki, Isao Takahata, 
              and the many talented artists at the studio.
            </p>

            <p style={{ lineHeight: 1.6, fontSize: '0.8em', opacity: 0.6}}>
              Made by Nimesh Patel.
            </p>
            <button
              onClick={() => setIsAboutOpen(false)}
              style={{
                marginTop: '20px',
                background: '#646392',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Return to Train
            </button>
          </div>
        </Html>
      )}


      {/* UI prompt- only show if nearbyMovie is not null */}
      {nearbyMovie && !isExpanded && (
        <Html center position={[0, isMobile ? -5 : -7,0]} portal={document.body}>
          <div 
            // onClick={() => setIsExpanded(true)}
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            style={{
            background:'#AD5463', color:'#ffffff', padding:'5px',
            borderRadius: '5px', whiteSpace: 'nowrap', fontFamily: 'Futura',
            fontWeight: 500, opacity: 1, cursor: isMobile ? 'pointer' : 'default',
            pointerEvents: 'auto', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
            zIndex: 5000, touchAction: 'none',
            
          }}>
            {nearbyMovie.type === 'welcome'
              ? isMobile
                ? 'Sorry! Only works on desktop :('
                : 'Press [Space] to begin your journey'
              : isMobile 
                ? `Tap to view ${nearbyMovie.title}`
                : `Press [Space] to view ${nearbyMovie.title}`}
          </div>
        </Html>
      )}

      {/* UI movie details - visible only if expanded */}
      {nearbyMovie && isExpanded && (
        <Html 
          center
          portal={document.body}
          // distanceFactor={10}
        >
          {nearbyMovie.type === 'welcome' ? (
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '14px',
                width: isMobile ? '70vw' : '420px',
                maxWidth: '420px',
                color: '#333',
                textAlign: 'left',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                fontFamily: 'Futura',
                maxHeight: '80vh', 
                overflowY: 'auto',
                pointerEvents: 'auto',
                // transform: isMobile ? 'translateY(-10%)' : 'none',
              }}
            >
              <h2 style={{ marginTop: 0 }}>Welcome aboard</h2>
              
              {isMobile && (
              <h4 style={{ lineHeight: 1.6}}>
                This website only works on desktop at the moment!
              </h4>
              )}

              <p style={{ lineHeight: 1.5 }}>
                Take a journey through the 25 films released by Studio Ghibli. 
                Travel along the track using the arrow keys and stop by each
                lampost to explore a movie.
              </p>

              <p style={{ opacity: 0.7 }}>
                Press <strong>Space</strong> near a lampost to open details.
              </p>

              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  marginTop: '16px',
                  background: '#AC85A9',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Futura',
                }}
              >
                Let's go!
              </button>
            </div>
          ) : (
            <div style = {{
              background: 'white',
              padding: '15px',
              borderRadius: '10px',
              width: '550px',
              color: '#333',
              textAlign: 'left',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              fontFamily: 'Futura',
              fontWeight: 400,
            }}>
              <h3 style={{ marginBottom: '4px', fontWeight:700}}>{nearbyMovie.title}</h3>
              <p style={{ marginTop:0, opacity:0.6 }}>Year: {nearbyMovie.year}</p>
              <p style={{ marginTop:0, lineHeight:1.45, color:'green'}}>Dir: {nearbyMovie.director}</p>
              <p>{nearbyMovie.description}</p>
              <div style={{
                display: 'flex',
                gap: '50px',
                marginTop: '8px'
              }}>
                {nearbyMovie.stills.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    onClick={() => setExpandedImage(src)}
                    style={{
                      width: '150px',
                      height: '75px',
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
                  background: '#646392',
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
                        right: '-8px',
                        width: '45px',
                        height: '30px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#646392',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontFamily: 'Futura',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Html>
      )}
      {/* train */}
      <TrainModel />  

     
      {/* sea */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-5,0]}>
        <planeGeometry args={[LOOP_DISTANCE + 30,40]} />
        {isMobile ? (
          <meshStandardMaterial
            color="#050a12"
            metalness={0.8}
            roughness={0.2}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.3, 0.3)}
            transparent
            opacity={0.9}
          />
        ) : (
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
        )}
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
