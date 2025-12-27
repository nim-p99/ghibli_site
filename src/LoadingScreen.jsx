import { Html, useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html fullscreen>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(#f2d6a2, #ce9cc7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Futura',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.85)',
            padding: '24px 32px',
            borderRadius: '14px',
            textAlign: 'center',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, color: '#3E2D4E' }}>
            Boarding the train…
          </p>

          <div
            style={{
              marginTop: '12px',
              width: '220px',
              height: '6px',
              background: '#ddd',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#201637',
                transition: 'width 0.2s ease',
              }}
            />
          </div>

          <p style={{ marginTop: '8px', opacity: 0.6, color: '#3E2D4E' }}>
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}
