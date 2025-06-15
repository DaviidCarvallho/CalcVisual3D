
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
  const lineRef = useRef<THREE.Line>(null);

  const { geometry, isLine } = useMemo(() => {
    if (showRevolution) {
      // Criar geometria do sólido de revolução com escala muito menor
      const points = [];
      const segments = 60;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        // Filtrar valores inválidos e aplicar escala muito menor
        if (!isNaN(y) && isFinite(y)) {
          // Escala muito reduzida: máximo 2 unidades de raio, mínimo 0.05
          const radius = Math.max(0.05, Math.min(2, Math.abs(y) * 0.3));
          
          // Apenas adicionar pontos se o raio for razoável
          if (radius >= 0.05 && radius <= 2) {
            points.push(new THREE.Vector2(radius, x * 0.5)); // Também reduzir escala em X
          }
        }
      }

      // Se não há pontos válidos ou muito poucos, criar pontos padrão menores
      if (points.length < 3) {
        points.length = 0;
        for (let i = 0; i <= 20; i++) {
          const x = xMin + (i / 20) * (xMax - xMin);
          const y = evaluateFunction(functionStr, x);
          const radius = Math.max(0.05, Math.min(1, Math.abs(y || 1) * 0.2));
          points.push(new THREE.Vector2(radius, x * 0.5));
        }
      }

      // Garantir que temos pelo menos 2 pontos
      if (points.length < 2) {
        points.push(new THREE.Vector2(0.05, xMin * 0.5));
        points.push(new THREE.Vector2(0.5, xMax * 0.5));
      }

      const geometry = new THREE.LatheGeometry(points, 32);
      return { geometry, isLine: false };
    } else {
      // Criar linha da função com escala reduzida
      const points = [];
      const segments = 120;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y)) {
          // Escala reduzida para a linha também
          const scaledX = x * 0.5;
          const scaledY = Math.max(-4, Math.min(4, y * 0.5));
          points.push(new THREE.Vector3(scaledX, scaledY, 0));
        }
      }

      // Se não há pontos válidos, criar uma linha padrão
      if (points.length === 0) {
        points.push(new THREE.Vector3(xMin * 0.5, 0, 0));
        points.push(new THREE.Vector3(xMax * 0.5, 0, 0));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { geometry, isLine: true };
    }
  }, [functionStr, xMin, xMax, showRevolution]);

  useFrame(() => {
    if (meshRef.current && showRevolution) {
      meshRef.current.rotation.y += 0.005; // Rotação ligeiramente mais rápida
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
            metalness={0.3}
          />
        </mesh>
      ) : (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#3b82f6", linewidth: 3 }))} />
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
      </div>
      
      <Canvas camera={{ position: [12, 8, 12], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[15, 15, 15]} intensity={1} />
        <pointLight position={[-10, -5, -10]} intensity={0.4} />
        <directionalLight position={[8, 8, 8]} intensity={0.5} />
        
        <RevolutionMesh {...props} />
        
        {/* Grid de referência maior e mais espaçado */}
        <Grid 
          args={[20, 20]} 
          position={[0, -2, 0]} 
          cellColor="#333333" 
          sectionColor="#555555"
          fadeDistance={30}
          fadeStrength={0.8}
        />
        
        {/* Eixos de coordenadas mais distantes */}
        <Text
          position={[8, 0, 0]}
          fontSize={0.5}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
        <Text
          position={[0, 8, 0]}
          fontSize={0.5}
          color="green"
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
        <Text
          position={[0, 0, 8]}
          fontSize={0.5}
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
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI * 0.9}
          minPolarAngle={Math.PI * 0.1}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default Revolution3D;
