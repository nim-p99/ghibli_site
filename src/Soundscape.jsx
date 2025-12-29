import React, {useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

const Soundscape = forwardRef((props, ref) => {
  const musicRef = useRef();
  const seaRef = useRef();
  const tracksRef = useRef();

  const [isMuted, setIsMuted] = useState(false);

  // expose function to the parent (App)
  useImperativeHandle(ref, () => ({
    updateTracks: (speed) => {
      if (tracksRef.current && !isMuted) {
        // map speed to volume (0.0 to 1.0)
        const motion = Math.min(Math.abs(speed)/5, 0.4);
        tracksRef.current.volume = motion;
      }
    }
  }));

  useEffect(() => {
    [musicRef, seaRef, tracksRef].forEach(audio => {
      if (audio.current) {
        audio.current.muted = isMuted;
      }
    });
  }, [isMuted]);

  useEffect(() => {
    const startAudio = () => {
      // play audio
      musicRef.current?.play().catch(() => {});
      seaRef.current?.play().catch(() => {});
      tracksRef.current?.play().catch(() => {});
      // set initial volumes
      if (musicRef.current) musicRef.current.volume = 0.7;
      if (seaRef.current) seaRef.current.volume = 0.2;
      if (tracksRef.current) tracksRef.current.volume = 0.1;

      // clean up - remove listeners
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
  }, []);

  return (
    <>
      <div style={{
          position: 'absolute',
          top: '12px',
          right: '100px', 
          zIndex: 9999,
          pointerEvents: 'auto',
        }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              background: '#A85261',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '7px',
              borderRadius: '50%',
              cursor: 'pointer',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              pointerEvents: 'auto'
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
      </div>
      <div style={{ display: 'none' }}>
        <audio ref={musicRef} src="/bg-music.mp3" loop />
        <audio ref={seaRef} src="/sea-waves.mp3" loop />
        <audio ref={tracksRef} src="/train-tracks.mp3" loop />
      </div>
    </>
  );
});

export default Soundscape;
