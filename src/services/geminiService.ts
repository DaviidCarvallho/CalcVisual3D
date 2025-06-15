
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAwuZWwYki4kp6mwB8MSf2co9YyzPZF59s');

export const getChatResponse = async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Preparar o contexto da conversa
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = conversationHistory
        .slice(-6) // Pegar apenas as últimas 6 mensagens
        .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
        .join('\n');
    }

    const prompt = `Você é um assistente especializado em matemática, focado em funções, cálculo, derivadas, integrais e sólidos de revolução. Responda sempre em português de forma clara e educativa.

${conversationContext ? `Contexto da conversa:\n${conversationContext}\n\n` : ''}

Pergunta atual: ${message}

Responda de forma concisa e educativa:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'Desculpe, não consegui processar sua pergunta.';
  } catch (error) {
    console.error('Erro ao chamar Gemini API:', error);
    return 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.';
  }
};
