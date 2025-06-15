
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
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
    
    // Validar parâmetros de entrada
    if (!function1 || typeof function1 !== 'string') {
      console.error('function1 é inválida:', function1);
      return [];
    }
    
    if (typeof xMin !== 'number' || typeof xMax !== 'number' || xMin >= xMax) {
      console.error('Parâmetros xMin/xMax inválidos:', { xMin, xMax });
      return [];
    }

    const points = [];
    const step = (xMax - xMin) / 200;
    
    for (let x = xMin; x <= xMax; x += step) {
      const y1 = evaluateFunction(function1, x);
      const y2 = function2 ? evaluateFunction(function2, x) : null;
      
      if (!isNaN(y1) && isFinite(y1)) {
        const point: any = { 
          x: Number(x.toFixed(3)), 
          y1: Number(y1.toFixed(3))
        };
        
        if (y2 !== null && !isNaN(y2) && isFinite(y2)) {
          point.y2 = Number(y2.toFixed(3));
          point.area = Math.abs(y1 - y2); // Área entre as funções
        }
        
        points.push(point);
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    return points;
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

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
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-96">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Gráfico 2D: f(x) = {function1}
        {hasSecondFunction && (
          <span className="block text-sm text-gray-600 mt-1">
            g(x) = {function2}
          </span>
        )}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        {hasSecondFunction ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="x" 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toFixed(3), 
                name === 'y1' ? 'f(x)' : name === 'y2' ? 'g(x)' : 'Área'
              ]}
              labelFormatter={(value: number) => `x = ${value.toFixed(3)}`}
            />
            <Area
              type="monotone"
              dataKey="area"
              stroke="rgba(255, 165, 0, 0.8)"
              fill="rgba(255, 165, 0, 0.3)"
              fillOpacity={0.3}
            />
            <Line 
              type="monotone" 
              dataKey="y1" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="y2" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="x" 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(3), 'f(x)']}
              labelFormatter={(value: number) => `x = ${value.toFixed(3)}`}
            />
            <Line 
              type="monotone" 
              dataKey="y1" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart2D;
