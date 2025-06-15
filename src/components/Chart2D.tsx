import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { evaluateFunction } from '@/utils/mathParser';
import { calculateAreaBetweenCurves, calculateAreaValue } from '@/utils/areaCalculations';

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
          // Para área entre curvas
          point.upperY = Math.max(y1, y2);
          point.lowerY = Math.min(y1, y2);
          point.areaDiff = Math.abs(y1 - y2);
        }
        
        points.push(point);
      }
    }
    
    console.log(`Gerados ${points.length} pontos para o gráfico`);
    return points;
  }, [function1, function2, xMin, xMax]);

  const hasSecondFunction = function2 && function2.trim() !== '';

  // Calcular área entre as curvas
  const areaValue = useMemo(() => {
    if (!hasSecondFunction) return null;
    
    const areaPoints = calculateAreaBetweenCurves(function1, function2!, xMin, xMax);
    return calculateAreaValue(areaPoints, xMin, xMax);
  }, [function1, function2, xMin, xMax, hasSecondFunction]);

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
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 h-96">
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
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="mb-3">
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
        {hasSecondFunction && areaValue && (
          <p className="text-xs text-green-600 mt-1">
            Área entre as curvas: {areaValue.toFixed(3)} unidades²
          </p>
        )}
      </div>
      
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {hasSecondFunction ? (
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
              
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
              
              {xMin <= 0 && xMax >= 0 && (
                <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1} />
              )}
              
              {[function1, function2].filter(Boolean).some(f => f.includes('sin') || f.includes('cos')) && (
                <>
                  <ReferenceLine y={1} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
                  <ReferenceLine y={-1} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
                </>
              )}
              
              <XAxis 
                dataKey="x" 
                stroke="#6366f1"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
                tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
                domain={[xMin, xMax]}
                type="number"
                tickFormatter={(value) => formatAxisValue(value, true)}
                ticks={[xMin, xMin + (xMax-xMin)/4, xMin + (xMax-xMin)/2, xMin + 3*(xMax-xMin)/4, xMax]}
              />
              <YAxis 
                stroke="#6366f1"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
                tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
                domain={[yMin, yMax]}
                tickFormatter={(value) => formatAxisValue(value)}
                ticks={generateYTicks}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatAxisValue(value), 
                  name === 'y1' ? 'f(x)' : name === 'y2' ? 'g(x)' : 'Área'
                ]}
                labelFormatter={(value: number) => `x = ${formatAxisValue(value, true)}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e0e7ff',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
              />
              
              {/* Área entre as curvas */}
              <Area 
                type="monotone" 
                dataKey="upperY" 
                stackId="1"
                stroke="none"
                fill="rgba(34, 197, 94, 0.2)"
                fillOpacity={0.4}
              />
              <Area 
                type="monotone" 
                dataKey="lowerY" 
                stackId="1"
                stroke="none"
                fill="rgba(255, 255, 255, 1)"
                fillOpacity={1}
              />
              
              {/* Linhas das funções */}
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
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e0e7ff" />
              
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
              
              {xMin <= 0 && xMax >= 0 && (
                <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1} />
              )}
              
              {[function1, function2].filter(Boolean).some(f => f.includes('sin') || f.includes('cos')) && (
                <>
                  <ReferenceLine y={1} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
                  <ReferenceLine y={-1} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
                </>
              )}
              
              <XAxis 
                dataKey="x" 
                stroke="#6366f1"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
                tickLine={{ stroke: '#6366f1', strokeWidth: 1 }}
                domain={[xMin, xMax]}
                type="number"
                tickFormatter={(value) => formatAxisValue(value, true)}
                ticks={[xMin, xMin + (xMax-xMin)/4, xMin + (xMax-xMin)/2, xMin + 3*(xMax-xMin)/4, xMax]}
              />
              <YAxis 
                stroke="#6366f1"
                tick={{ fontSize: 11 }}
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
                  fontSize: '11px'
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
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        {hasSecondFunction ? 'Visualização da área entre duas funções matemáticas' : 'Visualização da função matemática'}
      </div>
    </div>
  );
};

export default Chart2D;
