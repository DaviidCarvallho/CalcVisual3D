import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { evaluateFunction } from '@/utils/mathParser';
import { calculateAreaBetweenCurves } from '@/utils/areaCalculations';

interface Revolution3DProps {
  functionStr: string;
  function2?: string | null;
  xMin: number;
  xMax: number;
  showRevolution: boolean;
}

const RegionMesh = ({ functionStr, function2, xMin, xMax, showRevolution }: Revolution3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const hasSecondFunction = function2 && function2.trim() !== '';

  const { geometry, secondGeometry, regionGeometry } = useMemo(() => {
    if (showRevolution && !hasSecondFunction) {
      // Lógica original para sólido de revolução de uma função
      const points = [];
      const segments = 100;
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
      
      return { geometry, secondGeometry: null, regionGeometry: null };
    } else if (hasSecondFunction) {
      // Criar área 3D entre duas funções com possível sólido de revolução
      const areaResult = calculateAreaBetweenCurves(functionStr, function2, xMin, xMax);
      const effectiveXMin = areaResult.effectiveXMin;
      const effectiveXMax = areaResult.effectiveXMax;
      
      console.log('Criando área 3D para funções:', effectiveXMin, effectiveXMax);
      
      const segments = 80;
      const step = (effectiveXMax - effectiveXMin) / segments;
      
      // Criar geometria da área no plano XZ (alinhada com as linhas das funções)
      const areaVertices = [];
      const areaIndices = [];
      const areaUvs = [];
      
      for (let i = 0; i <= segments; i++) {
        const x = effectiveXMin + i * step;
        const y1 = evaluateFunction(functionStr, x);
        const y2 = evaluateFunction(function2, x);
        
        if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
          const scaledX = (x - effectiveXMin) / (effectiveXMax - effectiveXMin) * 4 - 2;
          const scaledY1 = Math.max(-3, Math.min(3, y1 * 0.5));
          const scaledY2 = Math.max(-3, Math.min(3, y2 * 0.5));
          
          const lowerY = Math.min(scaledY1, scaledY2);
          const upperY = Math.max(scaledY1, scaledY2);
          
          // Criar vértices para a área no plano XY (alinhado com as linhas das funções)
          const baseIndex = i * 4;
          
          // Vértices no mesmo plano das linhas das funções
          areaVertices.push(
            scaledX, lowerY, -0.01,  // inferior frente
            scaledX, upperY, -0.01,  // superior frente
            scaledX, upperY, 0.01,   // superior trás
            scaledX, lowerY, 0.01    // inferior trás
          );
          
          areaUvs.push(0, 0, 0, 1, 1, 1, 1, 0);
          
          // Criar faces do quadrilátero
          if (i > 0) {
            const prevBase = (i - 1) * 4;
            
            // Face frontal
            areaIndices.push(
              prevBase, baseIndex, prevBase + 1,
              baseIndex, baseIndex + 1, prevBase + 1
            );
            
            // Face traseira
            areaIndices.push(
              prevBase + 3, prevBase + 2, baseIndex + 3,
              prevBase + 2, baseIndex + 2, baseIndex + 3
            );
            
            // Faces superior e inferior
            areaIndices.push(
              prevBase + 1, baseIndex + 1, prevBase + 2,
              baseIndex + 1, baseIndex + 2, prevBase + 2,
              
              prevBase, prevBase + 3, baseIndex,
              prevBase + 3, baseIndex + 3, baseIndex
            );
          }
        }
      }
      
      // Criar geometria da área
      let areaGeometry = null;
      if (areaVertices.length > 0) {
        areaGeometry = new THREE.BufferGeometry();
        areaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(areaVertices, 3));
        areaGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(areaUvs, 2));
        areaGeometry.setIndex(areaIndices);
        areaGeometry.computeVertexNormals();
      }
      
      // Geometrias das linhas das funções (no mesmo plano)
      const points1 = [];
      const points2 = [];
      
      for (let i = 0; i <= segments; i++) {
        const x = effectiveXMin + i * step;
        const y1 = evaluateFunction(functionStr, x);
        const y2 = evaluateFunction(function2, x);
        
        if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
          const scaledX = (x - effectiveXMin) / (effectiveXMax - effectiveXMin) * 4 - 2;
          const scaledY1 = Math.max(-3, Math.min(3, y1 * 0.5));
          const scaledY2 = Math.max(-3, Math.min(3, y2 * 0.5));
          
          // Linhas no mesmo plano da área
          points1.push(new THREE.Vector3(scaledX, scaledY1, 0.02));
          points2.push(new THREE.Vector3(scaledX, scaledY2, 0.02));
        }
      }
      
      const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
      const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
      
      return { 
        geometry: geometry1, 
        secondGeometry: geometry2, 
        regionGeometry: areaGeometry 
      };
    } else {
      // Representação 2D de uma função no espaço 3D
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
      return { geometry, secondGeometry: null, regionGeometry: null };
    }
  }, [functionStr, function2, xMin, xMax, showRevolution, hasSecondFunction]);

  useFrame(() => {
    if (meshRef.current && showRevolution && !hasSecondFunction) {
      meshRef.current.rotation.y += 0.005;
    }
    // Rotação para área entre funções quando showRevolution está ativo
    if (groupRef.current && hasSecondFunction && showRevolution) {
      groupRef.current.rotation.x += 0.005; // Girar em torno do eixo X
    } else if (groupRef.current && hasSecondFunction && !showRevolution) {
      groupRef.current.rotation.y += 0.003; // Rotação suave quando não é revolução
    }
  });

  return (
    <group ref={groupRef}>
      {showRevolution && !hasSecondFunction ? (
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
      ) : hasSecondFunction ? (
        <>
          {/* Área entre as funções - agora alinhada corretamente */}
          {regionGeometry && (
            <mesh ref={meshRef} geometry={regionGeometry} position={[0, 0, 0]}>
              <meshStandardMaterial 
                color="#22c55e" 
                transparent 
                opacity={0.7}
                side={THREE.DoubleSide}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          )}
          
          {/* Linha da primeira função */}
          <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
            color: "#2563eb", 
            linewidth: 4 
          }))} />
          
          {/* Linha da segunda função */}
          {secondGeometry && (
            <primitive object={new THREE.Line(secondGeometry, new THREE.LineBasicMaterial({ 
              color: "#dc2626", 
              linewidth: 4 
            }))} />
          )}
        </>
      ) : (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
          color: "#3b82f6", 
          linewidth: 3 
        }))} />
      )}
    </group>
  );
};

const Revolution3D = (props: Revolution3DProps) => {
  const hasSecondFunction = props.function2 && props.function2.trim() !== '';
  
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 h-96 relative">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h3 className="text-lg font-semibold">
          {props.showRevolution && !hasSecondFunction ? 'Sólido de Revolução 3D' : 
           props.showRevolution && hasSecondFunction ? 'Sólido de Revolução da Área' :
           hasSecondFunction ? 'Área 3D entre Funções' : 'Visualização 3D'}
        </h3>
        <p className="text-sm text-gray-300">
          f(x) = {props.functionStr}
        </p>
        {hasSecondFunction && (
          <p className="text-sm text-gray-300">
            g(x) = {props.function2}
          </p>
        )}
        {props.showRevolution && (
          <p className="text-xs text-gray-400 mt-1">
            {hasSecondFunction ? 'Revolução da área em torno do eixo X' : 'Rotação em torno do eixo X'}
          </p>
        )}
        {hasSecondFunction && !props.showRevolution && (
          <p className="text-xs text-gray-400 mt-1">
            Área 3D entre as funções
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
        
        <RegionMesh {...props} />
        
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
