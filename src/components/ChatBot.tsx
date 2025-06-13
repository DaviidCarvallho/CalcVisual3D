
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou seu assistente de matemática. Posso ajudar com cálculo, explicar conceitos sobre sólidos de revolução, derivadas, integrais e muito mais!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simular resposta do bot (em produção, conectar com backend Python)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('derivada')) {
      return 'As derivadas representam a taxa de variação instantânea de uma função. Para f(x) = x², a derivada é f\'(x) = 2x. Quer que eu explique as regras de derivação?';
    }
    
    if (input.includes('integral')) {
      return 'As integrais calculam a área sob uma curva. A integral de x² é x³/3 + C. Para sólidos de revolução, usamos integrais para calcular volumes!';
    }
    
    if (input.includes('sólido') || input.includes('revolução')) {
      return 'Um sólido de revolução é formado girando uma função f(x) em torno de um eixo. O volume é calculado por V = π∫[a,b] [f(x)]² dx. Experimente com diferentes funções no visualizador!';
    }
    
    if (input.includes('volume')) {
      return 'Para calcular o volume de um sólido de revolução, use a fórmula do disco: V = π∫[a,b] [f(x)]² dx, onde f(x) é sua função e [a,b] é o intervalo.';
    }
    
    return 'Interessante! Posso ajudar com conceitos de cálculo, derivadas, integrais, sólidos de revolução, ou explicar qualquer função matemática. O que gostaria de aprender?';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-96 flex flex-col">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          Chat Matemático IA
        </h3>
        <p className="text-sm text-blue-100">Assistente especializado em cálculo</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-4 w-4 mt-0.5 text-indigo-500" />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 mt-0.5 text-white" />
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua pergunta sobre matemática..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
