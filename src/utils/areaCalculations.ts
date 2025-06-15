
import { evaluateFunction } from './mathParser';

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
  segments: number = 300
): AreaPoint[] => {
  const points: AreaPoint[] = [];
  const step = (xMax - xMin) / segments;
  
  for (let i = 0; i <= segments; i++) {
    const x = xMin + i * step;
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
  
  return points;
};

export const calculateAreaValue = (points: AreaPoint[], xMin: number, xMax: number): number => {
  if (points.length < 2) return 0;
  
  let area = 0;
  const step = (xMax - xMin) / (points.length - 1);
  
  // Usar regra do trapézio para aproximar a integral
  for (let i = 0; i < points.length - 1; i++) {
    const height1 = Math.abs(points[i].upperY - points[i].lowerY);
    const height2 = Math.abs(points[i + 1].upperY - points[i + 1].lowerY);
    area += (height1 + height2) * step / 2;
  }
  
  return area;
};
