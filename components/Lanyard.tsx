'use client';

import React, { useRef, useState, useEffect, useMemo, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Fallback HTML card if WebGL context or R3F Canvas encounters an issue
function LanyardFallbackHTML() {
  return (
    <div className="relative w-full max-w-xs h-[480px] flex flex-col items-center justify-center p-4">
      {/* Red Ribbon Strap */}
      <div className="w-10 h-32 bg-gradient-to-b from-[#B91C1C] via-[#DC2626] to-[#EF4444] rounded-t-md shadow-md flex items-center justify-center overflow-hidden border border-white/20">
        <span className="text-[10px] font-black text-white uppercase tracking-widest -rotate-90 whitespace-nowrap">
          BRIMAS PRADIKA • AI DEVELOPER
        </span>
      </div>
      {/* Carabiner Ring */}
      <div className="w-6 h-6 rounded-full border-4 border-zinc-700 bg-zinc-900 -mt-2 z-10 shadow-inner" />
      {/* ID Card */}
      <div className="w-64 h-80 bg-zinc-900 border-2 border-white/20 rounded-2xl p-4 flex flex-col items-center justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden -mt-2">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-zinc-800 rounded-full" />
        <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/10 mt-3">
          <img
            src="/images/avatar.webp"
            alt="Brimas Pradika Utama"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/avatar.png';
            }}
          />
        </div>
        <div className="text-center w-full pb-2">
          <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
            BRIMAS PRADIKA
          </h3>
          <p className="text-[11px] font-mono text-[#DC2626] uppercase font-bold tracking-widest mt-0.5">
            AI SYSTEMS DEVELOPER
          </p>
        </div>
      </div>
    </div>
  );
}

// React Error Boundary for 3D Canvas
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: any) {
    console.warn("Lanyard 3D Canvas error caught:", err);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3D Front Avatar Photo Plane
function CardFrontPhoto() {
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
    return (
      <mesh position={[0, -0.08, 0.052]}>
        <planeGeometry args={[1.85, 2.55]} />
        <meshStandardMaterial color="#222222" roughness={0.4} />
      </mesh>
    );
  }

  return (
    <mesh position={[0, -0.08, 0.052]}>
      <planeGeometry args={[1.85, 2.55]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

// Dynamic Strap Ribbon Mesh
function BandRibbon({ cardPos }: { cardPos: THREE.Vector3 }) {
  const strapTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(0, 0, 128, 512);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.save();
      ctx.translate(64, 140);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('BRIMAS PRADIKA', 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(64, 370);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('AI DEVELOPER', 0, 0);
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const numSamples = 24;
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

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 2.3, 0),
          new THREE.Vector3(0, 1.4, 0.1),
          new THREE.Vector3(0, 0.5, 0.15),
          new THREE.Vector3(0, -0.4, 0),
        ],
        false,
        'catmullrom',
        0.5
      ),
    []
  );

  useFrame(() => {
    curve.points[0].set(0, 2.3, 0);
    curve.points[1].set(cardPos.x * 0.4, 1.4, Math.abs(cardPos.x) * 0.2 + 0.1);
    curve.points[2].set(cardPos.x * 0.7, 0.5 + cardPos.y * 0.3, Math.abs(cardPos.x) * 0.3 + 0.15);
    curve.points[3].set(cardPos.x, cardPos.y + 1.45, cardPos.z + 0.05);

    const curvePoints = curve.getPoints(numSamples - 1);
    const positionsAttr = ribbonGeo.attributes.position;
    const posArray = positionsAttr.array as Float32Array;
    const strapWidth = 0.13;
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
    <mesh geometry={ribbonGeo}>
      <meshStandardMaterial
        map={strapTexture || undefined}
        color="#DC2626"
        roughness={0.35}
        metalness={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 3D Lanyard Interactive Card Content Component
function LanyardCard3D() {
  const cardGroup = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Motion dynamics state
  const targetPos = useRef(new THREE.Vector3(0, -0.6, 0));
  const currentPos = useRef(new THREE.Vector3(0, -0.6, 0));
  const velocityPos = useRef(new THREE.Vector3(0, 0, 0));

  const targetRot = useRef(new THREE.Euler(0, 0, 0));
  const currentRot = useRef(new THREE.Euler(0, 0, 0));

  const pointerOffset = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (!cardGroup.current) return;

    if (isDragging) {
      const mouseX = (state.pointer.x * 2.8) - pointerOffset.current.x;
      const mouseY = (state.pointer.y * 2.2) - pointerOffset.current.y;
      targetPos.current.set(mouseX, mouseY, 0.4);
      targetRot.current.set(
        -state.pointer.y * 0.45,
        state.pointer.x * 0.65,
        -state.pointer.x * 0.35
      );
    } else {
      // Natural sway resting dynamics
      const t = state.clock.getElapsedTime();
      const swayX = Math.sin(t * 1.5) * 0.08;
      const swayY = Math.cos(t * 1.2) * 0.04 - 0.6;
      targetPos.current.set(swayX, swayY, 0);
      targetRot.current.set(
        Math.sin(t * 1.2) * 0.05,
        Math.cos(t * 1.5) * 0.08,
        Math.sin(t * 1.8) * 0.04
      );
    }

    // Spring physics integration
    const stiffness = isDragging ? 25 : 12;
    const damping = isDragging ? 0.75 : 0.82;

    const forceX = (targetPos.current.x - currentPos.current.x) * stiffness;
    const forceY = (targetPos.current.y - currentPos.current.y) * stiffness;
    const forceZ = (targetPos.current.z - currentPos.current.z) * stiffness;

    velocityPos.current.x = (velocityPos.current.x + forceX * delta) * damping;
    velocityPos.current.y = (velocityPos.current.y + forceY * delta) * damping;
    velocityPos.current.z = (velocityPos.current.z + forceZ * delta) * damping;

    currentPos.current.x += velocityPos.current.x * delta;
    currentPos.current.y += velocityPos.current.y * delta;
    currentPos.current.z += velocityPos.current.z * delta;

    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 8 * delta;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 8 * delta;
    currentRot.current.z += (targetRot.current.z - currentRot.current.z) * 8 * delta;

    cardGroup.current.position.copy(currentPos.current);
    cardGroup.current.rotation.copy(currentRot.current);
  });

  return (
    <>
      <BandRibbon cardPos={currentPos.current} />

      {/* Anchor Ring at Ceiling */}
      <group position={[0, 2.3, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.32, 0.1, 0.14]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.018, 16, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Main Interactive 3D Card */}
      <group
        ref={cardGroup}
        position={[0, -0.6, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setIsDragging(true);
          pointerOffset.current.set(
            (e.pointer.x * 2.8) - currentPos.current.x,
            (e.pointer.y * 2.2) - currentPos.current.y
          );
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
          setIsDragging(false);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => {
          setHovered(false);
          setIsDragging(false);
        }}
      >
        {/* Carabiner Clip Top Joint */}
        <group position={[0, 1.45, 0.02]}>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.02, 16, 32]} />
            <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.03, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.02, 16, 32]} />
            <meshStandardMaterial color="#222222" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* Clean Rounded ID Card Body */}
        <RoundedBox args={[2.05, 2.95, 0.07]} radius={0.14} smoothness={4}>
          <meshStandardMaterial
            color={hovered ? '#ffffff' : '#f5f5f5'}
            roughness={0.25}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Lanyard Hole */}
        <mesh position={[0, 1.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>

        {/* Front Avatar Photo */}
        <CardFrontPhoto />

        {/* Card Back Plate */}
        <mesh position={[0, 0, -0.038]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.95, 2.85]} />
          <meshStandardMaterial color="#e5e5e5" roughness={0.3} />
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
    return <LanyardFallbackHTML />;
  }

  return (
    <CanvasErrorBoundary fallback={<LanyardFallbackHTML />}>
      <div className="w-full h-[520px] sm:h-[580px] relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none overflow-visible">
        <Canvas
          camera={{ position: [0, -0.2, 7.5], fov: 42 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow />
          <directionalLight position={[-5, -4, -2]} intensity={0.8} />
          <pointLight position={[0, 3, 2]} intensity={1.0} color="#FFFFFF" />

          <LanyardCard3D />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
