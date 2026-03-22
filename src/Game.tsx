import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Html } from '@react-three/drei';
import { useGameStore } from './store';
import { Player } from './components/Player';
import { Environment } from './components/Environment';
import { UI } from './components/UI';
import * as THREE from 'three';

function CameraController() {
  const myId = useGameStore(state => state.myId);
  const players = useGameStore(state => state.players);
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (myId && players[myId] && controlsRef.current) {
      const myPos = players[myId].position;
      // Smoothly interpolate target
      const target = new THREE.Vector3(myPos[0], 0, myPos[2]);
      controlsRef.current.target.lerp(target, 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enableRotate={false} 
      enableZoom={true} 
      enablePan={true}
      minZoom={20}
      maxZoom={80}
      target={[0, 0, 0]}
    />
  );
}

export default function Game() {
  const connect = useGameStore(state => state.connect);
  const players = useGameStore(state => state.players);
  const myId = useGameStore(state => state.myId);

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <div className="w-full h-screen bg-slate-900 overflow-hidden relative">
      <Canvas shadows>
        <color attach="background" args={['#1e293b']} />
        <fog attach="fog" args={['#1e293b', 30, 90]} />
        {/* Isometric Camera Setup */}
        <OrthographicCamera
          makeDefault
          position={[20, 20, 20]}
          zoom={40}
          near={0.1}
          far={1000}
        />
        
        <CameraController />

        <Suspense fallback={<Html center><div className="text-white font-bold text-xl whitespace-nowrap">Loading 3D Assets...</div></Html>}>
          <Environment />

          {/* Render all players */}
          {Object.values(players).map(player => (
            <Player 
              key={player.id} 
              player={player} 
              isMe={player.id === myId} 
            />
          ))}
        </Suspense>
      </Canvas>
      
      <UI />
    </div>
  );
}
