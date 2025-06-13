
import React from 'react';
import { Calculator, BarChart3, MessageCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calculator className="h-8 w-8 text-blue-300" />
          <h1 className="text-2xl font-bold">CalcViz 3D</h1>
          <span className="text-blue-300 text-sm">Visualizador de Matemática</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-blue-300">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm">Gráficos & Sólidos</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-300">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Chat IA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
