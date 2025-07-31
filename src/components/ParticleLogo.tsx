import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  initialPosition: [number, number, number];
  cubePosition: [number, number, number];
  unityPosition: [number, number, number];
  delay: number;
  convergenceSpeed: number;
  showUnity: boolean;
}

function Particle({ initialPosition, cubePosition, unityPosition, delay, convergenceSpeed, showUnity }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const currentTime = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    
    // Start the particle at its initial random position
    if (!hasStarted && currentTime > delay) {
      mesh.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);
      setHasStarted(true);
    }
    
    if (!hasStarted) return;
    
    // Calculate time since this particle started moving
    const particleTime = currentTime - delay;
    
    // Two-phase animation: Random -> Cube, then Cube -> L484 on hover
    const cubePhaseEnd = 5; // Cube formation complete at 5 seconds
    
    let finalTargetX, finalTargetY, finalTargetZ;
    
    if (particleTime < cubePhaseEnd) {
      // Phase 1: Converge to rotating cube
      const rotationSpeed = 0.3;
      const rotX = currentTime * rotationSpeed;
      const rotY = currentTime * rotationSpeed * 0.7;
      
      const x = cubePosition[0];
      const y = cubePosition[1];
      const z = cubePosition[2];
      
      // Apply Y rotation (around vertical axis)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const rotatedX = x * cosY - z * sinY;
      const rotatedZ = x * sinY + z * cosY;
      
      // Apply X rotation (around horizontal axis)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const finalY = y * cosX - rotatedZ * sinX;
      const finalZ = y * sinX + rotatedZ * cosX;
      
      const rotatedCubePosition = [rotatedX, finalY, finalZ];
      
      // Converge to cube
      const convergenceProgress = Math.min(particleTime * convergenceSpeed, 1);
      const easeProgress = 1 - Math.pow(1 - convergenceProgress, 3); // Ease-out cubic
      
      finalTargetX = initialPosition[0] + (rotatedCubePosition[0] - initialPosition[0]) * easeProgress;
      finalTargetY = initialPosition[1] + (rotatedCubePosition[1] - initialPosition[1]) * easeProgress;
      finalTargetZ = initialPosition[2] + (rotatedCubePosition[2] - initialPosition[2]) * easeProgress;
      
    } else {
      // Phase 2: Cube formed - now check for hover to transform to L484
      const rotationSpeed = 0.3;
      const rotX = currentTime * rotationSpeed;
      const rotY = currentTime * rotationSpeed * 0.7;
      
      const x = cubePosition[0];
      const y = cubePosition[1];
      const z = cubePosition[2];
      
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const rotatedX = x * cosY - z * sinY;
      const rotatedZ = x * sinY + z * cosY;
      
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const finalY = y * cosX - rotatedZ * sinX;
      const finalZ = y * sinX + rotatedZ * cosX;
      
      if (showUnity) {
        // Transform to L484 when button is pressed
        finalTargetX = unityPosition[0];
        finalTargetY = unityPosition[1];
        finalTargetZ = unityPosition[2];
      } else {
        // Stay in rotating cube formation
        finalTargetX = rotatedX;
        finalTargetY = finalY;
        finalTargetZ = finalZ;
      }
    }
    
    // Smooth animation to target
    const animationSpeed = showUnity ? 0.04 : 0.02; // Faster when transforming to L484
    mesh.position.x += (finalTargetX - mesh.position.x) * animationSpeed;
    mesh.position.y += (finalTargetY - mesh.position.y) * animationSpeed;
    mesh.position.z += (finalTargetZ - mesh.position.z) * animationSpeed;
    
    // Add some random floating motion during convergence
    const isInCubePhase = particleTime < cubePhaseEnd;
    const floatIntensity = isInCubePhase ? 0.02 * (1 - Math.min(particleTime * convergenceSpeed, 1)) : (showUnity ? 0.002 : 0.005);
    mesh.position.x += Math.sin(currentTime * 1.5 + delay) * floatIntensity;
    mesh.position.y += Math.cos(currentTime * 1.3 + delay * 1.2) * floatIntensity;
    mesh.position.z += Math.sin(currentTime * 1.7 + delay * 0.8) * floatIntensity * 0.5;
    
    // Particle rotation
    mesh.rotation.x = currentTime * 0.5;
    mesh.rotation.y = currentTime * 0.3;
    
    // Gentle pulsing
    const pulseIntensity = 0.1;
    const scale = 1 + Math.sin(currentTime * 3 + delay) * pulseIntensity;
    mesh.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.012, 8, 6]} />
      <meshStandardMaterial 
        color="#000000" 
        emissive="#000000" 
        emissiveIntensity={0.4}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function ParticleSystem({ showUnity }: { showUnity: boolean }) {

  const particles = useMemo(() => {
    const particleArray: Array<{
      initialPosition: [number, number, number];
      cubePosition: [number, number, number];
      unityPosition: [number, number, number];
      delay: number;
      convergenceSpeed: number;
    }> = [];

    // Define L484 letter patterns
    const unityLetters = [
      // L - Letter at position -1.5
      { x: -1.5, y: 0, patterns: [
        // Vertical line
        [-0.2, 0.4], [-0.2, 0.3], [-0.2, 0.2], [-0.2, 0.1], [-0.2, 0], [-0.2, -0.1], [-0.2, -0.2], [-0.2, -0.3], [-0.2, -0.4],
        // Bottom horizontal
        [-0.15, -0.4], [-0.1, -0.4], [-0.05, -0.4], [0, -0.4], [0.05, -0.4], [0.1, -0.4], [0.15, -0.4], [0.2, -0.4]
      ]},
      // 4 - Letter at position -0.5
      { x: -0.5, y: 0, patterns: [
        // Left vertical (top part)
        [-0.2, 0.4], [-0.2, 0.3], [-0.2, 0.2], [-0.2, 0.1], [-0.2, 0],
        // Right vertical (full)
        [0.2, 0.4], [0.2, 0.3], [0.2, 0.2], [0.2, 0.1], [0.2, 0], [0.2, -0.1], [0.2, -0.2], [0.2, -0.3], [0.2, -0.4],
        // Horizontal crossbar
        [-0.15, 0], [-0.1, 0], [-0.05, 0], [0, 0], [0.05, 0], [0.1, 0], [0.15, 0]
      ]},
      // 8 - Letter at position 0.5
      { x: 0.5, y: 0, patterns: [
        // Top horizontal
        [-0.15, 0.4], [-0.1, 0.4], [-0.05, 0.4], [0, 0.4], [0.05, 0.4], [0.1, 0.4], [0.15, 0.4],
        // Middle horizontal
        [-0.15, 0], [-0.1, 0], [-0.05, 0], [0, 0], [0.05, 0], [0.1, 0], [0.15, 0],
        // Bottom horizontal
        [-0.15, -0.4], [-0.1, -0.4], [-0.05, -0.4], [0, -0.4], [0.05, -0.4], [0.1, -0.4], [0.15, -0.4],
        // Left vertical
        [-0.2, 0.3], [-0.2, 0.2], [-0.2, 0.1], [-0.2, -0.1], [-0.2, -0.2], [-0.2, -0.3],
        // Right vertical
        [0.2, 0.3], [0.2, 0.2], [0.2, 0.1], [0.2, -0.1], [0.2, -0.2], [0.2, -0.3]
      ]},
      // 4 - Letter at position 1.5 (same as first 4)
      { x: 1.5, y: 0, patterns: [
        // Left vertical (top part)
        [-0.2, 0.4], [-0.2, 0.3], [-0.2, 0.2], [-0.2, 0.1], [-0.2, 0],
        // Right vertical (full)
        [0.2, 0.4], [0.2, 0.3], [0.2, 0.2], [0.2, 0.1], [0.2, 0], [0.2, -0.1], [0.2, -0.2], [0.2, -0.3], [0.2, -0.4],
        // Horizontal crossbar
        [-0.15, 0], [-0.1, 0], [-0.05, 0], [0, 0], [0.05, 0], [0.1, 0], [0.15, 0]
      ]}
    ];

    // Generate symmetrical cube with clear particle lines
    const cubeSize = 2.0;
    const halfSize = cubeSize / 2;
    const lineResolution = 16; // Particles per line for smooth definition
    const cubePositions: Array<[number, number, number]> = [];
    
    // Generate 12 cube edges with clear particle lines
    for (let i = 0; i < lineResolution; i++) {
      const t = i / (lineResolution - 1);
      const coord = (t - 0.5) * cubeSize;
      
      // Bottom face edges (4 lines)
      cubePositions.push([coord, -halfSize, -halfSize]); // Front bottom
      cubePositions.push([coord, -halfSize, halfSize]);  // Back bottom
      cubePositions.push([-halfSize, -halfSize, coord]); // Left bottom
      cubePositions.push([halfSize, -halfSize, coord]);  // Right bottom
      
      // Top face edges (4 lines)
      cubePositions.push([coord, halfSize, -halfSize]); // Front top
      cubePositions.push([coord, halfSize, halfSize]);  // Back top
      cubePositions.push([-halfSize, halfSize, coord]); // Left top
      cubePositions.push([halfSize, halfSize, coord]);  // Right top
      
      // Vertical edges (4 lines)
      cubePositions.push([-halfSize, coord, -halfSize]); // Front left
      cubePositions.push([halfSize, coord, -halfSize]);  // Front right
      cubePositions.push([-halfSize, coord, halfSize]);  // Back left
      cubePositions.push([halfSize, coord, halfSize]);   // Back right
    }
    
    // Add face grid lines for structure (every 4th position)
    const faceGrid = 8; // Grid resolution for faces
    for (let i = 1; i < faceGrid - 1; i += 2) { // Skip edges, use every other line
      for (let j = 1; j < faceGrid - 1; j += 2) {
        const u = (i / (faceGrid - 1) - 0.5) * cubeSize;
        const v = (j / (faceGrid - 1) - 0.5) * cubeSize;
        
        // Front and back faces
        cubePositions.push([u, v, -halfSize]); // Front face
        cubePositions.push([u, v, halfSize]);  // Back face
        
        // Left and right faces
        cubePositions.push([-halfSize, u, v]); // Left face
        cubePositions.push([halfSize, u, v]);  // Right face
        
        // Top and bottom faces
        cubePositions.push([u, -halfSize, v]); // Bottom face
        cubePositions.push([u, halfSize, v]);  // Top face
      }
    }
    
    // Generate L484 positions
    const unityPositions: Array<[number, number, number]> = [];
    unityLetters.forEach((letter) => {
      letter.patterns.forEach((pattern) => {
        unityPositions.push([
          letter.x + pattern[0],
          letter.y + pattern[1],
          0
        ]);
      });
    });

    // Generate particles for cube formation
    const totalParticles = cubePositions.length;
    for (let i = 0; i < totalParticles; i++) {
      // Create random initial position (spread out widely)
      const randomRadius = 5 + Math.random() * 3; // 5-8 units from center
      const randomAngle = Math.random() * Math.PI * 2;
      const randomHeight = (Math.random() - 0.5) * 8;
      
      const initialX = Math.cos(randomAngle) * randomRadius;
      const initialY = randomHeight;
      const initialZ = Math.sin(randomAngle) * randomRadius;
      
      // Assign L484 position (cycle through available positions)
      const unityPos = unityPositions[i % unityPositions.length] || [0, 0, 0];
      
      particleArray.push({
        initialPosition: [initialX, initialY, initialZ],
        cubePosition: cubePositions[i],
        unityPosition: unityPos,
        delay: Math.random() * 3, // Random delay up to 3 seconds
        convergenceSpeed: 0.1 + Math.random() * 0.2 // Speed between 0.1-0.3
      });
    }

    return particleArray;
  }, []);

  return (
    <>
      {particles.map((particle, index) => (
        <Particle
          key={index}
          initialPosition={particle.initialPosition}
          cubePosition={particle.cubePosition}
          unityPosition={particle.unityPosition}
          delay={particle.delay}
          convergenceSpeed={particle.convergenceSpeed}
          showUnity={showUnity}
        />
      ))}
    </>
  );
}

interface ParticleLogoProps {
  className?: string;
  showUnity?: boolean;
}

export default function ParticleLogo({ className, showUnity = false }: ParticleLogoProps) {
  return (
    <div className={`w-full h-full ${className} relative`}>
      {/* Particle canvas */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <ParticleSystem showUnity={showUnity} />
      </Canvas>
    </div>
  );
} 