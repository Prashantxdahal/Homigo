import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';

function Homigo3DLogo() {
  return (
    <Float speed={2} floatIntensity={2}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#003580" />
        <Html center>
          <div style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '2rem',
            textAlign: 'center',
            textShadow: '0 2px 8px #0071c2',
          }}>
            Homigo
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div style={{ width: '100%', height: '400px', background: 'linear-gradient(90deg, #003580 0%, #0071c2 100%)', borderRadius: '2rem', overflow: 'hidden', marginBottom: '2rem' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Homigo3DLogo />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
