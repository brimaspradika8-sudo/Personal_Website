'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function CardPhoto() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();

    loader.load(
      '/images/avatar.webp',
      (tex) => {
        if (isMounted) {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
          setTexture(tex);
        }
      },
      undefined,
      () => {
        // Fallback to avatar.png if webp load fails
        loader.load(
          '/images/avatar.png',
          (texPng) => {
            if (isMounted) {
              texPng.colorSpace = THREE.SRGBColorSpace;
              texPng.needsUpdate = true;
              setTexture(texPng);
            }
          },
          undefined,
          (err) => {
            console.warn('Could not load card avatar photo:', err);
          }
        );
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  if (!texture) {
    return <PhotoFallback />;
  }

  return (
    <mesh position={[0, -0.06, 0.052]}>
      <planeGeometry args={[1.94, 2.68]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function PhotoFallback() {
  return (
    <mesh position={[0, -0.06, 0.052]}>
      <planeGeometry args={[1.94, 2.68]} />
      <meshStandardMaterial color="#333333" roughness={0.4} />
    </mesh>
  );
}

function LanyardPhysics() {
  // 6 Verlet nodes (0: Top Mount, 1..4: Rope, 5: Top Clip of Card)
  // Compact, shortened rope layout
  const nodes = useRef([
    { pos: new THREE.Vector3(0, 2.2, 0), oldPos: new THREE.Vector3(0, 2.2, 0) },
    { pos: new THREE.Vector3(0, 1.7, 0), oldPos: new THREE.Vector3(0, 1.7, 0) },
    { pos: new THREE.Vector3(0, 1.2, 0), oldPos: new THREE.Vector3(0, 1.2, 0) },
    { pos: new THREE.Vector3(0, 0.7, 0), oldPos: new THREE.Vector3(0, 0.7, 0) },
    { pos: new THREE.Vector3(0, 0.2, 0), oldPos: new THREE.Vector3(0, 0.2, 0) },
    { pos: new THREE.Vector3(0, -0.3, 0), oldPos: new THREE.Vector3(0, -0.3, 0) },
  ]);

  // Shortened segment lengths (5 * 0.42 = 2.10 total rope length)
  const segmentLengths = [0.42, 0.42, 0.42, 0.42, 0.42];

  const cardGroupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const dragTarget = useRef(new THREE.Vector3(0, -0.3, 0));
  const cardRotation = useRef(new THREE.Euler(0, 0, 0));
  const [hovered, setHovered] = useState(false);

  // Yellow fabric strap texture with repeating black "BRIMAS PRADIKA" text
  const strapTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Yellow fabric background
      ctx.fillStyle = '#F5B301';
      ctx.fillRect(0, 0, 128, 512);

      // Black bold repeating text
      ctx.fillStyle = '#000000';
      ctx.font = '900 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.save();
      ctx.translate(64, 128);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('BRIMAS PRADIKA', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(64, 384);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('BRIMAS PRADIKA', 0, 0);
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // 40-point CatmullRom curve for ribbon strap construction
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        nodes.current.map((n) => n.pos),
        false,
        'catmullrom',
        0.5
      ),
    []
  );

  const numSamples = 40;
  const ribbonGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(numSamples * 2 * 3);
    const uvs = new Float32Array(numSamples * 2 * 2);
    const indices = new Uint16Array((numSamples - 1) * 6);

    for (let i = 0; i < numSamples - 1; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;

      indices[i * 6] = a;
      indices[i * 6 + 1] = b;
      indices[i * 6 + 2] = c;

      indices[i * 6 + 3] = b;
      indices[i * 6 + 4] = d;
      indices[i * 6 + 5] = c;
    }

    for (let i = 0; i < numSamples; i++) {
      const v = i / (numSamples - 1);
      uvs[i * 4] = 0;
      uvs[i * 4 + 1] = v * 2;
      uvs[i * 4 + 2] = 1;
      uvs[i * 4 + 3] = v * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.03);
    const n = nodes.current;
    const time = state.clock.getElapsedTime();

    // 1. Subtle idle sway force
    const idleSwayX = Math.sin(time * 1.4) * 0.05 + Math.cos(time * 2.2) * 0.02;
    const idleSwayZ = Math.sin(time * 1.8) * 0.03;

    // 2. Mouse/touch drag calculation
    if (isDragging.current) {
      const targetX = (state.pointer.x * state.viewport.width) / 2;
      const targetY = (state.pointer.y * state.viewport.height) / 2 + 0.5;
      dragTarget.current.set(
        Math.max(-2.5, Math.min(2.5, targetX)),
        Math.max(-1.8, Math.min(1.5, targetY)),
        0
      );

      n[5].oldPos.copy(n[5].pos);
      n[5].pos.copy(dragTarget.current);
    } else {
      n[5].pos.x += idleSwayX * dt * 0.5;
      n[5].pos.z += idleSwayZ * dt * 0.5;
      n[4].pos.x += idleSwayX * dt * 0.4;
      n[3].pos.x += idleSwayX * dt * 0.3;
    }

    // 3. Verlet physics simulation
    const gravity = new THREE.Vector3(0, -22, 0);
    const damping = 0.95;

    for (let i = 1; i < n.length; i++) {
      if (i === 5 && isDragging.current) continue;

      const vel = new THREE.Vector3().subVectors(n[i].pos, n[i].oldPos).multiplyScalar(damping);
      n[i].oldPos.copy(n[i].pos);
      n[i].pos.add(vel).addScaledVector(gravity, dt * dt);
    }

    // 4. Distance constraints relaxation
    const iterations = 10;
    for (let iter = 0; iter < iterations; iter++) {
      n[0].pos.set(0, 2.2, 0); // Fixed top anchor mount

      for (let i = 0; i < n.length - 1; i++) {
        const pA = n[i].pos;
        const pB = n[i + 1].pos;
        const dist = pA.distanceTo(pB);
        const targetLen = segmentLengths[i];
        if (dist === 0) continue;

        const diff = (dist - targetLen) / dist;
        const correction = new THREE.Vector3().subVectors(pB, pA).multiplyScalar(diff * 0.5);

        if (i === 0) {
          pB.sub(correction.multiplyScalar(2));
        } else if (i + 1 === 5 && isDragging.current) {
          pA.add(correction.multiplyScalar(2));
        } else {
          pA.add(correction);
          pB.sub(correction);
        }
      }
    }

    // 5. Update Card Group position & constrained rotation
    if (cardGroupRef.current) {
      cardGroupRef.current.position.set(n[5].pos.x, n[5].pos.y - 1.45, n[5].pos.z);

      const dir = new THREE.Vector3().subVectors(n[5].pos, n[4].pos).normalize();
      const targetAngleZ = Math.max(-0.2, Math.min(0.2, Math.atan2(-dir.x, -dir.y)));
      const targetAngleX = Math.max(-0.2, Math.min(0.2, (n[5].pos.z - n[4].pos.z) * 0.3));

      // Damped rotational alignment (card stays upright facing camera)
      cardRotation.current.z += (targetAngleZ - cardRotation.current.z) * 0.1;
      cardRotation.current.x += (targetAngleX - cardRotation.current.x) * 0.1;
      cardRotation.current.y += (0 - cardRotation.current.y) * 0.1;

      cardGroupRef.current.rotation.copy(cardRotation.current);
    }

    // 6. Recompute Ribbon Mesh Geometry positions
    for (let i = 0; i < n.length; i++) {
      curve.points[i].copy(n[i].pos);
    }

    const curvePoints = curve.getPoints(numSamples - 1);
    const positionsAttr = ribbonGeo.attributes.position;
    const posArray = positionsAttr.array as Float32Array;
    const strapWidth = 0.12;
    const camDir = new THREE.Vector3(0, 0, 1);

    for (let i = 0; i < curvePoints.length; i++) {
      const p = curvePoints[i];
      let tangent = new THREE.Vector3();
      if (i < curvePoints.length - 1) {
        tangent.subVectors(curvePoints[i + 1], p).normalize();
      } else {
        tangent.subVectors(p, curvePoints[i - 1]).normalize();
      }

      const normal = new THREE.Vector3().crossVectors(tangent, camDir).normalize();
      if (normal.lengthSq() < 0.001) normal.set(1, 0, 0);

      const halfW = strapWidth / 2;
      posArray[i * 6] = p.x + normal.x * halfW;
      posArray[i * 6 + 1] = p.y + normal.y * halfW;
      posArray[i * 6 + 2] = p.z + normal.z * halfW;

      posArray[i * 6 + 3] = p.x - normal.x * halfW;
      posArray[i * 6 + 4] = p.y - normal.y * halfW;
      posArray[i * 6 + 5] = p.z - normal.z * halfW;
    }

    positionsAttr.needsUpdate = true;
    ribbonGeo.computeVertexNormals();
  });

  return (
    <>
      {/* --- TOP CEILING MOUNT BRACKET --- */}
      <group position={[0, 2.2, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.14]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.018, 16, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* --- SPIDER-MAN CRIMSON FABRIC RIBBON STRAP --- */}
      <mesh geometry={ribbonGeo}>
        <meshStandardMaterial
          map={strapTexture || undefined}
          color="#DC2626"
          roughness={0.35}
          metalness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* --- CARD GROUP (Center is at n[5].pos - [0, 1.45, 0]) --- */}
      <group
        ref={cardGroupRef}
        position={[0, -2.15, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          isDragging.current = true;
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
          isDragging.current = false;
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* --- CARABINER CLIP AT TOP EDGE OF CARD (y = +1.45) --- */}
        <group position={[0, 1.45, 0.02]}>
          {/* Top Swivel Ring */}
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.02, 16, 32]} />
            <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Barrel Joint */}
          <mesh position={[0, -0.03, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Metal Hook Clip through Hole */}
          <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.02, 16, 32]} />
            <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* --- CLEAN WHITE PLASTIC CARD CASING --- */}
        <RoundedBox args={[2.1, 3.0, 0.07]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={hovered ? '#ffffff' : '#f4f4f4'}
            roughness={0.25}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Top Hole in Card */}
        <mesh position={[0, 1.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>

        {/* Inner Portrait Photo */}
        <Suspense fallback={<PhotoFallback />}>
          <CardPhoto />
        </Suspense>

        {/* Back Plate */}
        <mesh position={[0, 0, -0.038]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.0, 2.9]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}

export default function Lanyard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#DC2626] animate-pulse min-h-[520px]">
        Loading 3D Card...
      </div>
    );
  }

  return (
    <div className="w-full h-[520px] sm:h-[580px] relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none overflow-visible">
      <Canvas
        camera={{ position: [0, -0.4, 8.2], fov: 42 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
        <directionalLight position={[-5, -4, -2]} intensity={0.8} />
        <pointLight position={[0, 3, 2]} intensity={1.0} color="#FFFFFF" />
        <LanyardPhysics />
      </Canvas>
    </div>
  );
}
