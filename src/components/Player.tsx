import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Player as PlayerType, useGameStore } from '../store';

interface PlayerProps {
  player: PlayerType;
  isMe: boolean;
}

export function Player({ player, isMe }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  const targetPosition = useRef(new THREE.Vector3(...player.position));
  const currentPosition = useRef(new THREE.Vector3(...player.position));
  const isMoving = useRef(false);

  const keys = useRef<{ [key: string]: boolean }>({});
  const lastEmitTime = useRef(0);
  const autoMoveTarget = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!isMe) return;
    const onKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [isMe]);

  useEffect(() => {
    if (player.target) {
      targetPosition.current.set(...player.target);
      if (isMe) autoMoveTarget.current = new THREE.Vector3(...player.target);
    }
  }, [player.target, isMe]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Movement Logic
    if (isMe) {
      const k = keys.current;
      let dx = 0; let dz = 0;
      if (k['w'] || k['arrowup']) dz -= 1;
      if (k['s'] || k['arrowdown']) dz += 1;
      if (k['a'] || k['arrowleft']) dx -= 1;
      if (k['d'] || k['arrowright']) dx += 1;

      if (dx !== 0 || dz !== 0) {
        autoMoveTarget.current = null; // Cancel auto-move

        if (player.action !== 'walking') {
          useGameStore.getState().setAction('walking');
          (window as any).pendingInteraction = null;
        }

        const moveDir = new THREE.Vector3(dx, 0, dz).normalize();
        moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);

        const speed = 6 * delta;
        currentPosition.current.addScaledVector(moveDir, speed);
        groupRef.current.position.copy(currentPosition.current);

        const targetRotation = Math.atan2(moveDir.x, moveDir.z);
        let currentRotation = groupRef.current.rotation.y;
        let diff = targetRotation - currentRotation;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        groupRef.current.rotation.y += diff * 10 * delta;

        isMoving.current = true;

        if (time - lastEmitTime.current > 0.1) {
          const socket = useGameStore.getState().socket;
          if (socket) socket.emit('move', [currentPosition.current.x, 0, currentPosition.current.z]);
          lastEmitTime.current = time;
        }
      } else if (autoMoveTarget.current) {
        const distance = currentPosition.current.distanceTo(autoMoveTarget.current);
        if (distance > 0.1) {
          const speed = 6 * delta;
          const direction = new THREE.Vector3().subVectors(autoMoveTarget.current, currentPosition.current).normalize();
          currentPosition.current.addScaledVector(direction, Math.min(speed, distance));
          groupRef.current.position.copy(currentPosition.current);

          const targetRotation = Math.atan2(direction.x, direction.z);
          let currentRotation = groupRef.current.rotation.y;
          let diff = targetRotation - currentRotation;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          groupRef.current.rotation.y += diff * 10 * delta;

          isMoving.current = true;
          if (time - lastEmitTime.current > 0.1) {
            const socket = useGameStore.getState().socket;
            if (socket) socket.emit('move', [currentPosition.current.x, 0, currentPosition.current.z]);
            lastEmitTime.current = time;
          }
        } else {
          autoMoveTarget.current = null;
          isMoving.current = false;
          const pending = (window as any).pendingInteraction;
          if (pending) {
            useGameStore.getState().setAction(pending.action);
            if (pending.nextTask) useGameStore.getState().setTask(pending.nextTask);
            if (pending.ui && pending.ui !== 'none') useGameStore.getState().setUiState(pending.ui);
            (window as any).pendingInteraction = null;
          } else {
            useGameStore.getState().setAction('idle');
          }
          const socket = useGameStore.getState().socket;
          if (socket) socket.emit('move', [currentPosition.current.x, 0, currentPosition.current.z]);
        }
      } else {
        if (isMoving.current) {
          isMoving.current = false;
          useGameStore.getState().setAction('idle');
          const socket = useGameStore.getState().socket;
          if (socket) socket.emit('move', [currentPosition.current.x, 0, currentPosition.current.z]);
        }
      }
    } else {
      // Remote player interpolation
      if (player.target) {
        const distance = currentPosition.current.distanceTo(targetPosition.current);
        if (distance > 0.1) {
          isMoving.current = true;
          const speed = 6 * delta;
          const direction = new THREE.Vector3().subVectors(targetPosition.current, currentPosition.current).normalize();
          currentPosition.current.addScaledVector(direction, Math.min(speed, distance));
          groupRef.current.position.copy(currentPosition.current);

          const targetRotation = Math.atan2(direction.x, direction.z);
          let currentRotation = groupRef.current.rotation.y;
          let diff = targetRotation - currentRotation;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          groupRef.current.rotation.y += diff * 10 * delta;
        } else {
          isMoving.current = false;
        }
      }
    }

    // Animation Logic
    const action = player.action;

    let targetBodyY = 1.2;
    let targetLeftArmX = 0;
    let targetRightArmX = 0;
    let targetRightArmZ = 0;
    let targetLeftLegX = 0;
    let targetRightLegX = 0;
    let targetHeadX = 0;

    if (action === 'walking' || isMoving.current) {
      const swing = Math.sin(time * 10);
      targetLeftArmX = swing * 0.8;
      targetRightArmX = -swing * 0.8;
      targetLeftLegX = -swing * 0.8;
      targetRightLegX = swing * 0.8;
      targetBodyY = 1.2 + Math.abs(Math.sin(time * 10)) * 0.05;
    } else if (action === 'dance') {
      targetBodyY = 1.2 + Math.abs(Math.sin(time * 8)) * 0.2;
      targetLeftArmX = Math.sin(time * 12) * 2;
      targetRightArmX = Math.cos(time * 12) * 2;
      targetLeftLegX = Math.sin(time * 8) * 0.5;
      targetRightLegX = -Math.sin(time * 8) * 0.5;
      groupRef.current.rotation.y += 0.05;
    } else if (action === 'wave') {
      targetRightArmX = Math.PI;
      targetRightArmZ = Math.sin(time * 10) * 0.5;
    } else if (action === 'sit_work' || action === 'watch_tv' || action === 'sleep') {
      targetBodyY = 0.7;
      targetLeftLegX = -Math.PI / 2;
      targetRightLegX = -Math.PI / 2;
      if (action === 'sit_work') {
        targetLeftArmX = -Math.PI / 4 + Math.sin(time * 20) * 0.05;
        targetRightArmX = -Math.PI / 4 + Math.cos(time * 20) * 0.05;
        targetHeadX = Math.sin(time * 2) * 0.05;
      }
    } else if (action === 'make_coffee') {
      targetRightArmX = -Math.PI / 2 + Math.sin(time * 5) * 0.1;
    } else {
      // Idle
      targetBodyY = 1.2 + Math.sin(time * 2) * 0.02;
    }

    // Smoothly interpolate rotations and positions
    const lerpFactor = 0.15;
    if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeftArmX, lerpFactor);
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightArmX, lerpFactor);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRightArmZ, lerpFactor);
    }
    if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, targetLeftLegX, lerpFactor);
    if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, targetRightLegX, lerpFactor);
    if (bodyRef.current) bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, targetBodyY, lerpFactor);
    if (headRef.current) headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadX, lerpFactor);
  });

  const plumbobRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (plumbobRef.current) {
      plumbobRef.current.rotation.y += 0.05;
      plumbobRef.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const skinColor = "#fcdcb4";
  const pantsColor = "#334155";

  return (
    <group ref={groupRef} position={player.position}>
      {isMe && (
        <mesh ref={plumbobRef} position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
        </mesh>
      )}
      
      {player.message && (
        <Html position={[0, 4, 0]} center>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-slate-200 text-slate-800 font-medium whitespace-nowrap relative">
            {player.message}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent drop-shadow-md"></div>
          </div>
        </Html>
      )}

      {/* Shadow Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color={player.color} transparent opacity={0.6} />
      </mesh>

      {/* Human Model */}
      <group ref={bodyRef} position={[0, 1.2, 0]}>
        {/* Torso */}
        <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.7, 0.3]} />
          <meshStandardMaterial color={player.color} />
        </mesh>
        
        {/* Head */}
        <mesh ref={headRef} castShadow receiveShadow position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.35, 0.45, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6]} />
            <meshStandardMaterial color={player.color} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.65, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.35, 0.45, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6]} />
            <meshStandardMaterial color={player.color} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.65, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.15, -0.15, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.85, 0.05]}>
            <boxGeometry args={[0.12, 0.1, 0.25]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.15, -0.15, 0]}>
          <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.85, 0.05]}>
            <boxGeometry args={[0.12, 0.1, 0.25]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
