
import React from 'react';
import { Calculator, BarChart3, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calculator className="h-8 w-8 text-blue-300" />
          <h1 className="text-2xl font-bold">CalcVisual 3D</h1>
          <span className="text-blue-300 text-sm">Visualizador de Funções para Cálculo</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-blue-300">
            <span className="text-sm">Autores: Murilo Leal e David Carvalho</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
