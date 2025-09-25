import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatbotButton from '../components/ChatbotButton';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default MainLayout;
