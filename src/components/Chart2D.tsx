
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceDot } from 'recharts';
import { evaluateFunction } from '@/utils/mathParser';

interface Chart2DProps {
  function1: string;
  function2?: string | null;
  xMin: number;
  xMax: number;
}

const Chart2D = ({ function1, function2, xMin, xMax }: Chart2DProps) => {
  const { data, intersections } = useMemo(() => {
    console.log('Gerando dados do gráfico:', { function1, function2, xMin, xMax });
    
    // Validar parâmetros de entrada
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
          // Calcular a área entre as funções
          point.area = Math.abs(y1 - y2);
        }
        
        points.push(point);
      }
    }

    // Encontrar interseções aproximadas se há duas funções
    if (function2) {
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        if (current.y1 && current.y2 && next.y1 && next.y2) {
          // Verificar se há mudança de sinal (interseção)
          const diff1 = current.y1 - current.y2;
          const diff2 = next.y1 - next.y2;
          
          if (diff1 * diff2 <= 0 && Math.abs(diff1) < 50 && Math.abs(diff2) < 50) {
            // Aproximar o ponto de interseção
            const x_intersect = (current.x + next.x) / 2;
            const y_intersect = (current.y1 + next.y1) / 2;
            
            intersectionPoints.push({
              x: Number(x_intersect.toFixed(3)),
              y: Number(y_intersect.toFixed(3))
            });
          }
        }
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    console.log(`Encontradas ${intersectionPoints.length} interseções`);
    return { data: points, intersections: intersectionPoints };
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  // Configurar ticks dos eixos apenas para números inteiros
  const getAxisTicks = (min: number, max: number) => {
    const ticks = [];
    const start = Math.ceil(min);
    const end = Math.floor(max);
    
    for (let i = start; i <= end; i++) {
      ticks.push(i);
    }
    return ticks;
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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
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
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {hasSecondFunction ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="x" 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                ticks={getAxisTicks(xMin, xMax)}
                domain={['dataMin', 'dataMax']}
                type="number"
              />
              <YAxis 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                tickFormatter={(value) => Math.round(value).toString()}
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
              {/* Área entre as funções */}
              <Area
                type="monotone"
                dataKey="area"
                stroke="rgba(255, 165, 0, 0.8)"
                fill="rgba(255, 165, 0, 0.3)"
                fillOpacity={0.4}
                strokeWidth={0}
              />
              {/* Primeira função - linha azul */}
              <Line 
                type="monotone" 
                dataKey="y1" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={false}
                name="f(x)"
              />
              {/* Segunda função - linha vermelha */}
              <Line 
                type="monotone" 
                dataKey="y2" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={false}
                name="g(x)"
              />
              {/* Pontos de interseção */}
              {intersections.map((point, index) => (
                <ReferenceDot
                  key={index}
                  x={point.x}
                  y={point.y}
                  r={6}
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="x" 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                ticks={getAxisTicks(xMin, xMax)}
                domain={['dataMin', 'dataMax']}
                type="number"
              />
              <YAxis 
                stroke="#6366f1"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#6366f1' }}
                tickLine={{ stroke: '#6366f1' }}
                tickFormatter={(value) => Math.round(value).toString()}
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
    </div>
  );
};

export default Chart2D;
