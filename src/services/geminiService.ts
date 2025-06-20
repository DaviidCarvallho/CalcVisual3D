
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAwuZWwYki4kp6mwB8MSf2co9YyzPZF59s');

export const getChatResponse = async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []) => {
  try {
    console.log('Iniciando chamada para Gemini API...');
    
    // Usar o modelo correto disponível na API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Preparar o contexto da conversa
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .slice(-6) // Pegar apenas as últimas 6 mensagens
        .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
        .join('\n');
    }

    const prompt = `Você é um assistente especializado em matemática que se chama Calculinho, focado em funções, cálculo, derivadas, integrais e sólidos de revolução. 

IMPORTANTE: Responda sempre em português de forma clara e educativa. NÃO use formatação de texto como asteriscos (*), underlines (_), hashtags (#) ou qualquer outro tipo de marcação. Use apenas texto simples e direto. Não coloque texto em negrito, itálico ou qualquer formatação especial.

${conversationContext ? `Contexto da conversa:\n${conversationContext}\n\n` : ''}

Pergunta atual: ${message}

Responda de forma concisa e educativa usando apenas texto simples sem qualquer formatação:`;

    console.log('Enviando prompt para Gemini:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remover qualquer formatação que possa ter escapado
    text = text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **texto**
      .replace(/\*(.*?)\*/g, '$1')      // Remove *texto*
      .replace(/_(.*?)_/g, '$1')        // Remove _texto_
      .replace(/`(.*?)`/g, '$1')        // Remove `código`
      .replace(/#{1,6}\s*/g, '')        // Remove # headers
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove [links](url)
    
    console.log('Resposta recebida do Gemini:', text);
    
    return text || 'Desculpe, não consegui processar sua pergunta.';
  } catch (error) {
    console.error('Erro detalhado ao chamar Gemini API:', error);
    
    // Verificar se é erro de modelo não encontrado
    if (error.message && error.message.includes('not found')) {
      console.error('Modelo não encontrado. Tentando com gemini-pro...');
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(message);
        const response = await result.response;
        let text = response.text() || 'Desculpe, não consegui processar sua pergunta.';
        
        // Remover formatação também do fallback
        text = text
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/_(.*?)_/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .replace(/#{1,6}\s*/g, '')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1');
        
        return text;
      } catch (secondError) {
        console.error('Erro também com gemini-pro:', secondError);
      }
    }
    
    return 'Desculpe, ocorreu um erro ao processar sua pergunta. Verifique sua conexão com a internet e tente novamente.';
  }
};
