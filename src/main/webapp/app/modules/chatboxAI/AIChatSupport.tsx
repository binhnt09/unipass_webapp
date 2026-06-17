import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Package, ShoppingCart, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { sendMessage, addUserMessage } from '../ai-chat/chat.reducer';
import { ProductRecommendationCarousel } from '../ai-chat/components/ProductRecommendationCarousel';

export function AIChatSupport({ onClose }: { onClose: () => void }) {
  const [inputText, setInputText] = useState('');
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { messages, loading, sessionId } = useAppSelector(state => state.chat);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLoc({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        error => {
          console.error('Geolocation error: ', error);
        },
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickActions = [
    { icon: Package, label: 'Tìm laptop giá tốt', query: 'Tìm laptop giá tốt' },
    { icon: ShoppingCart, label: 'Giày thể thao', query: 'Có đôi giày thể thao nào không?' },
    { icon: Info, label: 'Sản phẩm dưới 500k', query: 'Tìm các sản phẩm giá dưới 500k' },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim() || loading) return;

    const userText = inputText;
    setInputText('');

    // Dispatch to Redux
    dispatch(addUserMessage(userText));
    dispatch(sendMessage({ sessionId, message: userText, userLat: userLoc?.lat, userLng: userLoc?.lng }));
  };

  const handleQuickAction = (query: string) => {
    if (loading) return;
    dispatch(addUserMessage(query));
    dispatch(sendMessage({ sessionId, message: query, userLat: userLoc?.lat, userLng: userLoc?.lng }));
  };

  return (
    <div className="fixed bottom-[80px] md:bottom-6 right-4 md:right-6 w-[80vw] md:w-[520px] h-[60vh] md:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[70] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A2647] to-[#0D3A6B] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Unipass AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/80">Đang hoạt động</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Bot className="w-16 h-16 text-gray-400" />
            <p className="text-sm text-gray-500">Xin chào! Tôi là trợ lý ảo của Unipass. Tôi có thể giúp gì cho bạn hôm nay? 😊</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            {message.role === 'assistant' ? (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-200">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                  {/* Rich UI Carousel */}
                  {message.recommendedProductIds && message.recommendedProductIds.length > 0 && (
                    <ProductRecommendationCarousel productIds={message.recommendedProductIds} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 justify-end">
                <div className="max-w-[85%] flex flex-col items-end">
                  <div className="bg-gradient-to-r from-[#0A2647] to-[#0D3A6B] rounded-2xl rounded-tr-none p-3 shadow-sm">
                    <p className="text-white text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-200">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">Gợi ý câu hỏi:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-700 rounded-lg text-xs font-medium transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Bạn cần hỗ trợ gì?"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || loading}
          className="w-10 h-10 bg-[#FF6B35] text-white rounded-full flex items-center justify-center hover:bg-[#E55A24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
