
export const parseMathFunction = (functionStr: string): string => {
  // Normalizar a função para JavaScript
  let expr = functionStr
    .toLowerCase()
    .trim()
    // Substituir operadores matemáticos
    .replace(/\^/g, '**')
    .replace(/\*\*/g, '**')
    // Substituir funções trigonométricas
    .replace(/\bsin\b/g, 'Math.sin')
    .replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan')
    // Substituir outras funções matemáticas
    .replace(/\bexp\b/g, 'Math.exp')
    .replace(/\blog\b/g, 'Math.log')
    .replace(/\bln\b/g, 'Math.log')
    .replace(/\bsqrt\b/g, 'Math.sqrt')
    .replace(/\babs\b/g, 'Math.abs')
    // Adicionar multiplicação implícita
    .replace(/(\d+)([a-z])/g, '$1*$2')
    .replace(/([a-z])(\d+)/g, '$1*$2')
    .replace(/\)([a-z])/g, ')*$1')
    .replace(/([a-z])\(/g, '$1*(')
    // Substituir x² por x**2
    .replace(/x²/g, 'x**2')
    .replace(/x³/g, 'x**3');
  
  return expr;
};

export const evaluateFunction = (functionStr: string, x: number): number => {
  try {
    const expr = parseMathFunction(functionStr).replace(/x/g, `(${x})`);
    return eval(expr);
  } catch (error) {
    console.error('Erro ao avaliar função:', error);
    return NaN;
  }
};
