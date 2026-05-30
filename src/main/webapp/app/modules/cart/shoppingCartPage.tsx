import React, { useState } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  BadgeCheck,
  Tag,
  Store,
  MessageCircle,
  X,
  Star,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router';

interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  condition: string;
  quantity: number;
  inStock: boolean;
}

interface SellerGroup {
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  university: string;
  items: CartItem[];
  // COMMENTED OUT: Voucher system - uncomment when backend API is ready
  // vouchers?: Voucher[];

  // NEW FEATURE: Trust badges for sellers
  rating?: number; // Seller rating out of 5
  reviewCount?: number; // Number of reviews
  verified?: boolean; // Verified seller badge
}

// COMMENTED OUT: Voucher interface - uncomment when implementing voucher system with backend

export function ShoppingCartPage() {
  const navigate = useNavigate();

  // Cart items grouped by seller
  const [sellerGroups, setSellerGroups] = useState<SellerGroup[]>([
    {
      sellerId: '1',
      sellerName: 'Sarah M.',
      sellerAvatar: 'S',
      university: 'MIT',
      // COMMENTED OUT: Voucher mock data - will be replaced by API data

      // NEW FEATURE: Trust badges - seller reputation data
      rating: 4.8, // Average rating from reviews
      reviewCount: 127, // Total number of reviews
      verified: true, // Email verified and active seller
      items: [
        {
          id: '1',
          image:
            'https://images.unsplash.com/photo-1633707392225-d883c8cd3e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2slMjBzdGFja3xlbnwxfHx8fDE3NzMyOTYwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Calculus Early Transcendentals 8th Ed.',
          price: 45.0,
          condition: 'Like New',
          quantity: 1,
          inStock: true,
        },
        {
          id: '4',
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
          title: 'Linear Algebra and Its Applications',
          price: 35.0,
          condition: 'Good',
          quantity: 1,
          inStock: true,
        },
      ],
    },
    {
      sellerId: '2',
      sellerName: 'Lisa W.',
      sellerAvatar: 'L',
      university: 'Yale',
      // NEW FEATURE: Trust badges - seller reputation data
      rating: 4.6,
      reviewCount: 89,
      verified: true,
      items: [
        {
          id: '2',
          image:
            'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzczMjQ2MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'Sony WH-1000XM4 Headphones',
          price: 220.0,
          condition: 'Excellent',
          quantity: 1,
          inStock: true,
        },
      ],
    },
    {
      sellerId: '3',
      sellerName: 'Mike T.',
      sellerAvatar: 'M',
      university: 'Berkeley',
      // NEW FEATURE: Trust badges - seller reputation data
      rating: 4.9,
      reviewCount: 203,
      verified: true,
      items: [
        {
          id: '3',
          image:
            'https://images.unsplash.com/photo-1700627565641-bd6b7890befd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcCUyMHN0dWR5fGVufDF8fHx8MTc3MzI5NjA4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          title: 'LED Desk Lamp with USB Charging',
          price: 25.0,
          condition: 'Like New',
          quantity: 2,
          inStock: true,
        },
        {
          id: '5',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
          title: 'Wireless Keyboard and Mouse Combo',
          price: 40.0,
          condition: 'Good',
          quantity: 1,
          inStock: false,
        },
      ],
    },
  ]);

  // Selected items per seller (map of sellerId to set of item IDs)
  const [selectedItems, setSelectedItems] = useState<Record<string, Set<string>>>({});

  // COMMENTED OUT: Applied vouchers - uncomment when implementing voucher system with backend
  // COMMENTED OUT: Voucher modal - uncomment when implementing voucher system with backend

  // Toast notification for user feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // NEW FEATURE: Stock notification system - track users waiting for restock
  const [stockNotifications, setStockNotifications] = useState<Record<string, boolean>>({});
  const [showStockModal, setShowStockModal] = useState<string | null>(null);

  // NEW FEATURE: Related products - recommendations based on cart items
  const [relatedProducts] = useState([
    {
      id: 'r1',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop',
      title: 'Scientific Calculator TI-84',
      price: 89.99,
      condition: 'Like New',
      seller: 'John D.',
      university: 'MIT',
    },
    {
      id: 'r2',
      image: 'https://images.unsplash.com/photo-1546868871-0111235fc75a?w=400&h=400&fit=crop',
      title: 'Desk Organizer Set',
      price: 15.5,
      condition: 'New',
      seller: 'Emma K.',
      university: 'Yale',
    },
    {
      id: 'r3',
      image: 'https://images.unsplash.com/photo-1610465299996-e9befc36f6c7?w=400&h=400&fit=crop',
      title: 'USB-C Hub Adapter',
      price: 32.0,
      condition: 'Excellent',
      seller: 'Tom R.',
      university: 'Berkeley',
    },
  ]);

  // COMMENTED OUT: LocalStorage persistence - may conflict with API cart sync
  // This saves cart state locally but should be replaced with API calls to backend
  // when real data integration is implemented to avoid sync conflicts
  //
  // useEffect(() => {
  //   localStorage.setItem("unipass_cart", JSON.stringify(sellerGroups));
  // }, [sellerGroups]);
  //
  // useEffect(() => {
  //   const savedCart = localStorage.getItem("unipass_cart");
  //   if (savedCart) {
  //     try {
  //       const parsed = JSON.parse(savedCart);
  //       setSellerGroups(parsed);
  //     } catch (e) {
  //       console.error("Failed to parse saved cart");
  //     }
  //   }
  // }, []);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle item selection for a specific seller
  const toggleItemSelection = (sellerId: string, itemId: string, inStock: boolean) => {
    if (!inStock) return; // Can't select out of stock items

    setSelectedItems(prev => {
      const sellerSelections = new Set(prev[sellerId] || []);
      if (sellerSelections.has(itemId)) {
        sellerSelections.delete(itemId);
      } else {
        sellerSelections.add(itemId);
      }
      return { ...prev, [sellerId]: sellerSelections };
    });
  };

  // Toggle all items for a seller
  const toggleAllForSeller = (sellerId: string) => {
    const seller = sellerGroups.find(g => g.sellerId === sellerId);
    if (!seller) return;

    const inStockItems = seller.items.filter(item => item.inStock);
    const allSelected = inStockItems.every(item => selectedItems[sellerId]?.has(item.id));

    setSelectedItems(prev => {
      if (allSelected) {
        return { ...prev, [sellerId]: new Set() };
      } else {
        return {
          ...prev,
          [sellerId]: new Set(inStockItems.map(item => item.id)),
        };
      }
    });
  };

  const updateQuantity = (sellerId: string, itemId: string, delta: number) => {
    setSellerGroups(groups =>
      groups.map(group =>
        group.sellerId === sellerId
          ? {
              ...group,
              items: group.items.map(item => (item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)),
            }
          : group,
      ),
    );
  };

  const removeItem = (sellerId: string, itemId: string) => {
    // COMMENTED OUT: Native window.confirm - should use custom modal component
    // when implementing with consistent design system
    // if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    //   return;
    // }

    // TODO: Replace with custom confirmation modal for better UX
    // For now, remove directly without confirmation
    setSellerGroups(groups =>
      groups
        .map(group => (group.sellerId === sellerId ? { ...group, items: group.items.filter(item => item.id !== itemId) } : group))
        .filter(group => group.items.length > 0),
    );

    // Also remove from selections
    setSelectedItems(prev => {
      const sellerSelections = new Set(prev[sellerId] || []);
      sellerSelections.delete(itemId);
      return { ...prev, [sellerId]: sellerSelections };
    });

    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
  };

  // COMMENTED OUT: Voucher functions - uncomment when implementing voucher system with backend API

  // NEW FEATURE: Stock notification system - allow users to subscribe to restock notifications
  const handleStockNotification = (itemId: string) => {
    setStockNotifications(prev => ({ ...prev, [itemId]: true }));
    setShowStockModal(null);
    showToast('Bạn sẽ nhận thông báo khi sản phẩm có hàng trở lại', 'success');
  };

  const handleCheckout = (sellerId: string) => {
    const seller = sellerGroups.find(g => g.sellerId === sellerId);
    if (!seller) return;

    const selected = selectedItems[sellerId] || new Set();
    if (selected.size === 0) return;

    // Navigate to checkout with selected seller and items
    navigate('/checkout', {
      state: {
        sellerId,
        selectedItemIds: Array.from(selected),
        sellerGroups,
      },
    });
  };

  const totalItems = sellerGroups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">Giỏ hàng</h1>
          <p className="text-gray-600">{totalItems} sản phẩm</p>
        </div>

        {sellerGroups.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">Hãy bắt đầu mua sắm để thêm sản phẩm vào giỏ hàng</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors"
            >
              Xem sản phẩm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items Grouped by Seller */}
            {sellerGroups.map(group => {
              const sellerSelections = selectedItems[group.sellerId] || new Set();
              const inStockItems = group.items.filter(item => item.inStock);
              const allSelected = inStockItems.length > 0 && inStockItems.every(item => sellerSelections.has(item.id));
              const someSelected = inStockItems.some(item => sellerSelections.has(item.id));

              return (
                <div key={group.sellerId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Seller Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleAllForSeller(group.sellerId)}
                        disabled={inStockItems.length === 0}
                        className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] disabled:opacity-50"
                      />
                      <Store className="w-5 h-5 text-[#0A2647]" />
                      <div className="w-8 h-8 bg-gradient-to-br from-[#0A2647] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {group.sellerAvatar}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-medium text-[#0A2647]">{group.sellerName}</span>
                        {group.verified && <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />}
                        <span className="text-xs text-gray-500">• {group.university}</span>

                        {/* NEW FEATURE: Trust badges - display seller rating and review count */}
                        {group.rating && (
                          <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-yellow-50 rounded-full">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium text-yellow-700">{group.rating}</span>
                            <span className="text-xs text-gray-500">({group.reviewCount})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="p-6 space-y-4">
                    {group.items.map(item => {
                      const isSelected = sellerSelections.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className={`flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 ${
                            !item.inStock ? 'opacity-60' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <div className="flex items-start pt-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItemSelection(group.sellerId, item.id, item.inStock)}
                              disabled={!item.inStock}
                              className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] disabled:opacity-50"
                            />
                          </div>

                          {/* Product Image */}
                          <Link
                            to={`/product/${item.id}`}
                            className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative block hover:opacity-80 transition-opacity"
                          >
                            <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">Hết hàng</span>
                              </div>
                            )}
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.id}`}
                              className="font-medium text-gray-900 hover:text-[#FF6B35] mb-2 line-clamp-2 block transition-colors"
                            >
                              {item.title}
                            </Link>
                            <div className="flex items-center gap-2 mb-2">
                              <Tag className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{item.condition}</span>
                            </div>

                            {item.inStock ? (
                              <div className="flex items-center justify-between">
                                {/* Quantity Selector */}
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                  <button
                                    onClick={() => updateQuantity(group.sellerId, item.id, -1)}
                                    disabled={item.quantity === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(group.sellerId, item.id, 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <div className="text-lg font-bold text-[#FF5722]">${(item.price * item.quantity).toFixed(2)}</div>
                                  {item.quantity > 1 && <div className="text-xs text-gray-500">${item.price.toFixed(2)} mỗi cái</div>}
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* NEW FEATURE: Stock notification for out-of-stock items */}
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm text-red-600 font-medium">Sản phẩm đã hết hàng</span>
                                    {stockNotifications[item.id] ? (
                                      <span className="text-xs text-green-600 flex items-center gap-1">
                                        <Bell className="w-3 h-3" />
                                        Đã đăng ký thông báo
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => setShowStockModal(item.id)}
                                        className="text-xs text-[#FF6B35] hover:text-[#FF5722] font-medium flex items-center gap-1 transition-colors w-fit"
                                      >
                                        <Bell className="w-3 h-3" />
                                        Nhận thông báo khi có hàng
                                      </button>
                                    )}
                                  </div>
                                  <div className="text-lg font-bold text-gray-400 line-through">${item.price.toFixed(2)}</div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(group.sellerId, item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* COMMENTED OUT: Voucher Section - uncomment when implementing with backend API */}

                  {/* Seller Actions */}
                  <div className="px-6 pb-6 flex items-center justify-end gap-3">
                    <Link
                      to="/messages"
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0A2647] text-[#0A2647] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Link>
                    <button
                      onClick={() => handleCheckout(group.sellerId)}
                      disabled={!someSelected}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FF6B35]"
                    >
                      Mua hàng ({sellerSelections.size})
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link to="/" className="inline-flex items-center gap-2 text-[#FF6B35] hover:text-[#FF5722] font-medium transition-colors">
              ← Tiếp tục mua sắm
            </Link>

            {/* NEW FEATURE: Related Products Recommendation - show recommended items based on cart */}
            {sellerGroups.length > 0 && relatedProducts.length > 0 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
                  <h2 className="text-xl font-bold text-[#0A2647]">Có thể bạn cũng thích</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedProducts.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group border border-gray-200 rounded-lg p-4 hover:border-[#FF6B35] hover:shadow-md transition-all"
                    >
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-3">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-[#FF6B35] transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{product.condition}</span>
                        <span className="text-lg font-bold text-[#FF5722]">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">{product.seller}</span>
                        <span>•</span>
                        <span>{product.university}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sticky Summary - Fixed at bottom on mobile, sidebar on desktop */}
        {sellerGroups.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t-2 border-gray-200 p-4 shadow-lg z-40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Đã chọn: {Object.values(selectedItems).reduce((sum, set) => sum + set.size, 0)} sản phẩm
              </span>
              <span className="text-lg font-bold text-[#FF6B35]">
                $
                {sellerGroups
                  .reduce((total, group) => {
                    const selected = selectedItems[group.sellerId] || new Set();
                    const subtotal = group.items
                      .filter(item => selected.has(item.id))
                      .reduce((sum, item) => sum + item.price * item.quantity, 0);
                    // COMMENTED OUT: Discount calculation - uncomment when voucher system is implemented
                    // return total + subtotal - calculateDiscount(group.sellerId, subtotal);
                    return total + subtotal;
                  }, 0)
                  .toFixed(2)}
              </span>
            </div>
            <button
              disabled={Object.values(selectedItems).every(set => set.size === 0)}
              className="w-full py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                const firstSellerWithSelection = Object.keys(selectedItems).find(id => selectedItems[id].size > 0);
                if (firstSellerWithSelection) {
                  handleCheckout(firstSellerWithSelection);
                }
              }}
            >
              Mua hàng
            </button>
          </div>
        )}

        {/* COMMENTED OUT: Voucher Modal - uncomment when implementing voucher system with backend API */}

        {/* NEW FEATURE: Stock Notification Modal - subscribe to restock alerts */}
        {showStockModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-[#0A2647] to-[#144272] p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Thông báo hàng về</h2>
                </div>
                <button onClick={() => setShowStockModal(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Sản phẩm này hiện đang hết hàng. Bạn có muốn nhận thông báo khi sản phẩm có hàng trở lại không?
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">Chúng tôi sẽ gửi email hoặc thông báo đẩy ngay khi người bán cập nhật hàng mới.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowStockModal(null)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Để sau
                  </button>
                  <button
                    onClick={() => handleStockNotification(showStockModal)}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Nhận thông báo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-slideUp">
            <div
              className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
                toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              <BadgeCheck className="w-5 h-5" />
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
