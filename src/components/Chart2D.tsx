
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Chart2DProps {
  functionStr: string;
  xMin: number;
  xMax: number;
}

const Chart2D = ({ functionStr, xMin, xMax }: Chart2DProps) => {
  const data = useMemo(() => {
    const points = [];
    const step = (xMax - xMin) / 200;
    
    const evaluateFunction = (x: number) => {
      try {
        // Simple function parser - em produção seria melhor usar uma biblioteca como math.js
        let expr = functionStr
          .replace(/\^/g, '**')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/exp/g, 'Math.exp')
          .replace(/log/g, 'Math.log')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/x/g, `(${x})`);
        
        return eval(expr);
      } catch {
        return 0;
      }
    };

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(x);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
      }
    }
    
    return points;
  }, [functionStr, xMin, xMax]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-96">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Gráfico 2D: f(x) = {functionStr}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
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
            dataKey="y" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart2D;
