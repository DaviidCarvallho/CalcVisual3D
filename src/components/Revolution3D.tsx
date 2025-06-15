
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
      // Criar geometria do sólido de revolução
      const points = [];
      const segments = 80;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        // Filtrar valores inválidos
        if (!isNaN(y) && isFinite(y)) {
          // Usar valor absoluto e limitar entre 0.1 e 5 para evitar deformações
          const radius = Math.max(0.1, Math.min(5, Math.abs(y)));
          
          // Apenas adicionar pontos se o raio for razoável
          if (radius >= 0.1 && radius <= 5) {
            points.push(new THREE.Vector2(radius, x));
          }
        }
      }

      // Se não há pontos válidos ou muito poucos, criar pontos padrão
      if (points.length < 3) {
        points.length = 0; // Limpar array
        for (let i = 0; i <= 20; i++) {
          const x = xMin + (i / 20) * (xMax - xMin);
          const y = evaluateFunction(functionStr, x);
          const radius = Math.max(0.1, Math.min(2, Math.abs(y || 1)));
          points.push(new THREE.Vector2(radius, x));
        }
      }

      // Garantir que temos pelo menos 2 pontos
      if (points.length < 2) {
        points.push(new THREE.Vector2(0.1, xMin));
        points.push(new THREE.Vector2(1, xMax));
      }

      const geometry = new THREE.LatheGeometry(points, 24); // Reduzir segmentos para performance
      return { geometry, isLine: false };
    } else {
      // Criar linha da função
      const points = [];
      const segments = 150;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y)) {
          // Limitar valores extremos para melhor visualização
          const clampedY = Math.max(-8, Math.min(8, y));
          points.push(new THREE.Vector3(x, clampedY, 0));
        }
      }

      // Se não há pontos válidos, criar uma linha padrão
      if (points.length === 0) {
        points.push(new THREE.Vector3(xMin, 0, 0));
        points.push(new THREE.Vector3(xMax, 0, 0));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { geometry, isLine: true };
    }
  }, [functionStr, xMin, xMax, showRevolution]);

  useFrame(() => {
    if (meshRef.current && showRevolution) {
      meshRef.current.rotation.y += 0.003; // Rotação mais suave
    }
  });

  return (
    <>
      {showRevolution ? (
        <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.85}
            side={THREE.DoubleSide}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ) : (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#3b82f6", linewidth: 2 }))} />
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
      
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        
        <RevolutionMesh {...props} />
        
        {/* Grid de referência mais sutil */}
        <Grid 
          args={[16, 16]} 
          position={[0, -3, 0]} 
          cellColor="#444444" 
          sectionColor="#666666"
          fadeDistance={25}
          fadeStrength={1}
        />
        
        {/* Eixos de coordenadas */}
        <Text
          position={[6, 0, 0]}
          fontSize={0.4}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
        <Text
          position={[0, 6, 0]}
          fontSize={0.4}
          color="green"
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
        <Text
          position={[0, 0, 6]}
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
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </div>
  );
};

export default Revolution3D;
