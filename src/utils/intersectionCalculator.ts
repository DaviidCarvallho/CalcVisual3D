
import { evaluateFunction } from './mathParser';

export interface IntersectionPoint {
  x: number;
  y: number;
}

export const findIntersections = (
  function1: string,
  function2: string,
  xMin: number,
  xMax: number,
  tolerance: number = 0.001
): IntersectionPoint[] => {
  const intersections: IntersectionPoint[] = [];
  const segments = 2000; // Aumentar precisão
  const step = (xMax - xMin) / segments;
  
  let prevDiff = null;
  let prevX = null;
  
  for (let i = 0; i <= segments; i++) {
    const x = xMin + i * step;
    const y1 = evaluateFunction(function1, x);
    const y2 = evaluateFunction(function2, x);
    
    if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
      const diff = y1 - y2;
      
      // Detectar mudança de sinal (interseção)
      if (prevDiff !== null && prevX !== null) {
        const signChanged = Math.sign(diff) !== Math.sign(prevDiff);
        const significantDiff = Math.abs(diff) > tolerance || Math.abs(prevDiff) > tolerance;
        
        if (signChanged && significantDiff) {
          // Usar bisseção para refinar a interseção
          const refinedX = refineBisection(function1, function2, prevX, x, tolerance);
          const refinedY = evaluateFunction(function1, refinedX);
          
          if (!isNaN(refinedY) && isFinite(refinedY)) {
            intersections.push({
              x: Number(refinedX.toFixed(6)),
              y: Number(refinedY.toFixed(6))
            });
          }
        }
      }
      
      prevDiff = diff;
      prevX = x;
    }
  }
  
  // Remover interseções muito próximas (duplicatas)
  const filteredIntersections = [];
  for (const intersection of intersections) {
    const isDuplicate = filteredIntersections.some(existing => 
      Math.abs(existing.x - intersection.x) < 0.01
    );
    if (!isDuplicate) {
      filteredIntersections.push(intersection);
    }
  }
  
  console.log('Interseções encontradas:', filteredIntersections);
  return filteredIntersections;
};

const refineBisection = (
  function1: string,
  function2: string,
  xStart: number,
  xEnd: number,
  tolerance: number,
  maxIterations: number = 100
): number => {
  let left = xStart;
  let right = xEnd;
  
  for (let i = 0; i < maxIterations; i++) {
    const mid = (left + right) / 2;
    const y1Mid = evaluateFunction(function1, mid);
    const y2Mid = evaluateFunction(function2, mid);
    const diffMid = y1Mid - y2Mid;
    
    if (Math.abs(diffMid) < tolerance) {
      return mid;
    }
    
    const y1Left = evaluateFunction(function1, left);
    const y2Left = evaluateFunction(function2, left);
    const diffLeft = y1Left - y2Left;
    
    if (Math.sign(diffLeft) === Math.sign(diffMid)) {
      left = mid;
    } else {
      right = mid;
    }
    
    // Evitar loop infinito
    if (Math.abs(right - left) < tolerance) {
      break;
    }
  }
  
  return (left + right) / 2;
};
