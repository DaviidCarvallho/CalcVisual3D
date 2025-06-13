
import React, { useState } from 'react';
import Header from '@/components/Header';
import FunctionInput from '@/components/FunctionInput';
import Chart2D from '@/components/Chart2D';
import Revolution3D from '@/components/Revolution3D';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  const [functionStr, setFunctionStr] = useState('x^2');
  const [xMin, setXMin] = useState(-3);
  const [xMax, setXMax] = useState(3);
  const [showRevolution, setShowRevolution] = useState(false);

  const handleFunctionChange = (func: string, min: number, max: number) => {
    setFunctionStr(func);
    setXMin(min);
    setXMax(max);
    setShowRevolution(false);
  };

  const handleGenerateRevolution = () => {
    setShowRevolution(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de controles */}
          <div className="space-y-6">
            <FunctionInput
              onFunctionChange={handleFunctionChange}
              onGenerateRevolution={handleGenerateRevolution}
            />
            
            {/* Informações matemáticas */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                Conceitos Matemáticos
              </h3>
              <div className="space-y-3 text-sm text-indigo-700">
                <div>
                  <strong>Função atual:</strong> f(x) = {functionStr}
                </div>
                <div>
                  <strong>Domínio:</strong> [{xMin}, {xMax}]
                </div>
                {showRevolution && (
                  <div>
                    <strong>Volume do sólido:</strong> V = π∫[{xMin},{xMax}] [f(x)]² dx
                  </div>
                )}
                <div className="pt-2 text-xs text-indigo-600">
                  💡 <strong>Dica:</strong> Experimente funções como sin(x), x^3, sqrt(x) ou exp(x)
                </div>
              </div>
            </div>
          </div>

          {/* Visualizações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico 2D */}
            <Chart2D
              functionStr={functionStr}
              xMin={xMin}
              xMax={xMax}
            />

            {/* Visualização 3D */}
            <Revolution3D
              functionStr={functionStr}
              xMin={xMin}
              xMax={xMax}
              showRevolution={showRevolution}
            />
          </div>

          {/* Chat */}
          <div className="lg:col-span-3">
            <ChatBot />
          </div>
        </div>

        {/* Footer com informações */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            CalcViz 3D - Visualizador interativo de funções matemáticas e sólidos de revolução
          </p>
          <p className="text-xs mt-2">
            Use as ferramentas acima para explorar conceitos de cálculo de forma visual e interativa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
