
import React, { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant virtuel spécialisé dans le cadastre et la topographie. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (text.trim() === '') return;

    const newMessage = { 
      id: messages.length + 1, 
      text: text.trim(), 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          id: prevMessages.length + 1, 
          text: botResponse, 
          sender: 'bot', 
          timestamp: new Date() 
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut') || lowerCaseMessage.includes('hello')) {
      return "Bonjour ! Comment puis-je vous aider concernant le cadastre foncier ou la topographie aujourd'hui ?";
    } else if (lowerCaseMessage.includes('titre foncier') || lowerCaseMessage.includes('propriété')) {
      return "Pour obtenir un titre foncier, vous devez suivre plusieurs étapes : dépôt de dossier, enquête de commodo et incommodo, bornage, et immatriculation. Je peux vous donner plus de détails sur chaque étape si vous le souhaitez.";
    } else if (lowerCaseMessage.includes('documents') || lowerCaseMessage.includes('pièces')) {
      return "Les documents nécessaires varient selon le type de demande, mais incluent généralement : pièce d'identité, plan de situation, certificat de non-litige, et tout acte de propriété antérieur. Avez-vous un type de demande spécifique en tête ?";
    } else if (lowerCaseMessage.includes('délai') || lowerCaseMessage.includes('temps')) {
      return "Le délai de traitement d'une demande de titre foncier peut varier, mais il faut généralement compter entre 30 et 60 jours après la complétude du dossier.";
    } else if (lowerCaseMessage.includes('coût') || lowerCaseMessage.includes('frais') || lowerCaseMessage.includes('prix')) {
      return "Les frais sont composés de taxes d'enregistrement, de frais de bornage et d'honoraires de notaire/géomètre. Ils dépendent de la superficie et de la valeur du terrain. Je peux vous donner une estimation si vous me donnez plus de détails.";
    } else if (lowerCaseMessage.includes('topographie') || lowerCaseMessage.includes('levé')) {
      return "Nos services de topographie incluent les levés de terrain, les plans topographiques, le bornage, et les certificats de conformité. Nous utilisons des équipements de précision pour garantir la qualité de nos travaux.";
    } else if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('aide') || lowerCaseMessage.includes('téléphone')) {
      return "Vous pouvez nous contacter directement au +229 XX XX XX XX ou par email à contact@cadastre.bj pour une assistance personnalisée. Nos bureaux sont ouverts du lundi au vendredi de 8h à 17h.";
    } else if (lowerCaseMessage.includes('merci') || lowerCaseMessage.includes('thanks')) {
      return "De rien ! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous accompagner dans vos démarches cadastrales et topographiques.";
    } else {
      return "Je suis un assistant virtuel spécialisé dans le cadastre foncier et la topographie. Posez-moi des questions sur les titres fonciers, les documents, les délais, les frais, ou nos services de topographie.";
    }
  };

  const quickQuestions = [
    "Comment obtenir un titre foncier ?",
    "Quels documents sont nécessaires ?",
    "Quel est le délai de traitement ?",
    "Combien coûte un titre foncier ?",
    "Services de topographie disponibles",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-opacity-50 backdrop-blur-lg"
        onClick={onClose}
      ></div>

      {/* Chatbot Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#367C55] to-[#2d5f44] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Assistant IA</h3>
              <p className="text-green-100 text-sm">En ligne maintenant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#367C55] text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className="block text-xs opacity-75 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#367C55] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#367C55] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#367C55] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-500 text-sm">L'assistant écrit...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1 bg-gray-100 hover:bg-[#367C55] hover:text-white text-gray-700 rounded-full text-xs transition-colors duration-200"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#367C55] focus:border-transparent outline-none text-sm"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="bg-[#367C55] hover:bg-[#2d5f44] disabled:bg-gray-300 text-white p-2 rounded-full transition-colors duration-200"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
