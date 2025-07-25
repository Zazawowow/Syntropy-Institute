import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleProps {
  position: [number, number, number];
  targetPosition: [number, number, number];
  delay: number;
}

interface BitcoinLogoProps {
  className?: string;
}

function Particle({ position, targetPosition, delay }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    
    // Mouse repulsion - particles dart away from cursor
    const mouseX = mouse.x * 4; // Convert normalized mouse to world coordinates
    const mouseY = mouse.y * 3;
    
    // Calculate distance from particle to mouse
    const deltaX = mesh.position.x - mouseX;
    const deltaY = mesh.position.y - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Repulsion effect - stronger when closer
    const repulsionRadius = 1.5; // How far the effect reaches
    const repulsionStrength = 0.3; // How strong the push is
    
    let targetX = targetPosition[0];
    let targetY = targetPosition[1];
    const targetZ = targetPosition[2];
    
    if (distance < repulsionRadius && distance > 0) {
      // Calculate repulsion force (stronger when closer)
      const force = (repulsionRadius - distance) / repulsionRadius * repulsionStrength;
      
      // Normalize direction vector and apply force
      const directionX = deltaX / distance;
      const directionY = deltaY / distance;
      
      // Push particle away from mouse
      targetX += directionX * force * 2;
      targetY += directionY * force * 2;
    }
    
    // Smooth animation to target position (with repulsion)
    const animationSpeed = 0.03;
    mesh.position.x += (targetX - mesh.position.x) * animationSpeed;
    mesh.position.y += (targetY - mesh.position.y) * animationSpeed;
    mesh.position.z += (targetZ - mesh.position.z) * animationSpeed;
    
    // Floating animation
    mesh.position.y += Math.sin(time * 2 + delay) * 0.01;
    
    // Rotation (faster when being repelled)
    const rotationSpeed = distance < repulsionRadius ? 2.0 : 0.5;
    mesh.rotation.x = time * rotationSpeed;
    mesh.rotation.y = time * (rotationSpeed * 0.6);
    
    // Scale pulsing (more intense when repelled)
    const pulseIntensity = distance < repulsionRadius ? 0.3 : 0.1;
    const scale = 1 + Math.sin(time * 3 + delay) * pulseIntensity;
    mesh.scale.setScalar(scale);
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

function BitcoinParticleSystem() {
  const particles = useMemo(() => {
    const particleArray: Array<{
      position: [number, number, number];
      targetPosition: [number, number, number];
      delay: number;
    }> = [];

    // Helper function to check if a point is inside the Bitcoin logo shapes
    const isInsideBitcoinShape = (x: number, y: number) => {
      // Check if inside outer circle but outside inner circle (ring)
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      const isInRing = distanceFromCenter <= 0.58 && distanceFromCenter >= 0.42;
      
      // Check if inside the "B" letter shapes
      let isInB = false;
      
      // Main vertical spine of B
      if (x >= -0.22 && x <= -0.1 && y >= -0.38 && y <= 0.38) {
        isInB = true;
      }
      
      // Top horizontal line
      if (x >= -0.22 && x <= 0.18 && y >= 0.25 && y <= 0.38) {
        isInB = true;
      }
      
      // Middle horizontal line  
      if (x >= -0.22 && x <= 0.2 && y >= -0.05 && y <= 0.08) {
        isInB = true;
      }
      
      // Bottom horizontal line
      if (x >= -0.22 && x <= 0.18 && y >= -0.38 && y <= -0.25) {
        isInB = true;
      }
      
      // Top curve (upper bump)
      const topCenterX = 0.08;
      const topCenterY = 0.18;
      const topDistX = (x - topCenterX) / 0.24;
      const topDistY = (y - topCenterY) / 0.19;
      if (topDistX * topDistX + topDistY * topDistY <= 1 && y >= 0.08 && y <= 0.35 && x >= -0.1) {
        isInB = true;
      }
      
      // Bottom curve (lower bump)
      const bottomCenterX = 0.1;
      const bottomCenterY = -0.18;
      const bottomDistX = (x - bottomCenterX) / 0.27;
      const bottomDistY = (y - bottomCenterY) / 0.22;
      if (bottomDistX * bottomDistX + bottomDistY * bottomDistY <= 1 && y >= -0.35 && y <= -0.05 && x >= -0.1) {
        isInB = true;
      }
      
      // Vertical lines through Bitcoin symbol
      if ((x >= -0.1 && x <= 0.1) && (y >= 0.6 || y <= -0.6)) {
        isInB = true;
      }
      
      return isInRing || isInB;
    };

    // Create a dense field of particles and exclude those inside the Bitcoin shape
    const gridSize = 80; // Density of the particle field
    const fieldSize = 1.5; // Size of the field
    
    let particleIndex = 0;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Create grid position
        const x = (i / (gridSize - 1) - 0.5) * fieldSize;
        const y = (j / (gridSize - 1) - 0.5) * fieldSize;
        
        // Add some randomness to avoid perfect grid
        const randomX = x + (Math.random() - 0.5) * 0.03;
        const randomY = y + (Math.random() - 0.5) * 0.03;
        
        // Only add particle if it's NOT inside the Bitcoin shape
        if (!isInsideBitcoinShape(randomX, randomY)) {
          const z = (Math.random() - 0.5) * 0.2;
          
          particleArray.push({
            position: [
              randomX + (Math.random() - 0.5) * 0.1,
              randomY + (Math.random() - 0.5) * 0.1,
              z
            ],
            targetPosition: [randomX, randomY, 0],
            delay: particleIndex * 0.01
          });
          
          particleIndex++;
        }
      }
    }

    // Add some extra random particles for more organic feel
    for (let i = 0; i < 800; i++) {
      const x = (Math.random() - 0.5) * fieldSize;
      const y = (Math.random() - 0.5) * fieldSize;
      
      if (!isInsideBitcoinShape(x, y)) {
        const z = (Math.random() - 0.5) * 0.2;
        
        particleArray.push({
          position: [
            x + (Math.random() - 0.5) * 0.1,
            y + (Math.random() - 0.5) * 0.1,
            z
          ],
          targetPosition: [x, y, 0],
          delay: particleIndex * 0.01
        });
        
        particleIndex++;
      }
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
        />
      ))}
    </>
  );
}

export default function BitcoinLogo({ className }: BitcoinLogoProps) {
  return (
    <div className={`w-full h-full ${className} relative`}>
      {/* Bitcoin particle canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <BitcoinParticleSystem />
      </Canvas>
    </div>
  );
} 