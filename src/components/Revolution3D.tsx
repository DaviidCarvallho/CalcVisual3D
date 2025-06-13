
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface Revolution3DProps {
  functionStr: string;
  xMin: number;
  xMax: number;
  showRevolution: boolean;
}

const RevolutionMesh = ({ functionStr, xMin, xMax, showRevolution }: Revolution3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const evaluateFunction = (x: number) => {
      try {
        let expr = functionStr
          .replace(/\^/g, '**')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/exp/g, 'Math.exp')
          .replace(/log/g, 'Math.log')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/x/g, `(${x})`);
        
        return Math.abs(eval(expr));
      } catch {
        return 0;
      }
    };

    if (showRevolution) {
      // Criar geometria do sólido de revolução
      const points = [];
      const segments = 50;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(x);
        if (!isNaN(y) && isFinite(y) && y >= 0) {
          points.push(new THREE.Vector2(y, x));
        }
      }

      const geometry = new THREE.LatheGeometry(points, 32);
      return geometry;
    } else {
      // Criar linha da função
      const points = [];
      const segments = 100;
      const step = (xMax - xMin) / segments;

      for (let i = 0; i <= segments; i++) {
        const x = xMin + i * step;
        const y = evaluateFunction(x);
        if (!isNaN(y) && isFinite(y)) {
          points.push(new THREE.Vector3(x, y, 0));
        }
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
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
        <mesh ref={meshRef} geometry={geometry}>
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        <line geometry={geometry}>
          <lineBasicMaterial color="#3b82f6" linewidth={3} />
        </line>
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
      
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <RevolutionMesh {...props} />
        
        {/* Grid de referência */}
        <Grid 
          args={[20, 20]} 
          position={[0, -2, 0]} 
          cellColor="white" 
          sectionColor="white"
          fadeDistance={30}
          fadeStrength={1}
        />
        
        {/* Eixos de coordenadas */}
        <Text
          position={[5, 0, 0]}
          fontSize={0.5}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
        <Text
          position={[0, 5, 0]}
          fontSize={0.5}
          color="green"
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
        <Text
          position={[0, 0, 5]}
          fontSize={0.5}
          color="blue"
          anchorX="center"
          anchorY="middle"
        >
          Z
        </Text>
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default Revolution3D;
