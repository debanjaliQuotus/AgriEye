import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SensorMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data - in a real app, this would come from your backend
  const sensorData = [
    { id: 1, x: 80, y: 50, status: 'active', type: 'motion' },
    { id: 2, x: 150, y: 120, status: 'active', type: 'perimeter' },
    { id: 3, x: 280, y: 90, status: 'warning', type: 'motion' },
    { id: 4, x: 220, y: 180, status: 'active', type: 'perimeter' },
    { id: 5, x: 350, y: 150, status: 'error', type: 'motion' },
    { id: 6, x: 400, y: 70, status: 'active', type: 'perimeter' },
    { id: 7, x: 180, y: 220, status: 'active', type: 'motion' },
    { id: 8, x: 300, y: 250, status: 'active', type: 'perimeter' },
    { id: 9, x: 420, y: 200, status: 'active', type: 'motion' },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match parent container with higher resolution for retina displays
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * devicePixelRatio;
      canvas.height = parent.clientHeight * devicePixelRatio;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      drawMap();
    };

    const drawMap = () => {
      if (!ctx) return;
      
      // Clear canvas with light gradient background
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Create light gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#F8FAFC'); // slate-50
      gradient.addColorStop(0.5, '#F1F5F9'); // slate-100  
      gradient.addColorStop(1, '#E2E8F0'); // slate-200
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw subtle grid lines with blue tint
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)'; // blue-500 with low opacity
      ctx.lineWidth = 0.5;
      
      // Draw grid
      const gridSize = 30;
      for (let i = 0; i < height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      for (let i = 0; i < width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      
      // Draw perimeter with gradient border
      const perimeterGradient = ctx.createLinearGradient(0, 0, width, height);
      perimeterGradient.addColorStop(0, '#3B82F6'); // blue-500
      perimeterGradient.addColorStop(0.5, '#8B5CF6'); // purple-500
      perimeterGradient.addColorStop(1, '#06B6D4'); // cyan-500
      
      ctx.strokeStyle = perimeterGradient;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.roundRect(20, 20, width - 40, height - 40, 15);
      ctx.stroke();
      
      // Draw zones with subtle gradient fills
      const zoneGradient1 = ctx.createRadialGradient(115, 90, 0, 115, 90, 80);
      zoneGradient1.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      zoneGradient1.addColorStop(1, 'rgba(59, 130, 246, 0.03)');
      
      ctx.fillStyle = zoneGradient1;
      ctx.beginPath();
      ctx.roundRect(40, 40, 150, 100, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      const zoneGradient2 = ctx.createRadialGradient(width - 115, height - 90, 0, width - 115, height - 90, 80);
      zoneGradient2.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
      zoneGradient2.addColorStop(1, 'rgba(139, 92, 246, 0.03)');
      
      ctx.fillStyle = zoneGradient2;
      ctx.beginPath();
      ctx.roundRect(width - 190, height - 140, 150, 100, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.stroke();
      
      // Draw connections between sensors with gradient
      const connectionGradient = ctx.createLinearGradient(0, 0, width, height);
      connectionGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      connectionGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
      connectionGradient.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
      
      ctx.strokeStyle = connectionGradient;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      
      for (let i = 0; i < sensorData.length; i++) {
        for (let j = i + 1; j < sensorData.length; j++) {
          const distance = Math.sqrt(
            Math.pow(sensorData[i].x - sensorData[j].x, 2) + 
            Math.pow(sensorData[i].y - sensorData[j].y, 2)
          );
          if (distance < 150) { // Only draw connections for nearby sensors
            ctx.beginPath();
            ctx.moveTo(sensorData[i].x, sensorData[i].y);
            ctx.lineTo(sensorData[j].x, sensorData[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.setLineDash([]);
      
      // Draw sensors with enhanced styling
      sensorData.forEach(sensor => {
        // Create pulsing glow effect
        const pulse = Math.sin(Date.now() * 0.003 + sensor.id) * 0.3 + 0.7;
        
        // Draw outer glow
        const glowGradient = ctx.createRadialGradient(sensor.x, sensor.y, 0, sensor.x, sensor.y, 20);
        switch (sensor.status) {
          case 'active':
            glowGradient.addColorStop(0, `rgba(34, 197, 94, ${0.3 * pulse})`);
            glowGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
            break;
          case 'warning':
            glowGradient.addColorStop(0, `rgba(245, 158, 11, ${0.3 * pulse})`);
            glowGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
            break;
          case 'error':
            glowGradient.addColorStop(0, `rgba(239, 68, 68, ${0.3 * pulse})`);
            glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
            break;
        }
        
        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(sensor.x, sensor.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sensor base with gradient
        const sensorGradient = ctx.createRadialGradient(sensor.x, sensor.y, 0, sensor.x, sensor.y, 10);
        sensorGradient.addColorStop(0, '#F8FAFC'); // slate-50
        sensorGradient.addColorStop(1, '#E2E8F0'); // slate-200
        
        ctx.beginPath();
        ctx.fillStyle = sensorGradient;
        ctx.arc(sensor.x, sensor.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw status ring
        ctx.beginPath();
        ctx.lineWidth = 2;
        switch (sensor.status) {
          case 'active':
            ctx.strokeStyle = '#22C55E'; // green-500
            break;
          case 'warning':
            ctx.strokeStyle = '#F59E0B'; // amber-500
            break;
          case 'error':
            ctx.strokeStyle = '#EF4444'; // red-500
            break;
        }
        ctx.arc(sensor.x, sensor.y, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw center dot with gradient
        const centerGradient = ctx.createRadialGradient(sensor.x, sensor.y, 0, sensor.x, sensor.y, 4);
        switch (sensor.status) {
          case 'active':
            centerGradient.addColorStop(0, '#4ADE80'); // green-400
            centerGradient.addColorStop(1, '#22C55E'); // green-500
            break;
          case 'warning':
            centerGradient.addColorStop(0, '#FBBF24'); // amber-400
            centerGradient.addColorStop(1, '#F59E0B'); // amber-500
            break;
          case 'error':
            centerGradient.addColorStop(0, '#F87171'); // red-400
            centerGradient.addColorStop(1, '#EF4444'); // red-500
            break;
        }
        
        ctx.beginPath();
        ctx.fillStyle = centerGradient;
        ctx.arc(sensor.x, sensor.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw "scanning" animation with gradient
      const scanAngle = (Date.now() % 8000) / 8000 * Math.PI * 2;
      const scanGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) / 3);
      scanGradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      scanGradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.05)');
      scanGradient.addColorStop(1, 'rgba(6, 182, 212, 0.03)');
      
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 3, scanAngle - 0.3, scanAngle + 0.3);
      ctx.lineTo(width / 2, height / 2);
      ctx.closePath();
      ctx.fillStyle = scanGradient;
      ctx.fill();
    };
    
    // Initial setup
    resizeCanvas();
    
    // Add animation
    let animationFrameId: number;
    const animate = () => {
      drawMap();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-xl relative overflow-hidden border border-gray-200/50">
      <canvas ref={canvasRef} className="w-full h-full" />
      <motion.div
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-gray-700 border border-gray-200/50 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse"></div>
          <span className="font-medium">Live Sensor Network</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SensorMap;