
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { evaluateFunction } from '@/utils/mathParser';
import { calculateAreaBetweenCurves, calculateAreaValue } from '@/utils/areaCalculations';

interface Chart2DProps {
  function1: string;
  function2?: string | null;
  xMin: number;
  xMax: number;
  integralLowerLimit?: number;
  integralUpperLimit?: number;
}

const Chart2D = ({ function1, function2, xMin, xMax, integralLowerLimit = -2, integralUpperLimit = 2 }: Chart2DProps) => {
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
    const segments = Math.max(100, Math.min(200, Math.floor(range * 20))); // Otimizar performance
    const step = (xMax - xMin) / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = xMin + i * step;
      const y1 = evaluateFunction(function1, x);
      const y2 = function2 ? evaluateFunction(function2, x) : null;
      
      if (!isNaN(y1) && isFinite(y1)) {
        const point: any = { 
          x: Number(x.toFixed(4)), 
          y1: Number(y1.toFixed(4))
        };
        
        if (y2 !== null && !isNaN(y2) && isFinite(y2)) {
          point.y2 = Number(y2.toFixed(4));
        }
        
        // Adicionar dados para a área da integral
        if (x >= integralLowerLimit && x <= integralUpperLimit) {
          point.integralArea = Number(y1.toFixed(4));
        }
        
        points.push(point);
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    return points;
  }, [function1, function2, xMin, xMax, integralLowerLimit, integralUpperLimit]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  // Calcular área entre as curvas e interseções
  const areaData = useMemo(() => {
    if (!hasSecondFunction) return null;
    
    const result = calculateAreaBetweenCurves(function1, function2!, xMin, xMax);
    const areaValue = calculateAreaValue(result.points, result.effectiveXMin, result.effectiveXMax);
    
    return {
      ...result,
      areaValue
    };
  }, [function1, function2, xMin, xMax, hasSecondFunction]);

  // Calcular o valor da integral definida
  const integralValue = useMemo(() => {
    if (!function1) return 0;
    
    const step = (integralUpperLimit - integralLowerLimit) / 100;
    let sum = 0;
    
    for (let i = 0; i <= 100; i++) {
      const x = integralLowerLimit + i * step;
      const y = evaluateFunction(function1, x);
      if (!isNaN(y) && isFinite(y)) {
        sum += y * step;
      }
    }
    
    return sum;
  }, [function1, integralLowerLimit, integralUpperLimit]);

  // Gerar dados corrigidos para a área entre as curvas
  const areaChartData = useMemo(() => {
    if (!areaData || !hasSecondFunction) return data;
    
    return data.map(point => {
      if (point.x >= areaData.effectiveXMin && 
          point.x <= areaData.effectiveXMax && 
          point.y2 !== undefined) {
        
        // Criar dados para área empilhada corretamente
        const lowerY = Math.min(point.y1, point.y2);
        const upperY = Math.max(point.y1, point.y2);
        const areaHeight = upperY - lowerY;
        
        return {
          ...point,
          // Dados para área empilhada: base + altura
          areaBase: Number(lowerY.toFixed(4)), // Base (função inferior)
          areaFill: Number(areaHeight.toFixed(4)) // Altura da área (diferença)
        };
      }
      return {
        ...point,
        areaBase: null,
        areaFill: null
      };
    });
  }, [data, areaData, hasSecondFunction]);

  // Calcular limites do eixo Y
  const { yMin, yMax } = useMemo(() => {
    if (data.length === 0) return { yMin: -5, yMax: 5 };
    
    const allYValues = data.flatMap(point => {
      const values = [point.y1];
      if (point.y2 !== undefined) values.push(point.y2);
      return values;
    });
    
    const dataMin = Math.min(...allYValues);
    const dataMax = Math.max(...allYValues);
    
    let finalMin = Math.min(dataMin, 0);
    let finalMax = Math.max(dataMax, 0);
    
    const functions = [function1, function2].filter(Boolean);
    const isTrigonometric = functions.some(f => f.includes('sin') || f.includes('cos'));
    
    if (isTrigonometric) {
      finalMin = Math.min(finalMin, -1.2);
      finalMax = Math.max(finalMax, 1.2);
    }
    
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

  // Formatação dos valores dos eixos
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

  // Gerar ticks para o eixo Y
  const generateYTicks = useMemo(() => {
    const functions = [function1, function2].filter(Boolean);
    const isTrigonometric = functions.some(f => f.includes('sin') || f.includes('cos'));
    
    if (isTrigonometric) {
      const baseTicks = [-1, 0, 1];
      const additionalTicks = [];
      
      if (yMin < -1.5) additionalTicks.push(Math.ceil(yMin));
      if (yMax > 1.5) additionalTicks.push(Math.floor(yMax));
      
      return [...additionalTicks.filter(t => t < -1), ...baseTicks, ...additionalTicks.filter(t => t > 1)]
        .filter(t => t >= yMin && t <= yMax)
        .sort((a, b) => a - b);
    }
    
    const range = yMax - yMin;
    const numTicks = 5;
    const step = range / (numTicks - 1);
    
    const ticks = [];
    for (let i = 0; i < numTicks; i++) {
      ticks.push(yMin + i * step);
    }
    
    if (yMin <= 0 && yMax >= 0 && !ticks.some(t => Math.abs(t) < 0.001)) {
      ticks.push(0);
      ticks.sort((a, b) => a - b);
    }
    
    return ticks;
  }, [yMin, yMax, function1, function2]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 h-96">
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
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <div className="mb-2">
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
        <p className="text-xs text-green-600 mt-1 font-semibold">
          Integral ∫[{integralLowerLimit}, {integralUpperLimit}] f(x) dx ≈ {integralValue.toFixed(3)}
        </p>
        {hasSecondFunction && areaData && (
          <p className="text-xs text-orange-600 mt-1 font-semibold">
            Área entre as curvas: {Math.abs(areaData.areaValue).toFixed(3)} unidades²
          </p>
        )}
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={areaChartData} margin={{ top: 5, right: 15, left: 15, bottom: 15 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
            
            <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={2} />
            
            {xMin <= 0 && xMax >= 0 && (
              <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={2} />
            )}
            
            {/* Limites da integral */}
            <ReferenceLine 
              x={integralLowerLimit} 
              stroke="#10b981" 
              strokeWidth={3} 
              strokeDasharray="4 4" 
            />
            <ReferenceLine 
              x={integralUpperLimit} 
              stroke="#10b981" 
              strokeWidth={3} 
              strokeDasharray="4 4" 
            />
            
            {/* Limites da área mais visíveis */}
            {areaData && (
              <>
                <ReferenceLine 
                  x={areaData.effectiveXMin} 
                  stroke="#ea580c"
                  strokeWidth={4} 
                  strokeDasharray="4 4" 
                />
                <ReferenceLine 
                  x={areaData.effectiveXMax} 
                  stroke="#ea580c" 
                  strokeWidth={4} 
                  strokeDasharray="4 4" 
                />
              </>
            )}
            
            <XAxis 
              dataKey="x" 
              stroke="#6366f1"
              tick={{ fontSize: 10 }}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
              tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
              domain={[xMin, xMax]}
              type="number"
              tickFormatter={(value) => formatAxisValue(value, true)}
              ticks={[xMin, xMin + (xMax-xMin)/4, xMin + (xMax-xMin)/2, xMin + 3*(xMax-xMin)/4, xMax]}
            />
            <YAxis 
              stroke="#6366f1"
              tick={{ fontSize: 10 }}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
              tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
              domain={[yMin, yMax]}
              tickFormatter={(value) => formatAxisValue(value)}
              ticks={generateYTicks}
            />
            <Tooltip 
              formatter={(value: any, name: string) => {
                if (typeof value !== 'number' || !isFinite(value)) {
                  return ['--', name];
                }
                
                return [
                  formatAxisValue(value), 
                  name === 'y1' ? 'f(x)' : name === 'y2' ? 'g(x)' : name === 'integralArea' ? 'Integral' : name
                ];
              }}
              labelFormatter={(value: any) => {
                if (typeof value === 'number') {
                  return `x = ${formatAxisValue(value, true)}`;
                }
                return value;
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e7ff',
                borderRadius: '8px',
                fontSize: '10px'
              }}
            />
            
            {/* Área da integral definida */}
            <Area
              type="monotone"
              dataKey="integralArea"
              stroke="none"
              fill="rgba(16, 185, 129, 0.3)"
              fillOpacity={0.5}
              connectNulls={false}
            />
            
            {/* Área base (função inferior) - invisível */}
            {hasSecondFunction && (
              <Area
                type="monotone"
                dataKey="areaBase"
                stackId="area"
                stroke="none"
                fill="transparent"
                connectNulls={false}
              />
            )}
            
            {/* Área de preenchimento (diferença entre funções) - cor laranja */}
            {hasSecondFunction && (
              <Area
                type="monotone"
                dataKey="areaFill"
                stackId="area"
                stroke="none"
                fill="rgba(234, 88, 12, 0.4)"
                fillOpacity={0.6}
                connectNulls={false}
              />
            )}
            
            {/* Linhas das funções */}
            <Line 
              type="monotone" 
              dataKey="y1" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={false}
              name="f(x)"
              strokeOpacity={1}
              connectNulls={false}
            />
            
            {hasSecondFunction && (
              <Line 
                type="monotone" 
                dataKey="y2" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={false}
                name="g(x)"
                strokeOpacity={1}
                connectNulls={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-1 text-xs text-gray-500 text-center">
        {hasSecondFunction 
          ? 'Área entre funções (laranja) delimitada automaticamente | Integral definida (verde) pelos limites configurados' 
          : 'Visualização da função matemática com área da integral definida em verde'
        }
      </div>
    </div>
  );
};

export default Chart2D;
