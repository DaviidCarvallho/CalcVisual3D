
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
      // Criar geometria do sólido de revolução garantindo que sempre comece do plano
      const points = [];
      const segments = 80;
      const step = (xMax - xMin) / segments;

      // Primeiro, coletar todos os pontos da função
      const functionPoints = [];
      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y)) {
          functionPoints.push({ x, y });
        }
      }

      // Se não há pontos válidos, criar função padrão
      if (functionPoints.length === 0) {
        functionPoints.push({ x: xMin, y: 1 });
        functionPoints.push({ x: xMax, y: 1 });
      }

      // Normalizar os pontos para garantir que fiquem dentro do plano
      for (const point of functionPoints) {
        // Garantir que o raio seja sempre positivo e limitado
        let radius = Math.abs(point.y);
        
        // Limitar o raio máximo para evitar que ultrapasse o plano
        radius = Math.min(radius, 2);
        
        // Garantir raio mínimo para visibilidade
        radius = Math.max(radius, 0.1);
        
        // Posicionar no eixo Z com escala reduzida
        const zPosition = point.x * 0.3;
        
        points.push(new THREE.Vector2(radius, zPosition));
      }

      // Garantir que temos pelo menos 2 pontos
      if (points.length < 2) {
        points.push(new THREE.Vector2(0.1, xMin * 0.3));
        points.push(new THREE.Vector2(1, xMax * 0.3));
      }

      // Adicionar ponto no início para garantir que o sólido comece do plano
      if (points.length > 0) {
        const firstPoint = points[0];
        points.unshift(new THREE.Vector2(0, firstPoint.y));
      }

      const geometry = new THREE.LatheGeometry(points, 32);
      return { geometry, isLine: false };
    } else {
      // Criar linha da função 2D
      const points = [];
      const segments = 120;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y)) {
          // Limitar valores extremos para melhor visualização
          const scaledX = x * 0.3;
          const scaledY = Math.max(-3, Math.min(3, y * 0.4));
          points.push(new THREE.Vector3(scaledX, scaledY, 0));
        }
      }

      // Se não há pontos válidos, criar uma linha padrão
      if (points.length === 0) {
        points.push(new THREE.Vector3(xMin * 0.3, 0, 0));
        points.push(new THREE.Vector3(xMax * 0.3, 1, 0));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { geometry, isLine: true };
    }
  }, [functionStr, xMin, xMax, showRevolution]);

  useFrame(() => {
    if (meshRef.current && showRevolution) {
      meshRef.current.rotation.y += 0.008; // Rotação mais suave
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
        {props.showRevolution && (
          <p className="text-xs text-gray-400 mt-1">
            Rotação em torno do eixo X
          </p>
        )}
      </div>
      
      <Canvas camera={{ position: [8, 4, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-8, -4, -8]} intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        
        <RevolutionMesh {...props} />
        
        {/* Grid de referência - removido o plano separado para evitar z-fighting */}
        <Grid 
          args={[20, 20]} 
          position={[0, -0.01, 0]} 
          cellColor="#374151" 
          sectionColor="#6b7280"
          fadeDistance={30}
          fadeStrength={0.7}
          infiniteGrid={false}
          followCamera={false}
        />
        
        {/* Eixos de coordenadas */}
        <Text
          position={[7, 0, 0]}
          fontSize={0.4}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
        <Text
          position={[0, 7, 0]}
          fontSize={0.4}
          color="green"
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
        <Text
          position={[0, 0, 7]}
          fontSize={0.4}
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
          minDistance={4}
          maxDistance={30}
          maxPolarAngle={Math.PI * 0.95}
          minPolarAngle={Math.PI * 0.05}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default Revolution3D;
