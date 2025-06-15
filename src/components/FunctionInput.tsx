
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, RotateCcw, Plus, Minus } from 'lucide-react';

interface FunctionInputProps {
  onFunctionChange: (func1: string, func2: string | null, xMin: number, xMax: number) => void;
  onGenerateRevolution: () => void;
}

const FunctionInput = ({ onFunctionChange, onGenerateRevolution }: FunctionInputProps) => {
  const [function1, setFunction1] = useState('x^2');
  const [function2, setFunction2] = useState('');
  const [showSecondFunction, setShowSecondFunction] = useState(false);

  // Valores padrão fixos para visualização
  const getDefaultRange = (func: string) => {
    if (func.includes('sin') || func.includes('cos') || func.includes('tan')) {
      return { min: -2 * Math.PI, max: 2 * Math.PI };
    }
    if (func.includes('exp')) {
      return { min: -3, max: 3 };
    }
    if (func.includes('sqrt') || func.includes('log')) {
      return { min: 0.1, max: 10 };
    }
    return { min: -5, max: 5 };
  };

  const handleSubmit = () => {
    const range = getDefaultRange(function1);
    onFunctionChange(
      function1, 
      showSecondFunction && function2.trim() ? function2 : null, 
      range.min, 
      range.max
    );
  };

  const presetFunctions = [
    { name: 'Parábola', func: 'x^2' },
    { name: 'Cúbica', func: 'x^3' },
    { name: 'Seno', func: 'sin(x)' },
    { name: 'Cosseno', func: 'cos(x)' },
    { name: 'Tangente', func: 'tan(x)' },
    { name: 'Exponencial', func: 'exp(x)' },
    { name: 'Logaritmo', func: 'log(x)' },
    { name: 'Raiz Quadrada', func: 'sqrt(x)' },
    { name: 'Valor Absoluto', func: 'abs(x)' },
    { name: 'Polinômio', func: 'x^3 - 3*x + 2' },
    { name: 'Senoidal', func: '2*sin(x) + 1' },
    { name: 'Exponencial Decrescente', func: 'exp(-x)' },
    { name: 'Parábola Invertida', func: '-x^2 + 4' },
    { name: 'Função Racional', func: '1/x' },
    { name: 'Função Mista', func: 'x^2 + sin(x)' },
    { name: 'Onda Complexa', func: 'sin(x) + cos(2*x)' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Funções Matemáticas</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="function1">f(x) =</Label>
          <Input
            id="function1"
            value={function1}
            onChange={(e) => setFunction1(e.target.value)}
            placeholder="Ex: x^2 + 2*x + 1, sin(x), exp(x)"
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSecondFunction(!showSecondFunction)}
          >
            {showSecondFunction ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showSecondFunction ? 'Remover' : 'Adicionar'} segunda função
          </Button>
        </div>

        {showSecondFunction && (
          <div>
            <Label htmlFor="function2">g(x) =</Label>
            <Input
              id="function2"
              value={function2}
              onChange={(e) => setFunction2(e.target.value)}
              placeholder="Ex: x + 2, cos(x), sqrt(x)"
              className="mt-1"
            />
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Plotar Gráfico
          </Button>
          <Button onClick={onGenerateRevolution} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Sólido de Revolução
          </Button>
        </div>

        <div>
          <Label className="text-sm text-gray-600">Funções Pré-definidas:</Label>
          <div className="grid grid-cols-2 gap-1 mt-2 max-h-48 overflow-y-auto">
            {presetFunctions.map((preset) => (
              <Button
                key={preset.name}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFunction1(preset.func);
                }}
                className="text-left justify-start text-xs h-8"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionInput;
