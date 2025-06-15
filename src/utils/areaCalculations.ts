
import { evaluateFunction } from './mathParser';
import { findIntersections } from './intersectionCalculator';

export interface AreaPoint {
  x: number;
  y1: number;
  y2: number;
  upperY: number;
  lowerY: number;
}

export const calculateAreaBetweenCurves = (
  function1: string,
  function2: string,
  xMin: number,
  xMax: number,
  segments: number = 200 // Reduzir para melhor performance
): { points: AreaPoint[], intersections: { x: number, y: number }[], effectiveXMin: number, effectiveXMax: number } => {
  // Encontrar pontos de interseção
  const intersections = findIntersections(function1, function2, xMin, xMax);
  console.log('Interseções encontradas:', intersections);
  
  // Determinar limites efetivos baseados nas interseções
  let effectiveXMin = xMin;
  let effectiveXMax = xMax;
  
  if (intersections.length >= 2) {
    // Usar o primeiro e último pontos de interseção como limites
    intersections.sort((a, b) => a.x - b.x);
    effectiveXMin = intersections[0].x;
    effectiveXMax = intersections[intersections.length - 1].x;
  } else if (intersections.length === 1) {
    // Se há apenas uma interseção, usar o ponto médio do intervalo
    const midPoint = (xMin + xMax) / 2;
    if (intersections[0].x < midPoint) {
      effectiveXMin = intersections[0].x;
    } else {
      effectiveXMax = intersections[0].x;
    }
  }
  
  const points: AreaPoint[] = [];
  const step = (effectiveXMax - effectiveXMin) / segments;
  
  for (let i = 0; i <= segments; i++) {
    const x = effectiveXMin + i * step;
    const y1 = evaluateFunction(function1, x);
    const y2 = evaluateFunction(function2, x);
    
    if (!isNaN(y1) && !isNaN(y2) && isFinite(y1) && isFinite(y2)) {
      const upperY = Math.max(y1, y2);
      const lowerY = Math.min(y1, y2);
      
      points.push({
        x: Number(x.toFixed(6)),
        y1: Number(y1.toFixed(6)),
        y2: Number(y2.toFixed(6)),
        upperY: Number(upperY.toFixed(6)),
        lowerY: Number(lowerY.toFixed(6))
      });
    }
  }
  
  return { points, intersections, effectiveXMin, effectiveXMax };
};

export const calculateAreaValue = (points: AreaPoint[], xMin: number, xMax: number): number => {
  if (points.length < 2) return 0;
  
  let area = 0;
  const step = (xMax - xMin) / (points.length - 1);
  
  // Usar regra do trapézio para aproximar a integral
  // Sempre calcular área em módulo (nunca negativa)
  for (let i = 0; i < points.length - 1; i++) {
    const height1 = Math.abs(points[i].upperY - points[i].lowerY);
    const height2 = Math.abs(points[i + 1].upperY - points[i + 1].lowerY);
    area += Math.abs((height1 + height2) * step / 2);
  }
  
  return Math.abs(area); // Garantir que a área seja sempre positiva
};
