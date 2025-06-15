import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
    const range = xMax - xMin;
    const segments = Math.max(300, Math.min(600, Math.floor(range * 60)));
    const step = (xMax - xMin) / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = xMin + i * step;
      const y1 = evaluateFunction(function1, x);
      const y2 = function2 ? evaluateFunction(function2, x) : null;
      
      if (!isNaN(y1) && isFinite(y1)) {
        const point: any = { 
          x: Number(x.toFixed(6)), 
          y1: Number(y1.toFixed(6))
        };
        
        if (y2 !== null && !isNaN(y2) && isFinite(y2)) {
          point.y2 = Number(y2.toFixed(6));
        }
        
        points.push(point);
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    return points;
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  // Calcular limites dos eixos Y com melhor lógica para incluir sempre o zero
  const { yMin, yMax } = useMemo(() => {
    if (data.length === 0) return { yMin: -5, yMax: 5 };
    
    const allYValues = data.flatMap(point => {
      const values = [point.y1];
      if (point.y2 !== undefined) values.push(point.y2);
      return values;
    });
    
    const dataMin = Math.min(...allYValues);
    const dataMax = Math.max(...allYValues);
    
    // Sempre incluir zero no domínio
    let finalMin = Math.min(dataMin, 0);
    let finalMax = Math.max(dataMax, 0);
    
    // Para funções trigonométricas, garantir que -1 e 1 estejam visíveis
    const functions = [function1, function2].filter(Boolean);
    const isTrigonometric = functions.some(f => f.includes('sin') || f.includes('cos'));
    
    if (isTrigonometric) {
      finalMin = Math.min(finalMin, -1.2);
      finalMax = Math.max(finalMax, 1.2);
    }
    
    // Se os valores estão muito próximos de zero, expandir um pouco
    if (Math.abs(finalMax - finalMin) < 0.1) {
      finalMin = Math.min(finalMin, -1);
      finalMax = Math.max(finalMax, 1);
    }
    
    const range = finalMax - finalMin;
    const padding = range * 0.1;
    
    return {
      yMin: finalMin - padding,
      yMax: finalMax + padding
    };
  }, [data, function1, function2]);

  // Função para formatar valores dos eixos
  const formatAxisValue = (value: number, isX: boolean = false) => {
    if (Math.abs(value) < 0.0001) return '0';
    
    if (isX) {
      if (Math.abs(value - Math.PI) < 0.01) return 'π';
      if (Math.abs(value + Math.PI) < 0.01) return '-π';
      if (Math.abs(value - 2 * Math.PI) < 0.01) return '2π';
      if (Math.abs(value + 2 * Math.PI) < 0.01) return '-2π';
    }
    
    if (Math.abs(value) >= 1000) return value.toExponential(1);
    if (Math.abs(value) >= 100) return value.toFixed(0);
    if (Math.abs(value) >= 10) return value.toFixed(1);
    if (Math.abs(value) >= 1) return value.toFixed(2);
    return value.toFixed(3);
  };

  // Gerar ticks personalizados para o eixo Y
  const generateYTicks = useMemo(() => {
    const functions = [function1, function2].filter(Boolean);
    const isTrigonometric = functions.some(f => f.includes('sin') || f.includes('cos'));
    
    if (isTrigonometric) {
      // Para funções trigonométricas, incluir sempre -1, 0, 1
      const baseTicks = [-1, 0, 1];
      const additionalTicks = [];
      
      // Adicionar ticks intermediários se necessário
      if (yMin < -1.5) additionalTicks.push(Math.ceil(yMin));
      if (yMax > 1.5) additionalTicks.push(Math.floor(yMax));
      
      return [...additionalTicks.filter(t => t < -1), ...baseTicks, ...additionalTicks.filter(t => t > 1)]
        .filter(t => t >= yMin && t <= yMax)
        .sort((a, b) => a - b);
    }
    
    // Para outras funções, usar lógica padrão melhorada
    const range = yMax - yMin;
    const numTicks = 5;
    const step = range / (numTicks - 1);
    
    const ticks = [];
    for (let i = 0; i < numTicks; i++) {
      ticks.push(yMin + i * step);
    }
    
    // Sempre incluir o zero se estiver no range
    if (yMin <= 0 && yMax >= 0 && !ticks.some(t => Math.abs(t) < 0.001)) {
      ticks.push(0);
      ticks.sort((a, b) => a - b);
    }
    
    return ticks;
  }, [yMin, yMax, function1, function2]);

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
        <p className="text-xs text-gray-500 mt-1">
          Domínio: [{formatAxisValue(xMin, true)}, {formatAxisValue(xMax, true)}]
        </p>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 50 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
            
            {/* Linha de referência para o eixo X (y=0) */}
            <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
            
            {/* Linha de referência para o eixo Y (x=0) se estiver no domínio */}
            {xMin <= 0 && xMax >= 0 && (
              <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1} />
            )}
            
            {/* Linhas de referência para funções trigonométricas */}
            {[function1, function2].filter(Boolean).some(f => f.includes('sin') || f.includes('cos')) && (
              <>
                <ReferenceLine y={1} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
                <ReferenceLine y={-1} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
              </>
            )}
            
            <XAxis 
              dataKey="x" 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
              tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
              domain={[xMin, xMax]}
              type="number"
              tickFormatter={(value) => formatAxisValue(value, true)}
              ticks={[xMin, xMin + (xMax-xMin)/4, xMin + (xMax-xMin)/2, xMin + 3*(xMax-xMin)/4, xMax]}
            />
            <YAxis 
              stroke="#6366f1"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
              tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
              domain={[yMin, yMax]}
              tickFormatter={(value) => formatAxisValue(value)}
              ticks={generateYTicks}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatAxisValue(value), 
                name === 'y1' ? 'f(x)' : 'g(x)'
              ]}
              labelFormatter={(value: number) => `x = ${formatAxisValue(value, true)}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e7ff',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            
            {/* Primeira função */}
            <Line 
              type="monotone" 
              dataKey="y1" 
              stroke="#2563eb" 
              strokeWidth={2.5}
              dot={false}
              name="f(x)"
              strokeOpacity={1}
              connectNulls={false}
            />
            
            {/* Segunda função */}
            {hasSecondFunction && (
              <Line 
                type="monotone" 
                dataKey="y2" 
                stroke="#dc2626" 
                strokeWidth={2.5}
                dot={false}
                name="g(x)"
                strokeOpacity={1}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        {hasSecondFunction ? 'Comparação entre duas funções matemáticas' : 'Visualização da função matemática'}
      </div>
    </div>
  );
};

export default Chart2D;
