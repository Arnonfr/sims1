import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ContactShadows, Html, SoftShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import * as THREE from 'three';

const Indicator = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      ref.current.rotation.y += 0.05;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
    </mesh>
  );
};

const Plant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Pot */}
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.25, 0.2, 0.5]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.7} />
    </mesh>
    {/* Soil */}
    <mesh position={[0, 0.5, 0]} receiveShadow>
      <cylinderGeometry args={[0.24, 0.24, 0.02]} />
      <meshStandardMaterial color="#3f2b16" roughness={1} />
    </mesh>
    {/* Leaves */}
    <mesh position={[0, 0.8, 0]} castShadow>
      <dodecahedronGeometry args={[0.4, 1]} />
      <meshStandardMaterial color="#22c55e" roughness={0.6} />
    </mesh>
    <mesh position={[0.2, 1.1, 0.1]} castShadow>
      <dodecahedronGeometry args={[0.3, 1]} />
      <meshStandardMaterial color="#16a34a" roughness={0.6} />
    </mesh>
    <mesh position={[-0.2, 0.9, -0.2]} castShadow>
      <dodecahedronGeometry args={[0.35, 1]} />
      <meshStandardMaterial color="#15803d" roughness={0.6} />
    </mesh>
  </group>
);

const Armchair = ({ position, rotation, color }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1.2, 0.6, 1.2]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0, 0.8, -0.5]} castShadow><boxGeometry args={[1.2, 1, 0.2]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[-0.5, 0.7, 0]} castShadow><boxGeometry args={[0.2, 0.4, 1.2]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0.5, 0.7, 0]} castShadow><boxGeometry args={[0.2, 0.4, 1.2]} /><meshStandardMaterial color={color} /></mesh>
  </group>
);

const Painting = ({ position, rotation, color = "#f43f5e", width = 2, height = 1.5 }: any) => (
  <group position={position} rotation={rotation}>
    <mesh castShadow><boxGeometry args={[width + 0.1, height + 0.1, 0.1]} /><meshStandardMaterial color="#1c1917" /></mesh>
    <mesh position={[0, 0, 0.06]}><boxGeometry args={[width, height, 0.02]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
  </group>
);

const FilingCabinet = ({ position, rotation }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[0.6, 1.2, 0.8]} /><meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.5} /></mesh>
    <mesh position={[0, 0.9, 0.41]}><boxGeometry args={[0.5, 0.3, 0.02]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
    <mesh position={[0, 0.5, 0.41]}><boxGeometry args={[0.5, 0.3, 0.02]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
    <mesh position={[0, 0.1, 0.41]}><boxGeometry args={[0.5, 0.3, 0.02]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
    <mesh position={[0, 0.95, 0.43]}><boxGeometry args={[0.2, 0.02, 0.02]} /><meshStandardMaterial color="#475569" /></mesh>
    <mesh position={[0, 0.55, 0.43]}><boxGeometry args={[0.2, 0.02, 0.02]} /><meshStandardMaterial color="#475569" /></mesh>
    <mesh position={[0, 0.15, 0.43]}><boxGeometry args={[0.2, 0.02, 0.02]} /><meshStandardMaterial color="#475569" /></mesh>
  </group>
);

const Bookshelf = ({ position, rotation }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 1, 0]} castShadow receiveShadow><boxGeometry args={[1.5, 2, 0.6]} /><meshStandardMaterial color="#78350f" /></mesh>
    <mesh position={[0, 1, 0.31]}><boxGeometry args={[1.4, 1.9, 0.02]} /><meshStandardMaterial color="#451a03" /></mesh>
    <mesh position={[0, 0.5, 0.15]} castShadow><boxGeometry args={[1.4, 0.05, 0.5]} /><meshStandardMaterial color="#78350f" /></mesh>
    <mesh position={[0, 1.0, 0.15]} castShadow><boxGeometry args={[1.4, 0.05, 0.5]} /><meshStandardMaterial color="#78350f" /></mesh>
    <mesh position={[0, 1.5, 0.15]} castShadow><boxGeometry args={[1.4, 0.05, 0.5]} /><meshStandardMaterial color="#78350f" /></mesh>
    {/* Books */}
    <mesh position={[-0.4, 0.65, 0.2]} castShadow><boxGeometry args={[0.1, 0.25, 0.2]} /><meshStandardMaterial color="#ef4444" /></mesh>
    <mesh position={[-0.2, 0.62, 0.2]} castShadow rotation={[0, 0, -0.1]}><boxGeometry args={[0.08, 0.22, 0.2]} /><meshStandardMaterial color="#3b82f6" /></mesh>
    <mesh position={[0.3, 1.15, 0.2]} castShadow><boxGeometry args={[0.12, 0.28, 0.2]} /><meshStandardMaterial color="#10b981" /></mesh>
    <mesh position={[0.5, 1.15, 0.2]} castShadow><boxGeometry args={[0.09, 0.28, 0.2]} /><meshStandardMaterial color="#f59e0b" /></mesh>
    <mesh position={[-0.5, 1.65, 0.2]} castShadow><boxGeometry args={[0.15, 0.25, 0.2]} /><meshStandardMaterial color="#8b5cf6" /></mesh>
  </group>
);

const Whiteboard = ({ position, rotation }: any) => (
  <group position={position} rotation={rotation}>
    {/* Stand */}
    <mesh position={[-1.2, 0.8, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.6]} /><meshStandardMaterial color="#94a3b8" /></mesh>
    <mesh position={[1.2, 0.8, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 1.6]} /><meshStandardMaterial color="#94a3b8" /></mesh>
    {/* Feet */}
    <mesh position={[-1.2, 0.05, 0]} castShadow><boxGeometry args={[0.1, 0.1, 0.6]} /><meshStandardMaterial color="#475569" /></mesh>
    <mesh position={[1.2, 0.05, 0]} castShadow><boxGeometry args={[0.1, 0.1, 0.6]} /><meshStandardMaterial color="#475569" /></mesh>
    {/* Board */}
    <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[2.6, 1.4, 0.05]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
    <mesh position={[0, 1.4, 0.03]}><boxGeometry args={[2.5, 1.3, 0.02]} /><meshStandardMaterial color="#ffffff" roughness={0.2} /></mesh>
    {/* Marker Tray */}
    <mesh position={[0, 0.7, 0.05]} castShadow><boxGeometry args={[2.6, 0.05, 0.1]} /><meshStandardMaterial color="#94a3b8" /></mesh>
  </group>
);

const Computer = ({ position, rotation }: any) => (
  <group position={position} rotation={rotation}>
    {/* Monitor Stand */}
    <mesh position={[0, 0.1, -0.1]} castShadow><boxGeometry args={[0.2, 0.2, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
    {/* Monitor */}
    <mesh position={[0, 0.3, -0.1]} castShadow><boxGeometry args={[0.8, 0.5, 0.05]} /><meshStandardMaterial color="#222" /></mesh>
    {/* Screen */}
    <mesh position={[0, 0.3, -0.07]}><boxGeometry args={[0.75, 0.45, 0.01]} /><meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} /></mesh>
    {/* Keyboard */}
    <mesh position={[0, 0.02, 0.15]} castShadow><boxGeometry args={[0.6, 0.02, 0.2]} /><meshStandardMaterial color="#ccc" /></mesh>
    {/* Mouse */}
    <mesh position={[0.4, 0.02, 0.15]} castShadow><boxGeometry args={[0.1, 0.02, 0.15]} /><meshStandardMaterial color="#ccc" /></mesh>
  </group>
);

const Rug = ({ position, rotation, color = "#fef08a", width = 7, depth = 7, isCircle = true }: any) => (
  <mesh position={position} rotation={rotation} receiveShadow>
    {isCircle ? <circleGeometry args={[width / 2, 32]} /> : <planeGeometry args={[width, depth]} />}
    <meshStandardMaterial color={color} roughness={0.9} />
  </mesh>
);

const INTERACTABLES = [
  { id: 'desk1', pos: [6, 0, -6.5], type: 'sit_work', taskReq: 'find_desk', nextTask: 'working', ui: 'none', label: 'Sit at desk (Click or Space)' },
  { id: 'desk1_email', pos: [6, 0, -6.5], type: 'sit_work', taskReq: 'write_email', nextTask: undefined, ui: 'email', label: 'Write email (Click or Space)' },
  { id: 'coffee', pos: [-6, 0, -11], type: 'make_coffee', taskReq: 'make_coffee', nextTask: undefined, ui: 'coffee', label: 'Make coffee (Click or Space)' },
  { id: 'meeting', pos: [12, 0, 5.5], type: 'sit_work', taskReq: 'meeting', nextTask: 'meeting_active', ui: 'none', label: 'Attend meeting (Click or Space)' },
  { id: 'printer', pos: [0, 0, -4], type: 'make_coffee', taskReq: 'print_document', nextTask: undefined, ui: 'printer', label: 'Print document (Click or Space)' },
  { id: 'it_room', pos: [-10, 0, 4.5], type: 'make_coffee', taskReq: 'it_room', nextTask: undefined, ui: 'it', label: 'Reboot server (Click or Space)' },
];

export function Environment() {
  const movePlayer = useGameStore(state => state.movePlayer);
  const currentTask = useGameStore(state => state.currentTask);
  const [nearby, setNearby] = useState<string | null>(null);
  const nearbyRef = useRef<string | null>(null);

  // Procedural Textures for Sims-like floors
  const woodTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#deb887'; // Burlywood
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#c19a6b';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
      for (let j = 0; j <= 512; j += 128) {
        const offset = (i / 64) % 2 === 0 ? 64 : 0;
        ctx.beginPath(); ctx.moveTo(j + offset, i); ctx.lineTo(j + offset, i + 64); ctx.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(15, 15);
    if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const tileTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillRect(128, 128, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 4);
    if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(() => {
    const state = useGameStore.getState();
    const me = state.players[state.myId || ''];
    if (!me) return;
    const myPos = new THREE.Vector3(...me.position);
    
    let closest = null;
    let minDist = 4.0; // Interaction radius
    
    // Only check interactables for the current task
    const activeInteractables = INTERACTABLES.filter(i => i.taskReq === currentTask);

    for (const item of activeInteractables) {
      const dist = myPos.distanceTo(new THREE.Vector3(...item.pos));
      if (dist < minDist) {
        minDist = dist;
        closest = item.id;
      }
    }
    
    if (nearbyRef.current !== closest) {
      nearbyRef.current = closest;
      setNearby(closest);
    }
  });

  const handleInteract = (e: any, targetPos: [number, number, number], action: string, nextTask?: string, ui?: string) => {
    e.stopPropagation();
    const state = useGameStore.getState();
    const myPlayer = state.players[state.myId || ''];
    if (!myPlayer) return;

    // Set pending interaction and move to target
    (window as any).pendingInteraction = { action, nextTask, ui };
    movePlayer(targetPos);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if (e.code === 'Space') {
        const state = useGameStore.getState();
        const me = state.players[state.myId || ''];
        if (!me) return;
        
        const activeInteractables = INTERACTABLES.filter(i => i.taskReq === state.currentTask);

        for (const item of activeInteractables) {
          (window as any).pendingInteraction = { action: item.type, nextTask: item.nextTask, ui: item.ui };
          movePlayer(item.pos as [number, number, number]);
          break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const handleFloorClick = (e: any) => {
    e.stopPropagation();
    if (e.point) {
      movePlayer([e.point.x, 0, e.point.z]);
    }
  };

  return (
    <group>
      {/* Main Wood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial map={woodTexture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 4, -15]} receiveShadow castShadow>
        <boxGeometry args={[40, 8, 0.5]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>
      
      {/* Baseboard */}
      <mesh position={[0, 0.2, -14.7]} receiveShadow castShadow>
        <boxGeometry args={[40, 0.4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Windows */}
      <group position={[0, 4, -14.8]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[12, 4, 0.2]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Window Frames */}
        <mesh position={[0, 0, 0.1]} receiveShadow castShadow><boxGeometry args={[12.2, 4.2, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 0, 0.1]} receiveShadow castShadow><boxGeometry args={[0.2, 4.2, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-3, 0, 0.1]} receiveShadow castShadow><boxGeometry args={[0.2, 4.2, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[3, 0, 0.1]} receiveShadow castShadow><boxGeometry args={[0.2, 4.2, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 0, 0.1]} rotation={[0, 0, Math.PI/2]} receiveShadow castShadow><boxGeometry args={[0.2, 12.2, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>

      {/* Paintings on Back Wall */}
      <Painting position={[-10, 3, -14.7]} color="#38bdf8" width={2.5} height={1.2} />
      <Painting position={[10, 3, -14.7]} color="#f43f5e" width={1.8} height={2.2} />
      <Painting position={[-14, 3, -14.7]} color="#10b981" width={1.5} height={1.5} />
      <Painting position={[14, 3, -14.7]} color="#f59e0b" width={2} height={1} />

      {/* Reception Area */}
      <group position={[0, 0, 2]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#e0e7ff" />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[4, 1.2, 1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 1.2, 0.3]} castShadow receiveShadow><boxGeometry args={[4.2, 0.1, 0.4]} /><meshStandardMaterial color="#818cf8" /></mesh>
        <mesh position={[0, 0.8, -0.2]} castShadow><boxGeometry args={[0.6, 0.4, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <Plant position={[3, 0, 0]} />
        <Plant position={[-3, 0, 0]} />
      </group>

      {/* Lounge Area */}
      <group position={[-6, 0, -2]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.5, 32]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        <Armchair position={[-1.5, 0, 0]} rotation={[0, Math.PI/2, 0]} color="#f97316" />
        <Armchair position={[1.5, 0, 0]} rotation={[0, -Math.PI/2, 0]} color="#0ea5e9" />
        <Armchair position={[0, 0, -1.5]} rotation={[0, 0, 0]} color="#ec4899" />
        {/* Coffee Table */}
        <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[1, 1, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 0.15, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.3]} /><meshStandardMaterial color="#94a3b8" /></mesh>
        <Plant position={[-2.5, 0, -2.5]} />
        <Bookshelf position={[-3.2, 0, 1.5]} rotation={[0, Math.PI / 4, 0]} />
      </group>

      {/* --- OFFICE AREA (Right Side x > 0) --- */}
      <group position={[9, 0, -6.5]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#dcfce7" />
        </mesh>
        <Rug position={[0, 0.015, 0]} rotation={[-Math.PI/2, 0, 0]} color="#bbf7d0" width={10} depth={6} isCircle={false} />
        <FilingCabinet position={[-4, 0, -3]} rotation={[0, 0, 0]} />
        <FilingCabinet position={[-3.3, 0, -3]} rotation={[0, 0, 0]} />
        <FilingCabinet position={[4, 0, -3]} rotation={[0, 0, 0]} />
        <Plant position={[-5, 0, -3]} />
        <Plant position={[5, 0, -3]} />
      </group>

      {/* Reception Desk */}
      <group position={[0, 0, 12]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 1.2, 1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 1.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.05, 1.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0.6, -0.8]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.2, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 1.22, -0.8]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.05, 0.8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Receptionist Computer */}
        <mesh position={[0, 1.4, -0.2]} castShadow rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 1.25, -0.1]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Reception Plant */}
        <Plant position={[1.5, 1.25, 0]} />
        <FilingCabinet position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Reception Waiting Area */}
      <Rug position={[-5, 0.015, 11]} rotation={[-Math.PI/2, 0, 0]} color="#fecdd3" width={4} isCircle={true} />
      <Armchair position={[-4, 0, 10]} rotation={[0, Math.PI / 4, 0]} color="#f43f5e" />
      <Armchair position={[-6, 0, 12]} rotation={[0, Math.PI / 2, 0]} color="#f43f5e" />
      <mesh position={[-5, 0.4, 11]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[-5, 0.2, 11]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <Plant position={[-5, 0.42, 11]} />

      {/* Decorative Plants */}
      <Plant position={[-14, 0, -14]} />
      <Plant position={[14, 0, -14]} />
      <Plant position={[14, 0, 14]} />
      <Plant position={[-14, 0, 14]} />
      <Plant position={[-4, 0, -13]} />
      <Plant position={[8, 0, 4]} />
      <group position={[6, 0, -8]}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow><boxGeometry args={[3, 0.05, 1.5]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-1.4, 0.375, -0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[1.4, 0.375, -0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[-1.4, 0.375, 0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[1.4, 0.375, 0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0, 1, -0.3]} castShadow><boxGeometry args={[0.8, 0.5, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 0.8, -0.3]} castShadow><cylinderGeometry args={[0.05, 0.1, 0.4]} /><meshStandardMaterial color="#94a3b8" /></mesh>
        <Computer position={[0, 0.775, 0]} rotation={[0, 0, 0]} />
        
        <group position={[0, 0, 1.5]}>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.6, 0.1, 0.6]} /><meshStandardMaterial color="#3b82f6" /></mesh>
          <mesh position={[0, 1, 0.25]} castShadow><boxGeometry args={[0.6, 0.8, 0.1]} /><meshStandardMaterial color="#3b82f6" /></mesh>
          <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.5]} /><meshStandardMaterial color="#333" /></mesh>
          
          {/* Invisible Interaction Mesh */}
          <mesh position={[0, 1, 0]} onPointerDown={(e) => handleInteract(e, [6, 0, -6.5], 'sit_work', currentTask === 'find_desk' ? 'working' : undefined, currentTask === 'write_email' ? 'email' : 'none')}>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {(currentTask === 'find_desk' || currentTask === 'write_email') && <Indicator position={[0, 2.5, 0]} />}
          {(nearby === 'desk1' || nearby === 'desk1_email') && (
            <Html position={[0, 2, 0]} center>
              <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap animate-bounce">
                {currentTask === 'find_desk' ? 'Sit at desk (Click or Space)' : 'Write email (Click or Space)'}
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* Desk 2 (Decorative) */}
      <group position={[12, 0, -8]}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow><boxGeometry args={[3, 0.05, 1.5]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-1.4, 0.375, -0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[1.4, 0.375, -0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[-1.4, 0.375, 0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[1.4, 0.375, 0.6]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.75]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0, 1, -0.3]} castShadow><boxGeometry args={[0.8, 0.5, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
        <mesh position={[0, 0.8, -0.3]} castShadow><cylinderGeometry args={[0.05, 0.1, 0.4]} /><meshStandardMaterial color="#94a3b8" /></mesh>
        <Computer position={[0, 0.775, 0]} rotation={[0, 0, 0]} />
        
        <group position={[0, 0, 1.5]}>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.6, 0.1, 0.6]} /><meshStandardMaterial color="#ef4444" /></mesh>
          <mesh position={[0, 1, 0.25]} castShadow><boxGeometry args={[0.6, 0.8, 0.1]} /><meshStandardMaterial color="#ef4444" /></mesh>
          <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.5]} /><meshStandardMaterial color="#333" /></mesh>
        </group>
      </group>

      {/* --- KITCHEN AREA (Left Side x < 0) --- */}
      <group position={[-8, 0, -13]}>
        {/* Kitchen Tile Floor */}
        <mesh position={[0, 0.01, 2]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial map={tileTexture} roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Kitchen Counter */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 1, 2]} />
          <meshStandardMaterial color="#f87171" />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.2, 0.05, 2.2]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>

        {/* Upper Cabinets */}
        <mesh position={[1.5, 3, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[5, 1.2, 1]} />
          <meshStandardMaterial color="#f87171" />
        </mesh>
        <mesh position={[1.5, 3, 0.01]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 1.1, 0.05]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        {/* Cabinet Handles */}
        <mesh position={[0.5, 2.8, 0.05]}><boxGeometry args={[0.05, 0.3, 0.05]} /><meshStandardMaterial color="#94a3b8" /></mesh>
        <mesh position={[2.5, 2.8, 0.05]}><boxGeometry args={[0.05, 0.3, 0.05]} /><meshStandardMaterial color="#94a3b8" /></mesh>
        
        {/* Fridge */}
        <mesh position={[-3, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 3, 1.8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Microwave */}
        <mesh position={[-0.5, 1.3, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Coffee Machine */}
        <group position={[2, 1.25, 0]}>
          <mesh castShadow><boxGeometry args={[0.8, 0.6, 0.6]} /><meshStandardMaterial color="#111827" /></mesh>
          <mesh position={[0, 0.4, -0.1]} castShadow><boxGeometry args={[0.8, 0.2, 0.4]} /><meshStandardMaterial color="#374151" /></mesh>
          <mesh position={[0, 0.1, 0.1]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.3]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
          
          {/* Invisible Interaction Mesh */}
          <mesh position={[0, 0, 1]} onPointerDown={(e) => handleInteract(e, [-6, 0, -11], 'make_coffee', undefined, 'coffee')}>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {currentTask === 'make_coffee' && <Indicator position={[0, 1.5, 0]} />}
          {nearby === 'coffee' && (
            <Html position={[0, 1.5, 0]} center>
              <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap animate-bounce">
                Make coffee (Click or Space)
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* Meeting Room */}
      <group position={[12, 0, 4]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#fce7f3" />
        </mesh>
        {/* Table */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow><boxGeometry args={[4, 0.1, 2]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-1.8, 0.35, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.7]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[1.8, 0.35, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.7]} /><meshStandardMaterial color="#333" /></mesh>
        {/* Chairs */}
        <Armchair position={[-1, 0, 1.5]} rotation={[0, 0, 0]} color="#3b82f6" />
        <Armchair position={[1, 0, 1.5]} rotation={[0, 0, 0]} color="#3b82f6" />
        <Armchair position={[-1, 0, -1.5]} rotation={[0, Math.PI, 0]} color="#3b82f6" />
        <Armchair position={[1, 0, -1.5]} rotation={[0, Math.PI, 0]} color="#3b82f6" />
        
        <Whiteboard position={[0, 0, -2.5]} rotation={[0, 0, 0]} />
        <Painting position={[3.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} color="#38bdf8" width={2} height={1.5} />
        <Plant position={[3, 0, -2.5]} />
        <Plant position={[-3, 0, 2.5]} />
        
        {/* Invisible Interaction Mesh */}
        <mesh position={[0, 1, 1.5]} onPointerDown={(e) => handleInteract(e, [12, 0, 5.5], 'sit_work', currentTask === 'meeting' ? 'meeting_active' : undefined, 'none')}>
          <boxGeometry args={[4, 2, 4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {currentTask === 'meeting' && <Indicator position={[0, 2.5, 1.5]} />}
        {nearby === 'meeting' && (
          <Html position={[0, 2, 1.5]} center>
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap animate-bounce">
              Attend meeting (Click or Space)
            </div>
          </Html>
        )}
      </group>

      {/* IT Room */}
      <group position={[-10, 0, 6]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Server Rack */}
        <mesh position={[0, 1.5, -2]} castShadow receiveShadow><boxGeometry args={[2, 3, 1]} /><meshStandardMaterial color="#0f172a" metalness={0.8} /></mesh>
        {/* Blinking lights */}
        <mesh position={[-0.5, 2.5, -1.45]}><boxGeometry args={[0.1, 0.05, 0.05]} /><meshStandardMaterial color="#22c55e" emissive="#22c55e" /></mesh>
        <mesh position={[0, 2.5, -1.45]}><boxGeometry args={[0.1, 0.05, 0.05]} /><meshStandardMaterial color="#ef4444" emissive="#ef4444" /></mesh>
        <mesh position={[0.5, 2.0, -1.45]}><boxGeometry args={[0.1, 0.05, 0.05]} /><meshStandardMaterial color="#3b82f6" emissive="#3b82f6" /></mesh>
        
        {/* Invisible Interaction Mesh */}
        <mesh position={[0, 1.5, -1.5]} onPointerDown={(e) => handleInteract(e, [-10, 0, 4.5], 'make_coffee', undefined, 'it')}>
          <boxGeometry args={[3, 3, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {currentTask === 'it_room' && <Indicator position={[0, 3.5, -1.5]} />}
        {nearby === 'it_room' && (
          <Html position={[0, 3, -1.5]} center>
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap animate-bounce">
              Reboot server (Click or Space)
            </div>
          </Html>
        )}
      </group>

      {/* Printer Area */}
      <group position={[0, 0, -5]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow><boxGeometry args={[1.5, 0.8, 1]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow><boxGeometry args={[1.2, 0.4, 0.8]} /><meshStandardMaterial color="#f8fafc" /></mesh>
        <mesh position={[0, 1.1, 0.2]} castShadow rotation={[0.2, 0, 0]}><boxGeometry args={[0.8, 0.05, 0.6]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
        
        {/* Invisible Interaction Mesh */}
        <mesh position={[0, 1, 0]} onPointerDown={(e) => handleInteract(e, [0, 0, -4], 'make_coffee', undefined, 'printer')}>
          <boxGeometry args={[2, 2, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {currentTask === 'print_document' && <Indicator position={[0, 2, 0]} />}
        {nearby === 'printer' && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap animate-bounce">
              Print document (Click or Space)
            </div>
          </Html>
        )}
      </group>

      {/* Lighting */}
      <SoftShadows size={15} samples={16} focus={0.5} />
      <ambientLight intensity={0.3} color="#f8fafc" />
      <hemisphereLight args={['#e0f2fe', '#fbbf24', 0.4]} />
      
      {/* Main Sun Light */}
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.5}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30, 0.1, 100]} />
      </directionalLight>

      {/* Localized Area Lights */}
      {/* Reception Warm Light */}
      <pointLight position={[0, 4, 12]} intensity={0.8} color="#fef08a" distance={15} castShadow />
      
      {/* Lounge Cozy Light */}
      <pointLight position={[-6, 3, -2]} intensity={0.6} color="#fdba74" distance={12} castShadow />
      
      {/* Kitchen Bright Light */}
      <pointLight position={[-6, 4, -12]} intensity={0.7} color="#f8fafc" distance={15} />
      
      {/* IT Room Cool Light */}
      <pointLight position={[-10, 3, 6]} intensity={0.9} color="#38bdf8" distance={10} castShadow />
      
      {/* Meeting Room Focused Light */}
      <pointLight position={[12, 4, 4]} intensity={0.8} color="#fef08a" distance={15} castShadow />
      
      {/* Desk Area Neutral Light */}
      <pointLight position={[6, 4, -8]} intensity={0.6} color="#f8fafc" distance={15} castShadow />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={50} blur={2.5} far={4} color="#1e293b" />
    </group>
  );
}
