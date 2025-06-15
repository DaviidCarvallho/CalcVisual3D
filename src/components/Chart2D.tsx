
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
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

  const data = useMemo(() => {
    console.log('Gerando dados do gráfico:', { function1, function2, xMin, xMax });
    
    if (!function1 || typeof function1 !== 'string') {
      console.error('function1 é inválida:', function1);
      return [];
    }
    
    if (typeof xMin !== 'number' || typeof xMax !== 'number' || xMin >= xMax) {
      console.error('Parâmetros xMin/xMax inválidos:', { xMin, xMax });
      return [];
    }

    const points = [];
    const segments = 200;
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
          // Calcular área absoluta entre as funções para melhor visualização
          point.area = Math.abs(y1 - y2);
        }
        
        points.push(point);
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    return points;
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  // Calcular limites dos eixos dinamicamente para melhor visualização
  const { yMin, yMax } = useMemo(() => {
    if (data.length === 0) return { yMin: -5, yMax: 5 };
    
    const allYValues = data.flatMap(point => {
      const values = [point.y1];
      if (point.y2 !== undefined) values.push(point.y2);
      return values;
    });
    
    const min = Math.min(...allYValues);
    const max = Math.max(...allYValues);
    const range = max - min;
    const padding = range * 0.1; // 10% de padding
    
    return {
      yMin: min - padding,
      yMax: max + padding
    };
  }, [data]);

  const effectiveXMin = (xMin / zoomLevel) + panX;
  const effectiveXMax = (xMax / zoomLevel) + panX;
  const effectiveYMin = (yMin / zoomLevel) + panY;
  const effectiveYMax = (yMax / zoomLevel) + panY;

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
                domain={[effectiveYMin, effectiveYMax]}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value.toFixed(3), 
                  name === 'y1' ? 'f(x)' : name === 'y2' ? 'g(x)' : 'Diferença entre funções'
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
                fill="rgba(255, 165, 0, 0.2)"
                fillOpacity={0.4}
                strokeWidth={0}
              />
              <Line 
                type="monotone" 
                dataKey="y1" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={false}
                name="f(x)"
              />
              <Line 
                type="monotone" 
                dataKey="y2" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={false}
                name="g(x)"
              />
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
                domain={[effectiveYMin, effectiveYMax]}
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
                strokeWidth={3}
                dot={false}
                name="f(x)"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Zoom: {zoomLevel.toFixed(1)}x | {hasSecondFunction ? 'Área entre funções visualizada em laranja' : 'Use os controles de zoom para explorar'}
      </div>
    </div>
  );
};

export default Chart2D;
