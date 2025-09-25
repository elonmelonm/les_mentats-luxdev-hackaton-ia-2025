import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Chatbot from './Chatbot';

export default function ChatbotButton() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = () => {
    setIsChatbotOpen(true);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={openChatbot}
        className="fixed bottom-6 right-6 z-40 bg-[#367C55] hover:bg-[#2d5f44] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Ouvrir l'assistant IA"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Assistant IA
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
        </div>

        {/* Indicateur de notification */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chatbot Overlay */}
      <Chatbot isOpen={isChatbotOpen} onClose={closeChatbot} />
    </>
  );
}
