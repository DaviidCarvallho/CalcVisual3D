
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { getChatResponse } from '@/services/geminiService';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Sou seu assistente especializado em matemática e no CalcViz 3D! 🧮✨\n\nPosso te ajudar com:\n📊 **Visualização de Funções**: Digite funções como x^2, sin(x), exp(x) e veja como elas se comportam\n🎯 **Sólidos de Revolução**: Explore como as funções geram volumes 3D quando rotacionadas\n🔧 **Dicas da Aplicação**: Use as funções pré-definidas ou crie suas próprias. Experimente adicionar uma segunda função para ver a área entre elas!\n📈 **Conceitos Matemáticos**: Tire dúvidas sobre derivadas, integrais, limites e muito mais!\n\nQue tal começar plotando uma função interessante? Experimente 'sin(x) + cos(2*x)' ou me pergunte sobre qualquer conceito matemático!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // Preparar histórico da conversa para a API
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text
      }));

      const response = await getChatResponse(currentInput, conversationHistory);
      
      const botResponse: Message = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente ou me pergunte sobre como usar as funcionalidades do CalcViz 3D!",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Assistente CalcViz 3D - Powered by Gemini
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-80">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.isBot ? (
                    <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analisando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Pergunte sobre matemática ou como usar o CalcViz 3D..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} size="sm" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
