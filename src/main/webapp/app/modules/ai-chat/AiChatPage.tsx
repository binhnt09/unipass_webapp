import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { sendMessage, addUserMessage, resetChat } from './chat.reducer';
import { Button } from 'app/shared/ui/button';
import { Input } from 'app/shared/ui/input';
import { ScrollArea } from 'app/shared/ui/scroll-area';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { ProductRecommendationCarousel } from './components/ProductRecommendationCarousel';

export const AiChatPage = () => {
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const { messages, loading, sessionId } = useAppSelector(state => state.chat);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessage({ sessionId, message: input }));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn bắt đầu phiên chat mới?')) {
      dispatch(resetChat());
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden my-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Unipass AI Assistant</h2>
            <p className="text-xs text-gray-500">Trợ lý tìm kiếm sản phẩm thông minh</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset} title="Bắt đầu lại">
          <Trash2 size={18} className="text-gray-500 hover:text-red-500" />
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50/30" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 my-20">
            <Bot size={48} className="text-gray-300" />
            <p className="text-sm">Hãy thử hỏi: {'Tìm cho mình iPhone cũ giá dưới 10 triệu'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Rich UI for Product Recommendations */}
                  {msg.role === 'assistant' && msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                    <ProductRecommendationCarousel productIds={msg.recommendedProductIds} />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bạn muốn tìm sản phẩm gì?..."
            className="pr-12 py-6 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-primary"
            disabled={loading}
          />
          <Button size="icon" className="absolute right-2 rounded-full w-9 h-9" onClick={handleSend} disabled={!input.trim() || loading}>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
