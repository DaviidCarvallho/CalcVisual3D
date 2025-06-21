
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, RotateCcw, Sigma, Plus, Minus } from 'lucide-react';

interface FunctionInputProps {
  onFunctionChange: (func1: string, func2: string | null, min: number, max: number) => void;
  onGenerateRevolution: () => void;
  onIntegralLimitsChange?: (lowerLimit: number, upperLimit: number) => void;
}

const FunctionInput = ({ onFunctionChange, onGenerateRevolution, onIntegralLimitsChange }: FunctionInputProps) => {
  const [function1, setFunction1] = useState('x^2');
  const [function2, setFunction2] = useState('');
  const [showSecondFunction, setShowSecondFunction] = useState(false);
  const [integralLowerLimit, setIntegralLowerLimit] = useState(-2);
  const [integralUpperLimit, setIntegralUpperLimit] = useState(2);

  const handleApply = () => {
    const func2 = showSecondFunction && function2.trim() !== '' ? function2 : null;
    onFunctionChange(function1, func2, -5, 5);
    
    if (onIntegralLimitsChange) {
      onIntegralLimitsChange(integralLowerLimit, integralUpperLimit);
    }
  };

  const predefinedFunctions = [
    { name: 'Parábola', f1: 'x^2', f2: '', min: -5, max: 5 },
    { name: 'Senoide', f1: 'sin(x)', f2: '', min: -2*Math.PI, max: 2*Math.PI },
    { name: 'Exponencial', f1: 'exp(x)', f2: '', min: -2, max: 2 },
    { name: 'Área entre curvas', f1: 'x^2', f2: 'x+2', min: -2, max: 3 },
    { name: 'Raiz e Linear', f1: 'sqrt(x)', f2: 'x/2', min: 0, max: 4 }
  ];

  const handlePredefinedFunction = (preset: typeof predefinedFunctions[0]) => {
    setFunction1(preset.f1);
    setFunction2(preset.f2);
    setShowSecondFunction(preset.f2 !== '');
    
    // Aplicar automaticamente
    const func2 = preset.f2 !== '' ? preset.f2 : null;
    onFunctionChange(preset.f1, func2, preset.min, preset.max);
    
    if (onIntegralLimitsChange) {
      onIntegralLimitsChange(integralLowerLimit, integralUpperLimit);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Calculator className="h-5 w-5" />
          Entrada de Funções
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Função principal com botão aplicar */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="function1" className="text-sm font-medium text-blue-700">
              Função f(x)
            </Label>
            <Input
              id="function1"
              value={function1}
              onChange={(e) => setFunction1(e.target.value)}
              placeholder="Ex: x^2, sin(x), exp(x)"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={handleApply} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Aplicar Função
          </Button>
        </div>

        {/* Botão para mostrar/ocultar segunda função */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSecondFunction(!showSecondFunction)}
            className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {showSecondFunction ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showSecondFunction ? 'Remover Segunda Função' : 'Adicionar Segunda Função'}
          </Button>
        </div>

        {/* Segunda função (condicional) */}
        {showSecondFunction && (
          <div>
            <Label htmlFor="function2" className="text-sm font-medium text-blue-700">
              Segunda função g(x)
            </Label>
            <Input
              id="function2"
              value={function2}
              onChange={(e) => setFunction2(e.target.value)}
              placeholder="Ex: x+2, 2*x"
              className="mt-1"
            />
          </div>
        )}

        {/* Limites de Integração */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <Label className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-3">
            <Sigma className="h-4 w-4" />
            Limites de Integração
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="integralLower" className="text-xs text-green-700">
                Limite Inferior (a)
              </Label>
              <Input
                id="integralLower"
                type="number"
                value={integralLowerLimit}
                onChange={(e) => setIntegralLowerLimit(Number(e.target.value))}
                className="mt-1 text-sm"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="integralUpper" className="text-xs text-green-700">
                Limite Superior (b)
              </Label>
              <Input
                id="integralUpper"
                type="number"
                value={integralUpperLimit}
                onChange={(e) => setIntegralUpperLimit(Number(e.target.value))}
                className="mt-1 text-sm"
                step="0.1"
              />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            Integral: ∫[{integralLowerLimit}, {integralUpperLimit}] f(x) dx
          </p>
        </div>

        {/* Funções pré-definidas */}
        <div>
          <Label className="text-sm font-medium text-blue-700 mb-2 block">
            Exemplos rápidos:
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {predefinedFunctions.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePredefinedFunction(preset)}
                className="text-xs justify-start h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Botão de sólido de revolução */}
        <Button 
          onClick={onGenerateRevolution} 
          variant="secondary"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Gerar Sólido de Revolução
        </Button>

        {/* Ajuda */}
        <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded border border-blue-200">
          <strong>Sintaxe das funções:</strong>
          <br />• Potências: x^2, x^3
          <br />• Trigonométricas: sin(x), cos(x), tan(x)
          <br />• Exponencial: exp(x), log(x)
          <br />• Raiz: sqrt(x)
          <br />• Operações: +, -, *, /, (, )
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionInput;
