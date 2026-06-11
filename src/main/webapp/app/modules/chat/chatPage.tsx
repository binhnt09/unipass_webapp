import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, Smile, BadgeCheck, AlertCircle, Flag, Star } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import { useLocation } from 'react-router';
import axios from 'axios';
import { Storage } from 'react-jhipster';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { IChatRoom } from 'app/shared/model/chat-room.model';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { IProduct } from 'app/shared/model/product.model';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from 'app/config/store';
import dayjs from 'dayjs';

export function ChatPage() {
  const account = useAppSelector(state => state.authentication.account);
  const { user } = useAuth();
  const location = useLocation();

  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const [showReportModal, setShowReportModal] = useState(false);

  const stompClientRef = useRef<any>(null);
  const subscriptionRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Compute the safe login identifier string
  const userLogin = account?.login || (user as any)?.login || user?.email || '';

  // Safe compute of the active room by genuine database ID
  const activeRoom = rooms.find(r => r.id === selectedChat);

  const getChatPartner = (room: any) => {
    if (!room) return null;
    const currentLogin = account?.login || (user as any)?.login || user?.email;
    const currentId = account?.id || user?.id;
    const isBuyerMe =
      (room.buyer?.id && currentId && String(room.buyer.id) === String(currentId)) ||
      (room.buyer?.login && currentLogin && room.buyer.login === currentLogin);
    return isBuyerMe ? room.seller : room.buyer;
  };

  const getPartnerDisplayName = (room: any) => {
    const partner = getChatPartner(room);
    if (!partner) return 'Người dùng';
    const fullName = [partner.firstName, partner.lastName].filter(Boolean).join(' ');
    return fullName.trim() || partner.login || 'Người dùng';
  };

  const chatPartner = getChatPartner(activeRoom);

  const chatPartnerName = activeRoom ? getPartnerDisplayName(activeRoom) : 'Chọn cuộc hội thoại';

  const otherUserInitials = chatPartner ? (chatPartner.firstName || chatPartner.login || 'U').substring(0, 2).toUpperCase() : 'U';

  const otherUserUniversity = chatPartner?.universityName || 'Đại học Quốc gia';

  // Helper to detect Vietnamese phone numbers
  const hasPhoneNumber = (text?: string): boolean => {
    if (!text) return false;
    const phoneRegex = /(0[3|5|7|8|9]+[0-9]{8})\b|(\+84[3|5|7|8|9]+[0-9]{8})\b/g;
    const simplePhoneRegex = /\b\d{4}[.\s]?\d{3}[.\s]?\d{3}\b|\b\d{10}\b/;
    return phoneRegex.test(text) || simplePhoneRegex.test(text);
  };

  const getProductImageUrl = (product: IProduct): string => {
    const pImages = (product as any).productImages;
    if (pImages && pImages.length > 0) {
      let url = pImages[0].imageUrl;
      if (url && url.startsWith('uploads/')) {
        url = '/' + url;
      }
      return url;
    }
    return 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2t8ZW58MXx8fHwxNzczODQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080';
  };

  // 1. WebSocket STOMP Connection Lifecycle
  useEffect(() => {
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connectStomp = () => {
      const loc = globalThis.location;
      const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '';
      let url = `//${loc.host}${baseHref}/websocket/tracker`;

      const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
      if (authToken) {
        url += `?access_token=${authToken}`;
      }

      const socket = new SockJS(url);
      const stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });
      stompClient.debug = () => {}; // tắt log STOMP spam

      stompClient.connect(
        {},
        () => {
          stompClientRef.current = stompClient;
          setIsConnected(true);
        },
        (error: any) => {
          console.error('STOMP connection error, retrying in 3s:', error);
          stompClientRef.current = null;
          setIsConnected(false);
          // Tự thử kết nối lại sau 3s
          retryTimeout = setTimeout(connectStomp, 3000);
        },
      );
    };

    connectStomp();

    return () => {
      clearTimeout(retryTimeout);
      if (stompClientRef.current) {
        if (stompClientRef.current.connected) {
          stompClientRef.current.disconnect();
        }
        stompClientRef.current = null;
      }
      setIsConnected(false);
    };
  }, []);

  // 2. Load Active Rooms List
  useEffect(() => {
    axios
      .get<IChatRoom[]>('/api/chat-rooms/my-rooms')
      .then(res => {
        const roomsList = res.data || [];
        setRooms(roomsList);

        // Auto-select room from router state if present
        const passedRoomId = location.state?.selectedRoomId;
        if (passedRoomId) {
          const foundRoom = roomsList.find(r => r.id === Number(passedRoomId));
          if (foundRoom && foundRoom.id !== undefined) {
            setSelectedChat(foundRoom.id);
          } else if (roomsList.length > 0 && roomsList[0].id !== undefined) {
            setSelectedChat(roomsList[0].id);
          }
        } else if (roomsList.length > 0 && roomsList[0].id !== undefined) {
          setSelectedChat(roomsList[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to load chat rooms:', err);
      });
  }, [location.state]);

  // Khi user vào trang /messages, mark toàn bộ tin nhắn là đã đọc
  // và bắn event để header reset badge về 0
  useEffect(() => {
    const markRead = async () => {
      try {
        await axios.post('/api/chat-messages/mark-all-read');
        window.dispatchEvent(new Event('messagesRead'));
      } catch {
        // Silently fail
      }
    };
    markRead();
  }, []);

  // 3. Room Selection: Load History & Handle STOMP Subscriptions
  useEffect(() => {
    if (!selectedChat) return;

    // Fetch Historical Logs
    axios
      .get<IChatMessage[]>(`/api/chat-messages?roomId.equals=${selectedChat}&sort=createdAt,asc`)
      .then(res => {
        setMessages(res.data || []);
      })
      .catch(err => {
        console.error('Failed to load chat message history:', err);
      });

    // Handle WebSocket Subscription
    if (isConnected && stompClientRef.current) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      const destination = `/topic/chat/${selectedChat}`;
      console.warn(`Subscribing to WebSocket topic: ${destination}`);

      subscriptionRef.current = stompClientRef.current.subscribe(destination, (msg: any) => {
        try {
          const receivedMessage = JSON.parse(msg.body) as IChatMessage;
          console.warn('Received real-time message payload:', receivedMessage);

          if (receivedMessage?.room?.id === selectedChat) {
            setMessages(prev => {
              if (prev.some(m => m.id === receivedMessage.id)) {
                return prev;
              }
              return [...prev, receivedMessage];
            });
          }
        } catch (err) {
          console.error('Error parsing real-time websocket message:', err);
        }
      });
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [selectedChat, isConnected]);

  // 4. Send Message Handler - dùng STOMP nếu đã connect, fallback sang REST API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeRoom) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Ưu tiên gửi qua WebSocket (realtime)
    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        const payload = {
          content,
          room: { id: activeRoom.id },
        };
        stompClientRef.current.send('/chat.send/' + activeRoom.id, JSON.stringify(payload), {});
        return;
      } catch (err) {
        console.error('STOMP send failed, falling back to REST:', err);
      }
    }

    // Fallback: gửi qua REST API khi STOMP chưa connect hoặc lỗi
    try {
      const res = await axios.post<IChatMessage>('/api/chat-messages', {
        content,
        room: { id: activeRoom.id },
      });
      // Thêm tin nhắn vừa gửi vào danh sách hiển thị ngay
      setMessages(prev => {
        if (prev.some(m => m.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      console.error('REST send also failed:', err);
      // Hoàn trả lại nội dung nếu gửi thất bại
      setMessageInput(content);
    }
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
          {rooms.map(room => {
            const roomId = room.id;
            const partner = getChatPartner(room);
            const initials = partner ? (partner.firstName || partner.login || 'U').substring(0, 2).toUpperCase() : 'U';
            const name = getPartnerDisplayName(room);
            const university = partner?.universityName || 'Đại học Quốc gia';
            const subtext = room.product?.name ? `Sản phẩm: ${room.product.name}` : 'Nhấn để bắt đầu trò chuyện';
            const dateStr = room.createdAt ? dayjs(room.createdAt).format('DD/MM/YYYY') : '';

            return (
              <button
                key={roomId}
                onClick={() => room.id !== undefined && setSelectedChat(room.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedChat === roomId ? 'bg-orange-50 border-l-4 border-l-[#FF6B35]' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 overflow-hidden">
                  {partner?.imageUrl ? <img src={partner.imageUrl} alt={name} className="w-full h-full object-cover" /> : initials}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium text-gray-900 truncate">{name}</span>
                    <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{university}</p>
                  <p className="text-sm text-gray-600 truncate">{subtext}</p>
                </div>

                {/* Timestamp */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-gray-500">{dateStr}</span>
                </div>
              </button>
            );
          })}
          {rooms.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">Bạn chưa có cuộc trò chuyện nào.</div>}
        </div>
      </div>

      {/* Main Chat Area */}
      {!activeRoom ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-4xl text-[#FF6B35]">💬</div>
            <h3 className="text-xl font-bold text-gray-900">Không có cuộc trò chuyện nào</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Chọn một cuộc trò chuyện từ danh sách bên trái hoặc liên hệ với người bán từ trang chi tiết sản phẩm.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white font-medium overflow-hidden flex-shrink-0">
                  {chatPartner?.imageUrl ? (
                    <img src={chatPartner.imageUrl} alt={chatPartnerName} className="w-full h-full object-cover" />
                  ) : (
                    otherUserInitials
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{chatPartnerName}</h3>
                    <span title=".edu.vn Verified">
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-700">4.8/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{otherUserUniversity}</p>
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
            {activeRoom.product && (
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 border-2 border-orange-200 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <ImageWithFallback
                      src={getProductImageUrl(activeRoom.product)}
                      alt={activeRoom.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-1">💬 Đang thảo luận về:</p>
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">{activeRoom.product.name}</h4>
                    <p className="text-[#FF6B35] font-bold">{(activeRoom.product.price || 0).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map(message => {
              const currentId = account?.id || user?.id;
              const isMe =
                (message.sender?.id && currentId && String(message.sender.id) === String(currentId)) ||
                (message.sender?.login && userLogin && message.sender.login === userLogin);
              const dateStr = message.createdAt ? dayjs(message.createdAt).format('HH:mm') : '';
              const phoneWarning = hasPhoneNumber(message.content);

              return (
                <div key={message.id}>
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        isMe ? 'bg-[#0A2647] text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>{dateStr}</p>
                    </div>
                  </div>

                  {/* System Alert for Off-platform Detection */}
                  {phoneWarning && (
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
                            Hệ thống phát hiện dấu hiệu giao dịch ngoài ứng dụng. Nền tảng sẽ <strong>từ chối giải quyết tranh chấp</strong>{' '}
                            nếu bạn chuyển tiền cọc qua Zalo/Facebook.
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
              );
            })}
          </div>

          {/* Message Input wrapped inside form */}
          <div className="bg-white border-t border-gray-200">
            {/* Input Area Form container */}
            <div className="px-4 pb-4">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-500"
                  />
                  <button type="button" className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-12 h-12 bg-[#FF6B35] hover:bg-[#FF5722] rounded-full flex items-center justify-center transition-colors shadow-md"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
