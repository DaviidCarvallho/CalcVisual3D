
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

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
      text: "Olá! Sou seu assistente de matemática. Posso ajudar você com questões sobre funções, cálculo e sólidos de revolução. Como posso ajudar?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simular resposta do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('função') || input.includes('f(x)')) {
      return "Funções são relações matemáticas que associam cada elemento de um conjunto (domínio) a um único elemento de outro conjunto (contradomínio). Você pode inserir funções como x^2, sin(x), ou exp(x) no painel ao lado!";
    }
    
    if (input.includes('sólido') || input.includes('revolução')) {
      return "Um sólido de revolução é formado quando rotacionamos uma curva em torno de um eixo. O volume pode ser calculado usando a fórmula V = π∫[a,b] [f(x)]² dx. Experimente clicar no botão 'Sólido de Revolução' para ver a visualização 3D!";
    }
    
    if (input.includes('derivada')) {
      return "A derivada representa a taxa de variação instantânea de uma função. Para f(x) = x², a derivada é f'(x) = 2x. As derivadas são fundamentais para encontrar máximos, mínimos e pontos de inflexão.";
    }
    
    if (input.includes('integral')) {
      return "A integral é o processo inverso da derivação. Ela pode representar a área sob uma curva ou o volume de um sólido. Para calcular volumes de sólidos de revolução, usamos integrais definidas.";
    }
    
    return "Interessante! Posso ajudar com conceitos de funções, derivadas, integrais e sólidos de revolução. Experimente inserir diferentes funções no painel de controles para ver as visualizações!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Assistente de Matemática
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
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre matemática..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
