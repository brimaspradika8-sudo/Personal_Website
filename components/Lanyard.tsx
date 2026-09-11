'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  BallCollider,
  CuboidCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';

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

function BandRibbon({
  nodes,
}: {
  nodes: React.RefObject<(THREE.Vector3 | null)[]>;
}) {
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
      ctx.font = '900 22px system-ui, -apple-system, sans-serif';
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
      ctx.fillText('AI DEVELOPER', 0, 0);
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const numSamples = 32;
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
        Array.from({ length: 6 }, () => new THREE.Vector3()),
        false,
        'catmullrom',
        0.5
      ),
    []
  );

  useFrame(() => {
    const pts = nodes.current;
    if (!pts || !pts[0]) return;

    for (let i = 0; i < 6; i++) {
      if (pts[i]) {
        curve.points[i].copy(pts[i]!);
      }
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

function ReactBitsLanyardContent() {
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const j4 = useRef<any>(null);
  const card = useRef<any>(null);

  const nodePositions = useRef<(THREE.Vector3 | null)[]>([
    new THREE.Vector3(0, 2.2, 0),
    new THREE.Vector3(0, 1.7, 0),
    new THREE.Vector3(0, 1.2, 0),
    new THREE.Vector3(0, 0.7, 0),
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(0, -0.3, 0),
  ]);

  // Joints connecting the physics rope segments
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.45]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.45]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.45]);
  useRopeJoint(j3, j4, [[0, 0, 0], [0, 0, 0], 0.45]);
  useSphericalJoint(j4, card, [[0, 0, 0], [0, 1.45, 0]]);

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    // Collect positions for Ribbon geometry
    if (fixed.current) {
      const p0 = fixed.current.translation();
      const p1 = j1.current?.translation();
      const p2 = j2.current?.translation();
      const p3 = j3.current?.translation();
      const p4 = j4.current?.translation();
      const p5 = card.current?.translation();

      nodePositions.current[0] = p0 ? new THREE.Vector3(p0.x, p0.y, p0.z) : null;
      nodePositions.current[1] = p1 ? new THREE.Vector3(p1.x, p1.y, p1.z) : null;
      nodePositions.current[2] = p2 ? new THREE.Vector3(p2.x, p2.y, p2.z) : null;
      nodePositions.current[3] = p3 ? new THREE.Vector3(p3.x, p3.y, p3.z) : null;
      nodePositions.current[4] = p4 ? new THREE.Vector3(p4.x, p4.y, p4.z) : null;
      nodePositions.current[5] = p5 ? new THREE.Vector3(p5.x, p5.y + 1.45, p5.z) : null;
    }

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, j4, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
  });

  return (
    <>
      <BandRibbon nodes={nodePositions} />

      {/* Anchor Point at Ceiling */}
      <RigidBody ref={fixed} type="fixed" position={[0, 2.2, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.14]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.018, 16, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
      </RigidBody>

      {/* Physics Rope Segments */}
      <RigidBody ref={j1} position={[0, 1.75, 0]} colliders={false} angularDamping={2} linearDamping={2}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={j2} position={[0, 1.3, 0]} colliders={false} angularDamping={2} linearDamping={2}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={j3} position={[0, 0.85, 0]} colliders={false} angularDamping={2} linearDamping={2}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={j4} position={[0, 0.4, 0]} colliders={false} angularDamping={2} linearDamping={2}>
        <BallCollider args={[0.1]} />
      </RigidBody>

      {/* Dynamic 3D Card Rigid Body */}
      <RigidBody
        ref={card}
        position={[0, -1.05, 0]}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        colliders={false}
        angularDamping={3.5}
        linearDamping={2.5}
      >
        <CuboidCollider args={[1.05, 1.5, 0.04]} />

        <group
          onPointerDown={(e) => {
            e.stopPropagation();
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            if (card.current) {
              const p = card.current.translation();
              const threeCamera = (e as any).camera;
              vec.set(e.pointer.x, e.pointer.y, 0.5).unproject(threeCamera);
              dir.copy(vec).sub(threeCamera.position).normalize();
              vec.add(dir.multiplyScalar(threeCamera.position.length()));
              setDragged(new THREE.Vector3(vec.x - p.x, vec.y - p.y, vec.z - p.z));
            }
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
            setDragged(false);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
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

          {/* Clean White Plastic Card Body */}
          <RoundedBox args={[2.05, 2.95, 0.07]} radius={0.14} smoothness={4}>
            <meshStandardMaterial
              color={hovered ? '#ffffff' : '#f5f5f5'}
              roughness={0.25}
              metalness={0.1}
            />
          </RoundedBox>

          {/* Top Lanyard Clip Hole */}
          <mesh position={[0, 1.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>

          {/* Inner Photo */}
          <Suspense fallback={null}>
            <CardFrontPhoto />
          </Suspense>

          {/* Back Plate */}
          <mesh position={[0, 0, -0.038]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.95, 2.85]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.3} />
          </mesh>
        </group>
      </RigidBody>
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
        Loading React Bits Lanyard 3D...
      </div>
    );
  }

  return (
    <div className="w-full h-[520px] sm:h-[580px] relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none overflow-visible">
      <Canvas
        camera={{ position: [0, -0.4, 8.0], fov: 42 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow />
        <directionalLight position={[-5, -4, -2]} intensity={0.8} />
        <pointLight position={[0, 3, 2]} intensity={1.0} color="#FFFFFF" />

        <Physics gravity={[0, -25, 0]} timeStep={1 / 60} interpolate={false}>
          <ReactBitsLanyardContent />
        </Physics>
      </Canvas>
    </div>
  );
}
