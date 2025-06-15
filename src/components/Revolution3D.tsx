
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { evaluateFunction } from '@/utils/mathParser';

interface Revolution3DProps {
  functionStr: string;
  xMin: number;
  xMax: number;
  showRevolution: boolean;
}

const RevolutionMesh = ({ functionStr, xMin, xMax, showRevolution }: Revolution3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry, isLine } = useMemo(() => {
    if (showRevolution) {
      const points = [];
      const segments = 100; // Reduzir para melhor performance
      const step = (xMax - xMin) / segments;

      const functionPoints = [];
      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y) && Math.abs(y) < 50) {
          functionPoints.push({ x, y: Math.abs(y) });
        }
      }

      if (functionPoints.length === 0) {
        functionPoints.push({ x: xMin, y: 0.5 });
        functionPoints.push({ x: xMax, y: 0.5 });
      }

      const maxRadius = Math.max(...functionPoints.map(p => Math.abs(p.y)));
      const scaleFactor = Math.min(2, 2 / maxRadius);
      
      for (const point of functionPoints) {
        let radius = Math.abs(point.y) * scaleFactor;
        radius = Math.max(radius, 0.05);
        const zPosition = (point.x - xMin) / (xMax - xMin) * 4 - 2;
        points.push(new THREE.Vector2(radius, zPosition));
      }

      if (points.length > 0) {
        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];
        points.unshift(new THREE.Vector2(0.01, firstPoint.y));
        points.push(new THREE.Vector2(0.01, lastPoint.y));
      }

      const geometry = new THREE.LatheGeometry(points, 32);
      geometry.translate(0, 0, 0);
      
      return { geometry, isLine: false };
    } else {
      const points = [];
      const segments = 150;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y) && Math.abs(y) < 20) {
          const scaledX = (x - xMin) / (xMax - xMin) * 4 - 2;
          const scaledY = Math.max(-3, Math.min(3, y * 0.5));
          points.push(new THREE.Vector3(scaledX, scaledY, 0));
        }
      }

      if (points.length === 0) {
        points.push(new THREE.Vector3(-2, 0, 0));
        points.push(new THREE.Vector3(2, 1, 0));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { geometry, isLine: true };
    }
  }, [functionStr, xMin, xMax, showRevolution]);

  useFrame(() => {
    if (meshRef.current && showRevolution) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      {showRevolution ? (
        <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ) : (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
          color: "#3b82f6", 
          linewidth: 3 
        }))} />
      )}
    </>
  );
};

const Revolution3D = (props: Revolution3DProps) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 h-96 relative">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h3 className="text-lg font-semibold">
          {props.showRevolution ? 'Sólido de Revolução 3D' : 'Visualização 3D'}
        </h3>
        <p className="text-sm text-gray-300">
          f(x) = {props.functionStr}
        </p>
        {props.showRevolution && (
          <p className="text-xs text-gray-400 mt-1">
            Rotação em torno do eixo X
          </p>
        )}
      </div>
      
      <Canvas 
        camera={{ position: [6, 3, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]} intensity={0.8} />
        <pointLight position={[-6, -3, -6]} intensity={0.3} />
        <directionalLight 
          position={[4, 4, 4]} 
          intensity={0.6}
        />
        
        <RevolutionMesh {...props} />
        
        <Grid 
          args={[12, 12]} 
          position={[0, -0.01, 0]} 
          cellColor="#374151" 
          sectionColor="#6b7280"
          fadeDistance={20}
          fadeStrength={1}
          infiniteGrid={false}
        />
        
        <Text
          position={[5, 0.2, 0]}
          fontSize={0.3}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
        <Text
          position={[0.2, 5, 0]}
          fontSize={0.3}
          color="green"
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
        <Text
          position={[0, 0.2, 5]}
          fontSize={0.3}
          color="blue"
          anchorX="center"
          anchorY="middle"
        >
          Z
        </Text>
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI * 0.9}
          minPolarAngle={Math.PI * 0.1}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={1}
          panSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Revolution3D;
