import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { AIChatSupport } from './AIChatSupport';

export function AIChatButton() {
  const [showChat, setShowChat] = useState(false);

  React.useEffect(() => {
    const handleOpenChat = () => setShowChat(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all hover:scale-110 group"
        >
          <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {showChat && <AIChatSupport onClose={() => setShowChat(false)} />}

      {/* Pulsing ring animation */}
      {!showChat && (
        <div className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#FF6B35] opacity-30 animate-ping z-30 pointer-events-none"></div>
      )}
    </>
  );
}
