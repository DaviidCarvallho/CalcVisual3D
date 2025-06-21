
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move3D } from 'lucide-react';

interface DomainSliderProps {
  xMin: number;
  xMax: number;
  onDomainChange: (min: number, max: number) => void;
}

const DomainSlider = ({ xMin, xMax, onDomainChange }: DomainSliderProps) => {
  const minRange = -10;
  const maxRange = 10;

  const handleMinChange = (value: number[]) => {
    const newMin = value[0];
    if (newMin < xMax) {
      onDomainChange(newMin, xMax);
    }
  };

  const handleMaxChange = (value: number[]) => {
    const newMax = value[0];
    if (newMax > xMin) {
      onDomainChange(xMin, newMax);
    }
  };

  const formatValue = (value: number) => {
    if (Math.abs(value - Math.PI) < 0.01) return 'π';
    if (Math.abs(value + Math.PI) < 0.01) return '-π';
    if (Math.abs(value - 2 * Math.PI) < 0.01) return '2π';
    if (Math.abs(value + 2 * Math.PI) < 0.01) return '-2π';
    return value.toFixed(1);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800 text-sm">
          <Move3D className="h-4 w-4" />
          Controle de Domínio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs font-medium text-purple-700 mb-2 block">
            X Mínimo: {formatValue(xMin)}
          </Label>
          <Slider
            value={[xMin]}
            onValueChange={handleMinChange}
            min={minRange}
            max={maxRange}
            step={0.1}
            className="w-full"
          />
        </div>
        
        <div>
          <Label className="text-xs font-medium text-purple-700 mb-2 block">
            X Máximo: {formatValue(xMax)}
          </Label>
          <Slider
            value={[xMax]}
            onValueChange={handleMaxChange}
            min={minRange}
            max={maxRange}
            step={0.1}
            className="w-full"
          />
        </div>
        
        <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded border border-purple-200">
          <strong>Domínio atual:</strong> [{formatValue(xMin)}, {formatValue(xMax)}]
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainSlider;
