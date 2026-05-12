import React, { useState } from 'react';

import { Search, Send, Paperclip, Smile, BadgeCheck, Bot, AlertCircle, Shield, Check, Flag, Star, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';

interface Conversation {
  id: string;
  userName: string;
  university: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  verified: boolean;
  avatar: string;
  reputationScore: number;
}

export function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [showAISupport, setShowAISupport] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  const conversations: Conversation[] = [
    {
      id: '1',
      userName: 'Minh Trần',
      university: 'ĐH FPT',
      lastMessage: 'Laptop còn không bạn?',
      timestamp: '2 phút trước',
      unread: 2,
      verified: true,
      avatar: 'MT',
      reputationScore: 4.8,
    },
    {
      id: '2',
      userName: 'Nam Nguyễn',
      university: 'ĐH FPT',
      lastMessage: 'Mình có thể gặp ở thư viện không?',
      timestamp: '15 phút trước',
      unread: 0,
      verified: true,
      avatar: 'NN',
      reputationScore: 4.9,
    },
    {
      id: '3',
      userName: 'Hương Lê',
      university: 'ĐH FPT',
      lastMessage: 'Cảm ơn bạn nhiều nhé!',
      timestamp: '1 giờ trước',
      unread: 1,
      verified: true,
      avatar: 'HL',
      reputationScore: 4.7,
    },
    {
      id: '4',
      userName: 'Hoàng Phạm',
      university: 'ĐH FPT',
      lastMessage: 'Sách còn mới không bạn?',
      timestamp: '3 giờ trước',
      unread: 0,
      verified: true,
      avatar: 'HP',
      reputationScore: 4.6,
    },
  ];

  // Product being discussed
  const discussingProduct = {
    id: '1',
    name: 'Laptop Dell XPS 13 - Core i5, RAM 8GB',
    price: 12500000,
    image:
      'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const messages = [
    {
      id: '1',
      sender: 'other',
      text: 'Chào bạn! Mình quan tâm đến laptop Dell XPS 13 của bạn. Máy còn không?',
      timestamp: '10:23',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Còn bạn ơi! Máy còn mới 95%, pin khỏe, màn hình không trầy xước gì.',
      timestamp: '10:25',
    },
    {
      id: '3',
      sender: 'other',
      text: 'Tuyệt vời! Bạn có thể gửi thêm vài ảnh bàn phím và màn hình được không?',
      timestamp: '10:27',
    },
    {
      id: '4',
      sender: 'me',
      text: 'Được chứ, mình sẽ gửi ảnh cho bạn. Bàn phím còn rất đẹp, màn hình không có vết trầy.',
      timestamp: '10:28',
    },
    {
      id: '5',
      sender: 'other',
      text: 'Bạn kết bạn zalo số 0912345678 để tiện trao đổi và chuyển cọc nhé',
      timestamp: '10:30',
      hasPhoneNumber: true,
    },
  ];

  const currentConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.warn('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleConfirmTransaction = () => {
    // Navigate to rating/confirmation page
    console.warn('Confirming transaction and opening rating modal');
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#0A2647] mb-3">Tin nhắn</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedChat === conversation.id ? 'bg-orange-50 border-l-4 border-l-[#FF6B35]' : ''
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                {conversation.avatar}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-medium text-gray-900 truncate">{conversation.userName}</span>
                  {conversation.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-600 mb-1">{conversation.university}</p>
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>

              {/* Timestamp and Unread Badge */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{conversation.unread}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white font-medium">
                {currentConversation?.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{currentConversation?.userName}</h3>
                  <span title=".edu.vn Verified">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-700">{currentConversation?.reputationScore}/5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{currentConversation?.university}</p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <Flag className="w-5 h-5" />
              <span className="text-sm">Báo cáo</span>
            </button>
          </div>

          {/* Mini Product Card */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 border-2 border-orange-200 flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <ImageWithFallback src={discussingProduct.image} alt={discussingProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-1">💬 Đang thảo luận về:</p>
                <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">{discussingProduct.name}</h4>
                <p className="text-[#FF6B35] font-bold">{discussingProduct.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map(message => (
            <div key={message.id}>
              <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'me' ? 'bg-[#0A2647] text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-white/70' : 'text-gray-500'}`}>{message.timestamp}</p>
                </div>
              </div>

              {/* System Alert for Off-platform Detection */}
              {message.hasPhoneNumber && (
                <div className="max-w-2xl mt-3 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                        ⚠️ Cảnh báo: Phát hiện giao dịch ngoài nền tảng
                      </h4>
                      <p className="text-sm text-red-800 leading-relaxed mb-3">
                        Hệ thống phát hiện dấu hiệu giao dịch ngoài ứng dụng. Nền tảng sẽ <strong>từ chối giải quyết tranh chấp</strong> nếu
                        bạn chuyển tiền cọc qua Zalo/Facebook.
                      </p>
                      <div className="bg-white/80 rounded-lg p-3 border border-red-200">
                        <p className="text-sm font-bold text-red-900 mb-2">✅ Khuyến nghị:</p>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>• Giao dịch trực tiếp tại trường (thư viện, khu học tập)</li>
                          <li>• Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
                          <li>• Chỉ thanh toán qua Unipass để được bảo vệ</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* AI Support Widget */}
          {showAISupport && (
            <div className="max-w-md bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200 shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-[#0A2647]">Trợ lý An toàn AI</h4>
                    <button onClick={() => setShowAISupport(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Mình nhận thấy bạn đang thương lượng giá. Đây là một số tips an toàn:</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Luôn gặp mặt tại địa điểm công cộng trong trường</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Kiểm tra kỹ sản phẩm trước khi thanh toán</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sử dụng tính năng bảo vệ thanh toán của Unipass</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-900">
                  <strong>Gợi ý:</strong> Giá gốc là 12.500.000đ. Bạn có thể đề xuất giá 12.000.000đ.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200">
          {/* Transaction Confirmation CTA */}
          <div className="px-4 pt-4">
            <button
              onClick={handleConfirmTransaction}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3.5 font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />✅ Xác nhận chốt đơn & Đánh giá
            </button>
            <p className="text-xs text-center text-gray-600 mt-2 mb-2">
              🎁 Nhận <span className="font-bold text-[#FF6B35]">+10 điểm uy tín</span> khi hoàn thành giao dịch trên app
            </p>
          </div>

          {/* Trust Notice */}
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-2.5 rounded-lg">
              <Shield className="w-4 h-4 text-[#0A2647] flex-shrink-0" />
              <span>Đây là sinh viên đã xác thực. Không bao giờ chia sẻ thông tin cá nhân nhạy cảm.</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="px-4 pb-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-500"
                />
                <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                className="w-12 h-12 bg-[#FF6B35] hover:bg-[#FF5722] rounded-full flex items-center justify-center transition-colors shadow-md"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Báo cáo gian lận</h3>
                <p className="text-sm text-gray-600">Giúp chúng tôi giữ an toàn cho cộng đồng</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {[
                '🚫 Yêu cầu giao dịch ngoài app (Zalo/FB)',
                '💰 Lừa đảo tiền cọc',
                '📦 Sản phẩm giả/không đúng mô tả',
                '😠 Ngôn từ không phù hợp',
                '⚠️ Hành vi đáng ngờ khác',
              ].map((reason, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <span className="text-sm text-gray-800">{reason}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  alert('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét trong 24h.');
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
