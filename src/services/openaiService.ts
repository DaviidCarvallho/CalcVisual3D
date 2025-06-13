
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Necessário para usar no browser
});

export const getChatResponse = async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []) => {
  try {
    const messages = [
      {
        role: 'system' as const,
        content: 'Você é um assistente especializado em matemática, focado em funções, cálculo, derivadas, integrais e sólidos de revolução. Responda sempre em português de forma clara e educativa.'
      },
      ...conversationHistory,
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.';
  } catch (error) {
    console.error('Erro ao chamar OpenAI API:', error);
    return 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.';
  }
};
