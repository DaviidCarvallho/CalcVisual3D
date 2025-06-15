
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
  const [xMin, setXMin] = useState(-3);
  const [xMax, setXMax] = useState(3);

  const handleSubmit = () => {
    onFunctionChange(
      function1, 
      showSecondFunction && function2.trim() ? function2 : null, 
      xMin, 
      xMax
    );
  };

  const presetFunctions = [
    { name: 'Parábola', func: 'x^2', min: -3, max: 3 },
    { name: 'Seno', func: 'sin(x)', min: -Math.PI, max: Math.PI },
    { name: 'Exponencial', func: 'exp(x/2)', min: -2, max: 2 },
    { name: 'Raiz', func: 'sqrt(x)', min: 0, max: 4 },
    { name: 'Polinômio', func: 'x^2 + 2*x + 1', min: -5, max: 3 },
    { name: 'Cúbica', func: 'x^3 - 3*x', min: -3, max: 3 },
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
            placeholder="Ex: x^2 + 2*x + 1"
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
              placeholder="Ex: x + 2"
              className="mt-1"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="xmin">x mínimo</Label>
            <Input
              id="xmin"
              type="number"
              value={xMin}
              onChange={(e) => setXMin(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="xmax">x máximo</Label>
            <Input
              id="xmax"
              type="number"
              value={xMax}
              onChange={(e) => setXMax(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

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
          <div className="grid grid-cols-2 gap-2 mt-2">
            {presetFunctions.map((preset) => (
              <Button
                key={preset.name}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFunction1(preset.func);
                  setXMin(preset.min);
                  setXMax(preset.max);
                }}
                className="text-left justify-start"
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
