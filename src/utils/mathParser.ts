
import { evaluate, parse, format } from 'mathjs';

export const parseMathFunction = (functionStr: string): string => {
  // Validar se functionStr existe e não é undefined
  if (!functionStr || typeof functionStr !== 'string') {
    console.error('parseMathFunction: functionStr é inválido:', functionStr);
    return 'x'; // Retorna uma função padrão simples
  }

  // Normalizar a função para o formato aceito pelo mathjs
  let expr = functionStr
    .toLowerCase()
    .trim()
    // Substituir notações especiais antes de processar
    .replace(/x²/g, 'x^2')
    .replace(/x³/g, 'x^3')
    // Substituir ln por log (mathjs usa log para logaritmo natural)
    .replace(/\bln\s*\(/g, 'log(')
    .replace(/\bln\s+/g, 'log ')
    // Garantir que pi e e sejam reconhecidos
    .replace(/\bpi\b/g, 'pi')
    .replace(/\be\b/g, 'e');
  
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

    const expr = parseMathFunction(functionStr);
    console.log('Avaliando expressão:', expr, 'para x =', x);
    
    // Usar mathjs para avaliar a expressão
    const result = evaluate(expr, { x: x });
    
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
