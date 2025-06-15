
export const parseMathFunction = (functionStr: string): string => {
  // Validar se functionStr existe e não é undefined
  if (!functionStr || typeof functionStr !== 'string') {
    console.error('parseMathFunction: functionStr é inválido:', functionStr);
    return 'x'; // Retorna uma função padrão simples
  }

  // Normalizar a função para JavaScript
  let expr = functionStr
    .toLowerCase()
    .trim()
    // Substituir operadores matemáticos primeiro
    .replace(/\^/g, '**')
    // Substituir funções matemáticas - CORRIGIDO: sem * após o nome da função
    .replace(/\bsin\s*\(/g, 'Math.sin(')
    .replace(/\bcos\s*\(/g, 'Math.cos(')
    .replace(/\btan\s*\(/g, 'Math.tan(')
    .replace(/\bexp\s*\(/g, 'Math.exp(')
    .replace(/\blog\s*\(/g, 'Math.log(')
    .replace(/\bln\s*\(/g, 'Math.log(')
    .replace(/\bsqrt\s*\(/g, 'Math.sqrt(')
    .replace(/\babs\s*\(/g, 'Math.abs(')
    // Tratar funções sem parênteses (como sin x, cos x) - CORRIGIDO
    .replace(/\bsin\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.sin($1)')
    .replace(/\bcos\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.cos($1)')
    .replace(/\btan\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.tan($1)')
    .replace(/\bexp\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.exp($1)')
    .replace(/\bsqrt\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.sqrt($1)')
    .replace(/\babs\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.abs($1)')
    .replace(/\blog\s+([x\d\.\-\+\*\/\(\)]+)/g, 'Math.log($1)')
    // Adicionar multiplicação implícita
    .replace(/(\d+)([a-z])/g, '$1*$2')
    .replace(/([a-z])(\d+)/g, '$1*$2')
    .replace(/\)([a-z])/g, ')*$1')
    .replace(/([a-z])\(/g, '$1*(')
    .replace(/(\d+)\(/g, '$1*(')
    .replace(/\)(\d+)/g, ')*$1')
    // Substituir notações especiais
    .replace(/x²/g, 'x**2')
    .replace(/x³/g, 'x**3')
    // Adicionar constantes matemáticas
    .replace(/\bpi\b/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');
  
  console.log('Função parseada:', functionStr, '->', expr);
  return expr;
};

export const evaluateFunction = (functionStr: string, x: number): number => {
  try {
    // Validar parâmetros de entrada
    if (!functionStr || typeof functionStr !== 'string') {
      console.error('evaluateFunction: functionStr é inválido:', functionStr);
      return NaN;
    }
    
    if (typeof x !== 'number' || !isFinite(x)) {
      console.error('evaluateFunction: x é inválido:', x);
      return NaN;
    }

    const expr = parseMathFunction(functionStr).replace(/x/g, `(${x})`);
    console.log('Expressão a ser avaliada:', expr, 'para x =', x);
    
    const result = eval(expr);
    
    // Validar resultado
    if (typeof result !== 'number') {
      console.error('evaluateFunction: resultado não é um número:', result);
      return NaN;
    }
    
    // Verificar se o resultado é finito (evitar infinitos que quebram o gráfico)
    if (!isFinite(result)) {
      return NaN;
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao avaliar função:', error, 'functionStr:', functionStr, 'x:', x);
    return NaN;
  }
};
