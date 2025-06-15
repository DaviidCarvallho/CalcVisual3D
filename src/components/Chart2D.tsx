
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { evaluateFunction } from '@/utils/mathParser';

interface Chart2DProps {
  function1: string;
  function2?: string | null;
  xMin: number;
  xMax: number;
}

const Chart2D = ({ function1, function2, xMin, xMax }: Chart2DProps) => {
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
        }
        
        points.push(point);
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    return points;
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  // Calcular limites dos eixos Y dinamicamente, sempre incluindo o zero
  const { yMin, yMax } = useMemo(() => {
    if (data.length === 0) return { yMin: -5, yMax: 5 };
    
    const allYValues = data.flatMap(point => {
      const values = [point.y1];
      if (point.y2 !== undefined) values.push(point.y2);
      return values;
    });
    
    const min = Math.min(...allYValues, 0); // Sempre incluir o zero
    const max = Math.max(...allYValues, 0); // Sempre incluir o zero
    const range = max - min || 1;
    const padding = range * 0.1;
    
    return {
      yMin: min - padding,
      yMax: max + padding
    };
  }, [data]);

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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          <span className="text-blue-600">f(x) = {function1}</span>
          {hasSecondFunction && (
            <span className="block text-sm text-red-600 mt-1">
              g(x) = {function2}
            </span>
          )}
        </h3>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
            <XAxis 
              dataKey="x" 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#6366f1' }}
              tickLine={{ stroke: '#6366f1' }}
              domain={[xMin, xMax]}
              type="number"
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#6366f1' }}
              tickLine={{ stroke: '#6366f1' }}
              domain={[yMin, yMax]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toFixed(3), 
                name === 'y1' ? 'f(x)' : 'g(x)'
              ]}
              labelFormatter={(value: number) => `x = ${value.toFixed(3)}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e7ff',
                borderRadius: '8px'
              }}
            />
            
            {/* Primeira função - sempre presente */}
            <Line 
              type="monotone" 
              dataKey="y1" 
              stroke="#2563eb" 
              strokeWidth={2.5}
              dot={false}
              name="f(x)"
              strokeOpacity={0.9}
            />
            
            {/* Segunda função - apenas se existir */}
            {hasSecondFunction && (
              <Line 
                type="monotone" 
                dataKey="y2" 
                stroke="#dc2626" 
                strokeWidth={2.5}
                dot={false}
                name="g(x)"
                strokeOpacity={0.9}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        {hasSecondFunction ? 'Visualização de duas funções matemáticas' : 'Gráfico da função matemática'}
      </div>
    </div>
  );
};

export default Chart2D;
