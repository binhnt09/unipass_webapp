import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Package, ShoppingCart, Info } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  productSuggestions?: ProductSuggestion[];
}

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export function AIChatSupport({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý ảo của Unipass. Tôi có thể giúp gì cho bạn hôm nay? 😊',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    { icon: Package, label: 'Tìm laptop giá tốt', query: 'laptop giá tốt' },
    { icon: ShoppingCart, label: 'Kiểm tra đơn hàng', query: 'kiểm tra đơn hàng' },
    { icon: Info, label: 'Chính sách đổi trả', query: 'chính sách đổi trả' },
  ];

  const mockAIResponse = (userMessage: string): { text: string; products?: ProductSuggestion[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Laptop suggestions
    if (lowerMessage.includes('laptop') || lowerMessage.includes('máy tính')) {
      return {
        text: 'Dựa trên nhu cầu của bạn, tôi gợi ý một số laptop phổ biến trên Unipass:',
        products: [
          {
            id: '1',
            name: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
            price: 12500000,
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
            rating: 4.8,
          },
          {
            id: '2',
            name: 'MacBook Air M1 2020 - 8GB RAM',
            price: 18900000,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
            rating: 4.9,
          },
          {
            id: '3',
            name: 'Lenovo ThinkPad X1 Carbon Gen 9',
            price: 15600000,
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop',
            rating: 4.7,
          },
        ],
      };
    }

    // Tai nghe suggestions
    if (lowerMessage.includes('tai nghe') || lowerMessage.includes('headphone')) {
      return {
        text: 'Đây là những tai nghe được yêu thích nhất trên Unipass:',
        products: [
          {
            id: '4',
            name: 'Tai nghe Sony WH-1000XM4',
            price: 5400000,
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop',
            rating: 4.9,
          },
          {
            id: '5',
            name: 'AirPods Pro Gen 2',
            price: 4200000,
            image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&h=200&fit=crop',
            rating: 4.8,
          },
        ],
      };
    }

    // Order tracking
    if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('kiểm tra')) {
      return {
        text: 'Để kiểm tra đơn hàng, bạn có thể:\n\n1. Vào mục "Đơn mua của tôi" trong menu tài khoản\n2. Hoặc cung cấp mã đơn hàng để tôi tra cứu giúp bạn\n\nBạn có mã đơn hàng không?',
      };
    }

    // Return policy
    if (lowerMessage.includes('đổi trả') || lowerMessage.includes('hoàn tiền') || lowerMessage.includes('chính sách')) {
      return {
        text: '📋 **Chính sách đổi trả của Unipass:**\n\n✅ Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi\n✅ Hoàn tiền 100% nếu không đúng mô tả\n✅ Miễn phí vận chuyển đổi trả\n✅ Hỗ trợ 24/7\n\nBạn cần hỗ trợ đổi trả sản phẩm nào?',
      };
    }

    // Shipping
    if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
      return {
        text: '🚚 **Thông tin giao hàng:**\n\n• Miễn phí ship trong bán kính 5km\n• Giao hàng nhanh 2-4 giờ (trong khuôn viên trường)\n• Giao hàng tiêu chuẩn 1-3 ngày\n• Kiểm tra hàng trước khi nhận\n\nBạn muốn biết thêm chi tiết gì không?',
      };
    }

    // Payment
    if (lowerMessage.includes('thanh toán') || lowerMessage.includes('payment')) {
      return {
        text: '💳 **Phương thức thanh toán:**\n\n• Tiền mặt khi gặp mặt (COD)\n• Chuyển khoản ngân hàng\n• Ví điện tử MoMo\n• VNPay - Thẻ ATM/Visa/Mastercard\n\nTất cả đều an toàn và bảo mật 100%! Bạn muốn hỏi thêm gì không?',
      };
    }

    // Default responses
    const defaultResponses = [
      'Tôi hiểu bạn quan tâm về vấn đề này. Bạn có thể cho tôi biết thêm chi tiết không? 🤔',
      'Để tôi có thể hỗ trợ tốt hơn, bạn có thể nói rõ hơn về nhu cầu của mình không?',
      'Tôi sẵn sàng giúp bạn! Bạn đang tìm kiếm sản phẩm gì hoặc cần hỗ trợ về vấn đề gì? 😊',
    ];

    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(
      () => {
        const response = mockAIResponse(inputText);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'ai',
          timestamp: new Date(),
          productSuggestions: response.products,
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleQuickAction = (query: string) => {
    setInputText(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="fixed bottom-[80px] md:bottom-6 right-4 md:right-6 w-[80vw] md:w-[420px] h-[60vh] md:h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-[70] overflow-hidden">
      {/* <div className="fixed bottom-[100px] md:bottom-24 right-0 md:right-6 w-full md:w-[44vh] h-[66vh] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border-t md:border border-gray-200 flex flex-col z-[70] overflow-hidden"> */}
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
        {messages.map(message => (
          <div key={message.id} className="mb-4">
            {message.sender === 'ai' ? (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-200">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                  </div>
                  {message.productSuggestions && (
                    <div className="mt-3 space-y-2">
                      {message.productSuggestions.map(product => (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:border-[#FF6B35] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[#FF6B35] font-bold text-sm">{product.price.toLocaleString('vi-VN')}đ</span>
                                <span className="text-xs text-gray-500">⭐ {product.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-gray-400 mt-1 block">
                    {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 justify-end">
                <div className="flex-1 max-w-[85%] flex flex-col items-end">
                  <div className="bg-gradient-to-r from-[#0A2647] to-[#0D3A6B] rounded-2xl rounded-tr-none p-3 shadow-sm">
                    <p className="text-white text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
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
      {messages.length <= 1 && (
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
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-sm text-gray-900"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
