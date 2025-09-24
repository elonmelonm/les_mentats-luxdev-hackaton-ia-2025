import React, { useState } from 'react';

const Chatbots = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel du cadastre. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler une réponse du bot après 2 secondes
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('titre') || message.includes('propriété')) {
      return "Pour obtenir un titre foncier, vous devez d'abord téléverser vos documents via notre formulaire en ligne. Avez-vous déjà commencé le processus ?";
    } else if (message.includes('document') || message.includes('papier')) {
      return "Les documents nécessaires incluent : acte de vente, certificat de propriété, plan de situation, et pièce d'identité. Avez-vous tous ces documents ?";
    } else if (message.includes('temps') || message.includes('durée')) {
      return "Le délai moyen de traitement est de 30 à 60 jours ouvrables. Nous vous tiendrons informé de l'avancement de votre dossier.";
    } else if (message.includes('frais') || message.includes('coût') || message.includes('prix')) {
      return "Les frais de sécurisation foncière varient selon la superficie et le type de propriété. Consultez notre grille tarifaire en ligne ou contactez-nous pour un devis personnalisé.";
    } else if (message.includes('contact') || message.includes('téléphone') || message.includes('email')) {
      return "Vous pouvez nous contacter au +229 XX XX XX XX ou par email à contact@cadastre.bj. Nos bureaux sont ouverts du lundi au vendredi de 8h à 17h.";
    } else if (message.includes('merci') || message.includes('aide')) {
      return "De rien ! Je suis là pour vous aider. N'hésitez pas à me poser d'autres questions sur le cadastre.";
    } else {
      return "Je comprends votre question. Pour des informations plus précises sur le cadastre, je vous recommande de consulter notre section FAQ ou de contacter directement nos services.";
    }
  };

  const quickQuestions = [
    "Comment obtenir un titre foncier ?",
    "Quels documents sont nécessaires ?",
    "Quel est le délai de traitement ?",
    "Quels sont les frais ?",
    "Comment vous contacter ?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    // Déclencher l'envoi automatique
    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        text: question,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages([...messages, newMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: generateBotResponse(question),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 2000);
    }, 100);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Assistant Virtuel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Posez vos questions sur le cadastre et obtenez des réponses instantanées 
              de notre assistant virtuel spécialisé.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header du chat */}
            <div className="bg-blue-600 text-white p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Assistant Cadastre</h3>
                <p className="text-blue-100 text-sm">En ligne</p>
              </div>
            </div>

            {/* Messages du chat */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 max-w-xs px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Questions rapides */}
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600 mb-3">Questions fréquentes :</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone de saisie */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">IA Avancée</h3>
              <p className="text-gray-600 text-sm">
                Notre assistant utilise l'intelligence artificielle pour vous fournir des réponses précises.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Réponse Rapide</h3>
              <p className="text-gray-600 text-sm">
                Obtenez des réponses instantanées à vos questions sur le cadastre 24h/24.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Spécialisé</h3>
              <p className="text-gray-600 text-sm">
                Expert en droit foncier et procédures cadastrales du Bénin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chatbots;
