import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, BadgeCheck, Tag } from 'lucide-react';
import { ImageWithFallback } from '../../shared/figma/ImageWithFallback';
import { Link } from 'react-router';

interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  seller: string;
  university: string;
  condition: string;
  quantity: number;
}

export function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      image:
        'https://images.unsplash.com/photo-1633707392225-d883c8cd3e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2slMjBzdGFja3xlbnwxfHx8fDE3NzMyOTYwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Calculus Early Transcendentals 8th Ed.',
      price: 45.0,
      seller: 'Sarah M.',
      university: 'MIT',
      condition: 'Like New',
      quantity: 1,
    },
    {
      id: '2',
      image:
        'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwZWxlY3Ryb25pY3N8ZW58MXx8fHwxNzczMjQ2MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'Sony WH-1000XM4 Headphones',
      price: 220.0,
      seller: 'Lisa W.',
      university: 'Yale',
      condition: 'Excellent',
      quantity: 1,
    },
    {
      id: '3',
      image:
        'https://images.unsplash.com/photo-1700627565641-bd6b7890befd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcCUyMHN0dWR5fGVufDF8fHx8MTc3MzI5NjA4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: 'LED Desk Lamp with USB Charging',
      price: 25.0,
      seller: 'Mike T.',
      university: 'Berkeley',
      condition: 'Like New',
      quantity: 2,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = subtotal * 0.05; // 5% platform fee
  const total = subtotal + platformFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {item.seller.charAt(0)}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-700">{item.seller}</span>
                              <BadgeCheck className="w-4 h-4 text-[#FF6B35]" />
                            </div>
                            <span className="text-xs text-gray-500">• {item.university}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{item.condition}</span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#0A2647]">${(item.price * item.quantity).toFixed(2)}</div>
                          {item.quantity > 1 && <div className="text-xs text-gray-500">${item.price.toFixed(2)} each</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <a href="/" className="inline-flex items-center gap-2 text-[#FF6B35] hover:text-[#FF5722] font-medium transition-colors">
                ← Continue Shopping
              </a>
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#0A2647] mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Platform Fee */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-700">Platform Fee</span>
                      <span className="text-xs text-gray-500">(5%)</span>
                    </div>
                    <span className="font-medium text-gray-900">${platformFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#0A2647]">${total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500">Tax calculated at checkout</p>
                  </div>
                </div>
                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="w-full py-4 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Security Notice */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#0A2647] rounded-lg flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#0A2647] mb-1">Secure Transaction</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        All sellers are verified university students. Your purchase is protected.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Savings */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Tag className="w-4 h-4" />
                    <span>
                      {"You're saving "}${(subtotal * 0.3).toFixed(2)} compared to retail!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
