
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceDot } from 'recharts';
import { evaluateFunction } from '@/utils/mathParser';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Chart2DProps {
  function1: string;
  function2?: string | null;
  xMin: number;
  xMax: number;
}

const Chart2D = ({ function1, function2, xMin, xMax }: Chart2DProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const { data, intersections } = useMemo(() => {
    console.log('Gerando dados do gráfico:', { function1, function2, xMin, xMax });
    
    if (!function1 || typeof function1 !== 'string') {
      console.error('function1 é inválida:', function1);
      return { data: [], intersections: [] };
    }
    
    if (typeof xMin !== 'number' || typeof xMax !== 'number' || xMin >= xMax) {
      console.error('Parâmetros xMin/xMax inválidos:', { xMin, xMax });
      return { data: [], intersections: [] };
    }

    const points = [];
    const intersectionPoints = [];
    const segments = 200; // Reduzir para melhor performance
    const step = (xMax - xMin) / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = xMin + i * step;
      const y1 = evaluateFunction(function1, x);
      const y2 = function2 ? evaluateFunction(function2, x) : null;
      
      if (!isNaN(y1) && isFinite(y1)) {
        const point: any = { 
          x: Number(x.toFixed(3)), 
          y1: Number(y1.toFixed(3))
        };
        
        if (y2 !== null && !isNaN(y2) && isFinite(y2)) {
          point.y2 = Number(y2.toFixed(3));
          point.area = Math.abs(y1 - y2);
        }
        
        points.push(point);
      }
    }

    // Detecção simplificada de interseções
    if (function2) {
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        if (current.y1 !== undefined && current.y2 !== undefined && 
            next.y1 !== undefined && next.y2 !== undefined) {
          
          const diff1 = current.y1 - current.y2;
          const diff2 = next.y1 - next.y2;
          
          if (diff1 * diff2 <= 0) {
            const intersectionX = (current.x + next.x) / 2;
            const intersectionY1 = evaluateFunction(function1, intersectionX);
            const intersectionY2 = evaluateFunction(function2, intersectionX);
            
            if (!isNaN(intersectionY1) && !isNaN(intersectionY2)) {
              intersectionPoints.push({
                x: Number(intersectionX.toFixed(3)),
                y: Number(((intersectionY1 + intersectionY2) / 2).toFixed(3))
              });
            }
          }
        }
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    console.log(`Encontradas ${intersectionPoints.length} interseções`);
    return { data: points, intersections: intersectionPoints };
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  const effectiveXMin = (xMin / zoomLevel) + panX;
  const effectiveXMax = (xMax / zoomLevel) + panX;

  const getAxisTicks = (min: number, max: number, isX: boolean = true) => {
    const ticks = new Set<number>();
    ticks.add(0); // Sempre incluir zero
    
    let step = 1;
    const range = max - min;
    if (range > 20) step = Math.ceil(range / 10);
    else if (range < 5) step = 0.5;
    
    const start = Math.floor(min / step) * step;
    const end = Math.ceil(max / step) * step;
    
    for (let i = start; i <= end; i += step) {
      if (i >= min - step && i <= max + step) {
        ticks.add(Math.round(i * 100) / 100);
      }
    }
    
    return Array.from(ticks).sort((a, b) => a - b);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-96">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Gráfico 2D
        </h3>
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Erro ao gerar dados do gráfico. Verifique as funções inseridas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            <span className="text-blue-600">f(x) = {function1}</span>
            {hasSecondFunction && (
              <span className="block text-sm text-red-600 mt-1">
                g(x) = {function2}
              </span>
            )}
            {intersections.length > 0 && (
              <span className="block text-xs text-green-600 mt-1">
                {intersections.length} interseção(ões) encontrada(s)
              </span>
            )}
          </h3>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {hasSecondFunction ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
              <XAxis 
                dataKey="x" 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                domain={[effectiveXMin, effectiveXMax]}
                type="number"
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value.toFixed(3), 
                  name === 'y1' ? 'f(x)' : name === 'y2' ? 'g(x)' : 'Área entre funções'
                ]}
                labelFormatter={(value: number) => `x = ${value.toFixed(3)}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e0e7ff',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="area"
                stroke="rgba(255, 165, 0, 0.8)"
                fill="rgba(255, 165, 0, 0.3)"
                fillOpacity={0.4}
                strokeWidth={0}
              />
              <Line 
                type="monotone" 
                dataKey="y1" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
                name="f(x)"
              />
              <Line 
                type="monotone" 
                dataKey="y2" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={false}
                name="g(x)"
              />
              {intersections.map((point, index) => (
                <ReferenceDot
                  key={index}
                  x={point.x}
                  y={point.y}
                  r={4}
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
              <XAxis 
                dataKey="x" 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                domain={[effectiveXMin, effectiveXMax]}
                type="number"
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(3), 'f(x)']}
                labelFormatter={(value: number) => `x = ${value.toFixed(3)}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e0e7ff',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="y1" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
                name="f(x)"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Zoom: {zoomLevel.toFixed(1)}x | {intersections.length > 0 ? `Interseções: ${intersections.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(', ')}` : 'Use os controles de zoom para explorar'}
      </div>
    </div>
  );
};

export default Chart2D;
