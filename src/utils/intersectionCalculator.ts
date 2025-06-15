
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
  const segments = 1000;
  const step = (xMax - xMin) / segments;
  
  let prevDiff = null;
  
  for (let i = 0; i <= segments; i++) {
    const x = xMin + i * step;
    const y1 = evaluateFunction(function1, x);
    const y2 = evaluateFunction(function2, x);
    
    if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
      const diff = y1 - y2;
      
      // Detectar mudança de sinal (interseção)
      if (prevDiff !== null && Math.sign(diff) !== Math.sign(prevDiff) && Math.abs(diff) > tolerance) {
        // Usar bisseção para refinar a interseção
        const refinedX = refineBisection(function1, function2, x - step, x, tolerance);
        const refinedY = evaluateFunction(function1, refinedX);
        
        if (!isNaN(refinedY) && isFinite(refinedY)) {
          intersections.push({
            x: Number(refinedX.toFixed(6)),
            y: Number(refinedY.toFixed(6))
          });
        }
      }
      
      prevDiff = diff;
    }
  }
  
  return intersections;
};

const refineBisection = (
  function1: string,
  function2: string,
  xStart: number,
  xEnd: number,
  tolerance: number,
  maxIterations: number = 50
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
  }
  
  return (left + right) / 2;
};
