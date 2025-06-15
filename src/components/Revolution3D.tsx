
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
      // Criar geometria do sólido de revolução com alta precisão
      const points = [];
      const segments = 200; // Aumentar segmentos para maior precisão
      const step = (xMax - xMin) / segments;

      // Primeiro, coletar todos os pontos da função com validação rigorosa
      const functionPoints = [];
      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y) && Math.abs(y) < 100) { // Limitar valores extremos
          functionPoints.push({ x, y: Math.abs(y) }); // Garantir valores positivos para revolução
        }
      }

      // Se não há pontos válidos, criar função padrão
      if (functionPoints.length === 0) {
        functionPoints.push({ x: xMin, y: 0.5 });
        functionPoints.push({ x: xMax, y: 0.5 });
      }

      // Normalizar os pontos para garantir visualização adequada
      const maxRadius = Math.max(...functionPoints.map(p => Math.abs(p.y)));
      const scaleFactor = Math.min(2.5, 2.5 / maxRadius); // Limitar raio máximo
      
      for (const point of functionPoints) {
        // Aplicar escala para manter dentro do espaço visível
        let radius = Math.abs(point.y) * scaleFactor;
        
        // Garantir raio mínimo para visibilidade
        radius = Math.max(radius, 0.05);
        
        // Posicionar no eixo Z com escala adequada
        const zPosition = (point.x - xMin) / (xMax - xMin) * 4 - 2; // Normalizar para [-2, 2]
        
        points.push(new THREE.Vector2(radius, zPosition));
      }

      // Garantir que o sólido sempre inicie do plano (raio 0)
      if (points.length > 0) {
        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];
        
        // Adicionar pontos no início e fim para fechar o sólido
        points.unshift(new THREE.Vector2(0.01, firstPoint.y));
        points.push(new THREE.Vector2(0.01, lastPoint.y));
      }

      // Usar mais segmentos radiais para maior precisão
      const geometry = new THREE.LatheGeometry(points, 64);
      
      // Centralizar geometria
      geometry.translate(0, 0, 0);
      
      return { geometry, isLine: false };
    } else {
      // Criar linha da função 2D com alta precisão
      const points = [];
      const segments = 300; // Mais pontos para linha mais suave
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(functionStr, x);
        
        if (!isNaN(y) && isFinite(y) && Math.abs(y) < 50) { // Limitar valores extremos
          // Normalizar coordenadas para melhor visualização
          const scaledX = (x - xMin) / (xMax - xMin) * 4 - 2; // Normalizar para [-2, 2]
          const scaledY = Math.max(-4, Math.min(4, y * 0.3)); // Limitar e escalar Y
          points.push(new THREE.Vector3(scaledX, scaledY, 0));
        }
      }

      // Se não há pontos válidos, criar uma linha padrão
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
      meshRef.current.rotation.y += 0.005; // Rotação mais suave
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
            roughness={0.1}
            metalness={0.2}
            wireframe={false}
          />
          {/* Adicionar wireframe para melhor visualização */}
          <mesh geometry={geometry}>
            <meshBasicMaterial 
              color="#1e40af" 
              wireframe={true} 
              transparent 
              opacity={0.2}
            />
          </mesh>
        </mesh>
      ) : (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
          color: "#3b82f6", 
          linewidth: 4 
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
          {props.showRevolution ? 'Sólido de Revolução 3D (Alta Precisão)' : 'Visualização 3D (Alta Precisão)'}
        </h3>
        <p className="text-sm text-gray-300">
          f(x) = {props.functionStr}
        </p>
        {props.showRevolution && (
          <p className="text-xs text-gray-400 mt-1">
            Rotação em torno do eixo X | Arraste para rotacionar
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
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <RevolutionMesh {...props} />
        
        {/* Grid de referência aprimorado */}
        <Grid 
          args={[16, 16]} 
          position={[0, -0.02, 0]} 
          cellColor="#374151" 
          sectionColor="#6b7280"
          fadeDistance={25}
          fadeStrength={0.8}
          infiniteGrid={false}
          followCamera={false}
        />
        
        {/* Eixos de coordenadas com melhor posicionamento */}
        <Text
          position={[6, 0.2, 0]}
          fontSize={0.3}
          color="red"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          X
        </Text>
        <Text
          position={[0.2, 6, 0]}
          fontSize={0.3}
          color="green"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          Y
        </Text>
        <Text
          position={[0, 0.2, 6]}
          fontSize={0.3}
          color="blue"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          Z
        </Text>
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
          maxPolarAngle={Math.PI * 0.9}
          minPolarAngle={Math.PI * 0.1}
          enableDamping={true}
          dampingFactor={0.03}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Revolution3D;
