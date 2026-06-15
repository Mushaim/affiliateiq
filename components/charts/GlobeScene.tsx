"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AFFILIATES } from "@/data/seed/affiliates";
import { getSegmentColor } from "@/lib/dataUtils";

function Particles() {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 2.0 + (Math.random() - 0.5) * 0.3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Assign color based on affiliate segment distribution
      const aff = AFFILIATES[i % AFFILIATES.length];
      const hex = getSegmentColor(aff.segment);
      const c = new THREE.Color(hex);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.15;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 4, 0, 0]}>
      <torusGeometry args={[2.4, 0.008, 8, 200]} />
      <meshBasicMaterial color="#0891B2" transparent opacity={0.25} />
    </mesh>
  );
}

export function GlobeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.5} />
      <Particles />
      <Ring />
    </Canvas>
  );
}
