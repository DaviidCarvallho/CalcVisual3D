
import React, { useState } from 'react';
import Header from '@/components/Header';
import FunctionInput from '@/components/FunctionInput';
import Chart2D from '@/components/Chart2D';
import Revolution3D from '@/components/Revolution3D';
import ChatBot from '@/components/ChatBot';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [function1, setFunction1] = useState('x^2');
  const [function2, setFunction2] = useState<string | null>(null);
  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [showRevolution, setShowRevolution] = useState(false);
  const [integralLowerLimit, setIntegralLowerLimit] = useState(-2);
  const [integralUpperLimit, setIntegralUpperLimit] = useState(2);
  
  // Estados para controlar a visibilidade dos elementos 3D
  const [showBlueSurface, setShowBlueSurface] = useState(true);
  const [showRedSurface, setShowRedSurface] = useState(true);
  const [showFunctionLines, setShowFunctionLines] = useState(true);

  const handleFunctionChange = (func1: string, func2: string | null, min: number, max: number) => {
    setFunction1(func1);
    setFunction2(func2);
    setXMin(min);
    setXMax(max);
    setShowRevolution(false);
  };

  const handleDomainChange = (min: number, max: number) => {
    setXMin(min);
    setXMax(max);
    setShowRevolution(false);
  };

  const handleIntegralLimitsChange = (lowerLimit: number, upperLimit: number) => {
    setIntegralLowerLimit(lowerLimit);
    setIntegralUpperLimit(upperLimit);
  };

  const handleGenerateRevolution = () => {
    setShowRevolution(true);
  };

  const getDomainText = () => {
    if (xMin === -2 * Math.PI && xMax === 2 * Math.PI) {
      return '[-2π, 2π]';
    }
    return `[${xMin.toFixed(1)}, ${xMax.toFixed(1)}]`;
  };

  const hasSecondFunction = function2 && function2.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de controles */}
          <div className="lg:col-span-1 space-y-6">
            <FunctionInput
              onFunctionChange={handleFunctionChange}
              onGenerateRevolution={handleGenerateRevolution}
              onIntegralLimitsChange={handleIntegralLimitsChange}
            />
            
            {/* Controles de visibilidade 3D */}
            {showRevolution && hasSecondFunction && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">
                  Controles de Visualização 3D
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="red-surface"
                      checked={showRedSurface}
                      onCheckedChange={setShowRedSurface}
                    />
                    <Label 
                      htmlFor="red-surface" 
                      className="text-sm font-medium text-purple-700 cursor-pointer"
                    >
                      Superfície Externa (Vermelha)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="blue-surface"
                      checked={showBlueSurface}
                      onCheckedChange={setShowBlueSurface}
                    />
                    <Label 
                      htmlFor="blue-surface" 
                      className="text-sm font-medium text-purple-700 cursor-pointer"
                    >
                      Superfície Interna (Azul)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="function-lines"
                      checked={showFunctionLines}
                      onCheckedChange={setShowFunctionLines}
                    />
                    <Label 
                      htmlFor="function-lines" 
                      className="text-sm font-medium text-purple-700 cursor-pointer"
                    >
                      Linhas das Funções
                    </Label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Informações matemáticas */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
              
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                Conceitos Matemáticos
              </h3>
              <div className="space-y-3 text-sm text-indigo-700">
                <div>
                  <strong>Função principal:</strong> f(x) = {function1}
                </div>
                {function2 && (
                  <div>
                    <strong>Segunda função:</strong> g(x) = {function2}
                  </div>
                )}
                <div>
                  <strong>Domínio:</strong> {getDomainText()}
                </div>
                <div>
                  <strong>Integral definida:</strong> ∫[{integralLowerLimit}, {integralUpperLimit}] f(x) dx
                </div>
                {showRevolution && !function2 && (
                  <div>
                    <strong>Volume do sólido:</strong> V = π∫[{integralLowerLimit.toFixed(1)},{integralUpperLimit.toFixed(1)}] [f(x)]² dx
                  </div>
                )}
                {function2 && (
                  <div>
                    <strong>Área entre funções:</strong> A = ∫[{xMin.toFixed(1)},{xMax.toFixed(1)}] |f(x) - g(x)| dx
                  </div>
                )}
                <div className="pt-2 text-xs text-indigo-600">
                  💡 <strong>Dica:</strong> {function2 ? 'Visualize a área colorida entre as duas funções!' : 'Experimente funções como sin(x), exp(x), x^3 - 3*x, sqrt(x)'}
                </div>
              </div>
            </div>
          </div>

          {/* Visualizações */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gráfico 2D */}
            <Chart2D
              function1={function1}
              function2={function2}
              xMin={xMin}
              xMax={xMax}
              integralLowerLimit={integralLowerLimit}
              integralUpperLimit={integralUpperLimit}
              onDomainChange={handleDomainChange}
            />

            {/* Visualização 3D */}
            <div className="h-[500px]">
              <Revolution3D
                functionStr={function1}
                function2={function2}
                xMin={xMin}
                xMax={xMax}
                showRevolution={showRevolution}
                showBlueSurface={showBlueSurface}
                showRedSurface={showRedSurface}
                showFunctionLines={showFunctionLines}
                integralLowerLimit={integralLowerLimit}
                integralUpperLimit={integralUpperLimit}
              />
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-4">
            <ChatBot />
          </div>
        </div>

        {/* Footer com informações */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            CalcVisual 3D - Visualizador interativo de funções para cálculo e sólidos de revolução
          </p>
          <p className="text-xs mt-2">
            Trabalho desenvolvido para segunda avaliação da disciplina de Cálculo II - Prof Janaina.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
