
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, RotateCcw } from 'lucide-react';

interface FunctionInputProps {
  onFunctionChange: (func: string, xMin: number, xMax: number) => void;
  onGenerateRevolution: () => void;
}

const FunctionInput = ({ onFunctionChange, onGenerateRevolution }: FunctionInputProps) => {
  const [functionStr, setFunctionStr] = useState('x^2');
  const [xMin, setXMin] = useState(-3);
  const [xMax, setXMax] = useState(3);

  const handleSubmit = () => {
    onFunctionChange(functionStr, xMin, xMax);
  };

  const presetFunctions = [
    { name: 'Parábola', func: 'x^2', min: -3, max: 3 },
    { name: 'Seno', func: 'sin(x)', min: -Math.PI, max: Math.PI },
    { name: 'Exponencial', func: 'exp(x/2)', min: -2, max: 2 },
    { name: 'Raiz', func: 'sqrt(x)', min: 0, max: 4 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Função Matemática</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="function">f(x) =</Label>
          <Input
            id="function"
            value={functionStr}
            onChange={(e) => setFunctionStr(e.target.value)}
            placeholder="Digite sua função (ex: x^2, sin(x))"
            className="mt-1"
          />
        </div>

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
                  setFunctionStr(preset.func);
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
