import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  position: [number, number, number];
  targetPosition: [number, number, number];
  delay: number;
  waveSpeed: number;
  amplitude: number;
}

interface SoundwaveParticlesProps {
  className?: string;
}

function Particle({ position, targetPosition, delay, waveSpeed, amplitude }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    
    // Enhanced mouse repulsion to create void effect
    const mouseX = mouse.x * 4;
    const mouseY = mouse.y * 3;
    
    const deltaX = mesh.position.x - mouseX;
    const deltaY = mesh.position.y - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Larger repulsion radius and stronger force for void effect
    const repulsionRadius = 2.5;
    const repulsionStrength = 1.2;
    
    let targetX = targetPosition[0];
    let targetY = targetPosition[1];
    const targetZ = targetPosition[2];
    
    // Apply strong mouse repulsion to create void
    if (distance < repulsionRadius && distance > 0) {
      // Exponential falloff for stronger void effect
      const falloff = Math.pow((repulsionRadius - distance) / repulsionRadius, 2);
      const force = falloff * repulsionStrength;
      
      const directionX = deltaX / distance;
      const directionY = deltaY / distance;
      
      // Push particles away more aggressively
      targetX += directionX * force * 4;
      targetY += directionY * force * 4;
      
      // Make particles at the very edge of cursor almost invisible
      if (distance < 0.8) {
        targetX += directionX * 6; // Extra push for closest particles
        targetY += directionY * 6;
      }
    }
    
    // Soundwave animation - horizontal flowing waves
    const waveOffset = Math.sin((time * waveSpeed) + (targetX * 3) + delay) * amplitude;
    targetY += waveOffset;
    
    // Secondary wave for more complex motion
    const secondaryWave = Math.sin((time * waveSpeed * 0.7) + (targetX * 2) + delay) * (amplitude * 0.5);
    targetY += secondaryWave;
    
    // Gentle horizontal drift
    const horizontalDrift = Math.sin(time * 0.3 + delay) * 0.1;
    targetX += horizontalDrift;
    
    // Faster animation when being repelled for more responsive void
    const isBeingRepelled = distance < repulsionRadius;
    const animationSpeed = isBeingRepelled ? 0.12 : 0.03;
    mesh.position.x += (targetX - mesh.position.x) * animationSpeed;
    mesh.position.y += (targetY - mesh.position.y) * animationSpeed;
    mesh.position.z += (targetZ - mesh.position.z) * animationSpeed;
    
    // Rotation based on wave motion and repulsion
    const rotationSpeed = isBeingRepelled ? 4.0 : 0.5;
    mesh.rotation.x = time * rotationSpeed + waveOffset * 0.5;
    mesh.rotation.y = time * (rotationSpeed * 0.6) + secondaryWave * 0.3;
    
    // Scale and opacity effects for void
    const pulseIntensity = isBeingRepelled ? 0.5 : 0.1;
    const wavePulse = Math.sin(time * 2 + delay) * pulseIntensity;
    const scale = 1 + wavePulse + Math.abs(waveOffset) * 0.1;
    mesh.scale.setScalar(scale);
    
    // Fade out particles close to cursor for cleaner void
    const material = mesh.material as THREE.MeshStandardMaterial;
    if (distance < 1.0) {
      const fadeDistance = Math.max(0, distance - 0.3);
      material.opacity = 0.9 * (fadeDistance / 0.7);
    } else {
      material.opacity = 0.9;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.008, 6, 4]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff" 
        emissiveIntensity={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function SoundwaveParticleSystem() {
  const particles = useMemo(() => {
    const particleArray: Array<{
      position: [number, number, number];
      targetPosition: [number, number, number];
      delay: number;
      waveSpeed: number;
      amplitude: number;
    }> = [];

    // Create flowing soundwave patterns to fill entire page including header
    const rows = 40; // Number of horizontal rows
    const particlesPerRow = 80; // Particles per row
    const fieldWidth = 8; // Total width of the field (much wider)
    const fieldHeight = 6; // Total height of the field (much taller)
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < particlesPerRow; col++) {
        // Base grid position
        const x = (col / (particlesPerRow - 1) - 0.5) * fieldWidth;
        const y = (row / (rows - 1) - 0.5) * fieldHeight;
        
        // Add randomness for organic feel
        const randomX = x + (Math.random() - 0.5) * 0.1;
        const randomY = y + (Math.random() - 0.5) * 0.1;
        const z = (Math.random() - 0.5) * 0.3;
        
        // Wave properties vary by row for layered effect
        const waveSpeed = 1 + (row / rows) * 2; // Faster waves at different rows
        const amplitude = 0.1 + (Math.sin(row * 0.5) * 0.05); // Varying amplitude
        
        particleArray.push({
          position: [
            randomX + (Math.random() - 0.5) * 0.1,
            randomY + (Math.random() - 0.5) * 0.1,
            z
          ],
          targetPosition: [randomX, randomY, 0],
          delay: (row * 0.1) + (col * 0.05), // Staggered animation
          waveSpeed,
          amplitude
        });
      }
    }

    // Add some extra random particles for density
    for (let i = 0; i < 800; i++) {
      const x = (Math.random() - 0.5) * fieldWidth;
      const y = (Math.random() - 0.5) * fieldHeight;
      const z = (Math.random() - 0.5) * 0.3;
      
      particleArray.push({
        position: [
          x + (Math.random() - 0.5) * 0.1,
          y + (Math.random() - 0.5) * 0.1,
          z
        ],
        targetPosition: [x, y, 0],
        delay: Math.random() * 2,
        waveSpeed: 1 + Math.random() * 2,
        amplitude: 0.05 + Math.random() * 0.1
      });
    }

    // Add edge particles for complete coverage
    const edgeParticles = 100;
    for (let i = 0; i < edgeParticles; i++) {
      // Random edge position (top, bottom, left, right)
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      
      switch (edge) {
        case 0: // Top edge
          x = (Math.random() - 0.5) * fieldWidth;
          y = fieldHeight / 2 + Math.random() * 0.5;
          break;
        case 1: // Bottom edge
          x = (Math.random() - 0.5) * fieldWidth;
          y = -fieldHeight / 2 - Math.random() * 0.5;
          break;
        case 2: // Left edge
          x = -fieldWidth / 2 - Math.random() * 0.5;
          y = (Math.random() - 0.5) * fieldHeight;
          break;
        default: // Right edge
          x = fieldWidth / 2 + Math.random() * 0.5;
          y = (Math.random() - 0.5) * fieldHeight;
          break;
      }
      
      const z = (Math.random() - 0.5) * 0.3;
      
      particleArray.push({
        position: [
          x + (Math.random() - 0.5) * 0.1,
          y + (Math.random() - 0.5) * 0.1,
          z
        ],
        targetPosition: [x, y, 0],
        delay: Math.random() * 2,
        waveSpeed: 1 + Math.random() * 2,
        amplitude: 0.05 + Math.random() * 0.1
      });
    }

    return particleArray;
  }, []);

  return (
    <>
      {particles.map((particle, index) => (
        <Particle
          key={index}
          position={particle.position}
          targetPosition={particle.targetPosition}
          delay={particle.delay}
          waveSpeed={particle.waveSpeed}
          amplitude={particle.amplitude}
        />
      ))}
    </>
  );
}

export default function SoundwaveParticles({ className }: SoundwaveParticlesProps) {
  return (
    <div className={`${className} relative`}>
      {/* Soundwave particle canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 100 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <SoundwaveParticleSystem />
      </Canvas>
    </div>
  );
} 