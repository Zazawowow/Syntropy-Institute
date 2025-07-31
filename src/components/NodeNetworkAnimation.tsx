import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connections: number[];
}

interface NodeNetworkAnimationProps {
  className?: string;
}

const NodeNetworkAnimation = ({ className = '' }: NodeNetworkAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize nodes
    const nodeCount = 25;
    const maxDistance = 150;
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        connections: []
      });
    }

    // Black color palette
    const colors = {
      node: '#000000',
      connection: '#000000',
      nodeSecondary: '#333333',
      connectionSecondary: '#666666'
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.offsetWidth) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(canvas.offsetWidth, node.x));
        }
        if (node.y <= 0 || node.y >= canvas.offsetHeight) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(canvas.offsetHeight, node.y));
        }

        // Update connections
        node.connections = [];
        nodes.forEach((otherNode, index) => {
          if (node !== otherNode) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < maxDistance) {
              node.connections.push(index);
            }
          }
        });
      });

      // Draw connections
      ctx.strokeStyle = colors.connection;
      nodes.forEach((node, nodeIndex) => {
        node.connections.forEach(connectionIndex => {
          if (nodeIndex < connectionIndex) { // Avoid drawing the same line twice
            const otherNode = nodes[connectionIndex];
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            const opacity = Math.max(0, 1 - distance / maxDistance) * 0.3;
            
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        // Node glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 3
        );
        gradient.addColorStop(0, colors.node);
        gradient.addColorStop(0.4, colors.nodeSecondary + '80');
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = node.opacity * 0.6;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Main node
        ctx.globalAlpha = node.opacity;
        ctx.fillStyle = colors.node;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Node highlight
        ctx.globalAlpha = node.opacity * 0.8;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(node.x + node.size * 0.3, node.y - node.size * 0.3, node.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    nodesRef.current = nodes;
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'normal' }}
      />
    </motion.div>
  );
};

export default NodeNetworkAnimation;