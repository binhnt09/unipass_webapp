import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Home, MessageCircle, ShoppingCart, Star, User } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import { useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';
import { SellerRegistrationModal } from 'app/modules/seller/registration/SellerRegistrationModal';
import { usePremiumStatus } from 'app/shared/hooks/usePremiumStatus';
import { Crown } from 'lucide-react';

/* ================================================================
   MOBILE BOTTOM NAV — cố định dưới cùng, CHỈ hiển thị trên mobile
   ẩn hoàn toàn trên md+ (>= 768px) qua class "md:hidden"
   ================================================================ */

interface NavItem {
  id: string;
  to: string;
  label: string;
  Icon: React.ElementType;
  requireAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', to: '/market', label: 'Trang chủ', Icon: Home },
  { id: 'sell', to: '/premium', label: 'Premium', Icon: Star, requireAuth: true },
  { id: 'messages', to: '/messages', label: 'Tin nhắn', Icon: MessageCircle, requireAuth: true },
  { id: 'cart', to: '/cart', label: 'Giỏ hàng', Icon: ShoppingCart, requireAuth: true },
  { id: 'profile', to: '/profile', label: 'Hồ sơ', Icon: User, requireAuth: true },
];

interface MobileBottomNavProps {
  isAuthenticated: boolean;
}

export function MobileBottomNav({ isAuthenticated }: MobileBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: isDemoAuth, isSeller: isDemoSeller } = useAuth();
  const isLoggedIn = isAuthenticated || isDemoAuth;

  const realUser = useAppSelector(state => state.authentication.account);
  const authorities = realUser?.authorities || [];
  const isSeller = isDemoAuth ? isDemoSeller : authorities.includes('ROLE_SELLER');

  const [cartCount, setCartCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [showSellerRegModal, setShowSellerRegModal] = useState(false);

  const { isPremium, level } = usePremiumStatus();

  // Fetch cart count
  useEffect(() => {
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }
    const fetch = async () => {
      try {
        const res = await axios.get('/api/cart-items/current-user/items');
        setCartCount((res.data || []).length);
      } catch {
        /* silent */
      }
    };
    fetch();
    window.addEventListener('cartUpdated', fetch);
    return () => window.removeEventListener('cartUpdated', fetch);
  }, [isLoggedIn]);

  // Fetch unread message count
  useEffect(() => {
    if (!isLoggedIn) {
      setMsgCount(0);
      return;
    }
    const fetch = async () => {
      try {
        const res = await axios.get('/api/chat-messages/unread-count');
        setMsgCount(res.data?.count ?? 0);
      } catch {
        /* silent */
      }
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    const onRead = () => setMsgCount(0);
    window.addEventListener('messagesRead', onRead);
    return () => {
      clearInterval(interval);
      window.removeEventListener('messagesRead', onRead);
    };
  }, [isLoggedIn]);

  // Hide on landing page (Welcome3D has its own nav)
  if (location.pathname === '/') return null;

  const isActive = (item: NavItem): boolean => {
    if (item.id === 'home' && location.pathname === '/market') return true;
    if (item.id === 'market' && location.pathname === '/market') return true;
    return location.pathname === item.to || location.pathname.startsWith(item.to + '/');
  };

  const getBadge = (id: string): number | null => {
    if (id === 'cart' && isLoggedIn && cartCount > 0) return cartCount;
    if (id === 'messages' && isLoggedIn && msgCount > 0) return msgCount;
    return null;
  };

  const handlePress = (item: NavItem) => {
    navigate(item.to);
  };

  return (
    <>
      <nav
        id="mobile-bottom-nav"
        aria-label="Điều hướng chính"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,245,255,0.18)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-stretch justify-around px-1" style={{ height: 60 }}>
          {NAV_ITEMS.filter(item => item.id !== 'sell' || isSeller).map(item => {
            const active = isActive(item);
            const badge = getBadge(item.id);
            let { Icon, label } = item;

            if (item.id === 'sell' && isPremium) {
              Icon = Crown;
              label = level === 2 ? 'VIP Pro' : 'Tiêu chuẩn';
            }

            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                aria-label={item.label}
                onClick={() => handlePress(item)}
                className="flex flex-col items-center justify-center flex-1 relative gap-0.5 border-none outline-none cursor-pointer"
                style={{ background: 'transparent', padding: '6px 0' }}
              >
                {/* Active top indicator */}
                {active && (
                  <motion.div
                    layoutId="bottom-nav-active-bar"
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    style={{
                      width: 28,
                      height: 3,
                      borderRadius: '0 0 4px 4px',
                      background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)',
                      boxShadow: '0 0 10px rgba(0,245,255,0.7)',
                    }}
                  />
                )}

                {/* Icon container */}
                <motion.div
                  animate={active ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="relative flex items-center justify-center"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: active ? 'linear-gradient(135deg, rgba(0,245,255,0.15) 0%, rgba(155,77,255,0.12) 100%)' : 'transparent',
                  }}
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.3 : 1.8}
                    style={{
                      color: active ? '#00C4CC' : '#94a3b8',
                      filter: active ? 'drop-shadow(0 0 5px rgba(0,245,255,0.55))' : 'none',
                      transition: 'color 0.25s ease, filter 0.25s ease',
                    }}
                  />
                  {/* Badge */}
                  {badge !== null && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute flex items-center justify-center rounded-full font-bold"
                      style={{
                        top: 1,
                        right: 1,
                        minWidth: 16,
                        height: 16,
                        fontSize: '0.58rem',
                        background: 'linear-gradient(135deg, #FF2D78, #9B4DFF)',
                        color: '#fff',
                        padding: '0 3px',
                        lineHeight: 1,
                      }}
                    >
                      {badge > 99 ? '99+' : badge}
                    </motion.span>
                  )}
                </motion.div>

                {/* Label */}
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#00C4CC' : '#94a3b8',
                    letterSpacing: '0.01em',
                    lineHeight: 1,
                    transition: 'color 0.25s ease',
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      <SellerRegistrationModal isOpen={showSellerRegModal} onClose={() => setShowSellerRegModal(false)} />
    </>
  );
}
