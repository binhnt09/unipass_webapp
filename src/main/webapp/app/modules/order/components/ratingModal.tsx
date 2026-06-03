import React, { useState } from 'react';
import { X, Star, Camera, Image as CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/figma/ImageWithFallback';
import axios from 'axios';

interface RatingModalProps {
  order: {
    id: string;
    orderNumber: string;
    sellerName: string;
    sellerUniversity: string;
    items: {
      id: string;
      productImage: string;
      productTitle: string;
      variation?: string;
      quantity: number;
      unitPrice: number;
    }[];
  };
  onClose: () => void;
}

interface ProductRating {
  productId: string;
  rating: number;
  comment: string;
  tags: string[];
  images: File[];
}

export function RatingModal({ order, onClose }: RatingModalProps) {
  const [currentStep, setCurrentStep] = useState<'rating' | 'success'>('rating');
  const [ratings, setRatings] = useState<Record<string, ProductRating>>(
    Object.fromEntries(order.items.map(item => [item.id, { productId: item.id, rating: 5, comment: '', tags: [], images: [] }])),
  );
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const qualityTags = [
    '📦 Đúng như mô tả',
    '✨ Chất lượng tốt',
    '💰 Giá tốt',
    '🎓 Phù hợp sinh viên',
    '🚀 Giao hàng nhanh',
    '💬 Người bán thân thiện',
    '📸 Giống hình ảnh',
    '🔝 Sẽ mua lại',
  ];

  const handleRatingChange = (productId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setRatings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  const handleTagToggle = (productId: string, tag: string) => {
    setRatings(prev => {
      const currentTags = prev[productId].tags;
      const newTags = currentTags.includes(tag) ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
      return {
        ...prev,
        [productId]: { ...prev[productId], tags: newTags },
      };
    });
  };

  const handleImageUpload = (productId: string, files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).slice(0, 5 - ratings[productId].images.length);
    setRatings(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: [...prev[productId].images, ...newImages],
      },
    }));
  };

  const handleRemoveImage = (productId: string, index: number) => {
    setRatings(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: prev[productId].images.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const ratingValues = Object.values(ratings);
      const avgRating = Math.round(ratingValues.reduce((sum, r) => sum + r.rating, 0) / ratingValues.length);
      const combinedComment = ratingValues
        .filter(r => r.comment.trim() || r.tags.length > 0)
        .map(r => {
          const item = order.items.find(i => i.id === r.productId);
          let text = item ? `[${item.productTitle}] ` : '';
          if (r.tags.length > 0) text += r.tags.join(', ') + '. ';
          if (r.comment) text += r.comment;
          return text;
        })
        .join('\n');

      await axios.post(`/api/orders/${order.id}/review`, {
        rating: avgRating,
        comment: combinedComment,
      });

      setCurrentStep('success');
    } catch (error: any) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert(error.response?.data?.title || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Rất không hài lòng';
      case 2:
        return 'Không hài lòng';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Hài lòng';
      case 5:
        return 'Rất hài lòng';
      default:
        return '';
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2647] mb-3">Cảm ơn bạn đã đánh giá!</h2>
          <p className="text-gray-600 mb-2">Đánh giá của bạn đã được gửi thành công</p>
          <p className="text-sm text-gray-500 mb-6">
            Bạn nhận được <span className="text-[#FF6B35] font-bold">+10 điểm uy tín</span> cho việc đánh giá
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-[#0A2647]">Đánh giá sản phẩm</h2>
            <p className="text-sm text-gray-600">Đơn hàng: {order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="max-h-[calc(100vh-250px)] overflow-y-auto px-6 py-6">
          {/* Seller Info */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-6 border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-full flex items-center justify-center text-white font-bold">
                {order.sellerName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[#0A2647]">{order.sellerName}</p>
                <p className="text-xs text-gray-600">{order.sellerUniversity}</p>
              </div>
            </div>
          </div>

          {/* Products Rating */}
          <div className="space-y-6">
            {order.items.map(item => {
              const rating = ratings[item.id];
              const displayRating = hoveredStars[item.id] || rating.rating;

              return (
                <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#FF6B35]/30 transition-colors">
                  {/* Product Info */}
                  <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{item.productTitle}</h3>
                      {item.variation && <p className="text-sm text-gray-500">Phân loại: {item.variation}</p>}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Chất lượng sản phẩm</label>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [item.id]: star }))}
                            onMouseLeave={() =>
                              setHoveredStars(prev => {
                                const newState = { ...prev };
                                delete newState[item.id];
                                return newState;
                              })
                            }
                            onClick={() => handleRatingChange(item.id, star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star className={`w-10 h-10 ${star <= displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-lg font-medium text-[#FF6B35]">{getRatingText(displayRating)}</span>
                    </div>
                  </div>

                  {/* Quick Tags */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Đánh giá nhanh</label>
                    <div className="flex flex-wrap gap-2">
                      {qualityTags.map(tag => {
                        const isSelected = rating.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(item.id, tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              isSelected ? 'bg-[#FF6B35] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chia sẻ thêm về sản phẩm
                      <span className="text-gray-400 font-normal ml-2">(Không bắt buộc)</span>
                    </label>
                    <textarea
                      value={rating.comment}
                      onChange={e => handleCommentChange(item.id, e.target.value)}
                      placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này nhé..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none text-sm"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{rating.comment.length}/500</p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Thêm hình ảnh/video
                      <span className="text-gray-400 font-normal ml-2">(Tối đa 5)</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {/* Uploaded Images */}
                      {rating.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                          <img src={URL.createObjectURL(image)} alt={`Upload ${imgIndex + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveImage(item.id, imgIndex)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      ))}

                      {/* Upload Button */}
                      {rating.images.length < 5 && (
                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] hover:bg-orange-50 transition-colors">
                          <Camera className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Thêm ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => handleImageUpload(item.id, e.target.files)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                💡 <span className="font-medium">Mẹo:</span> Đánh giá chi tiết giúp người mua khác
              </p>
              <p>
                🎁 Bạn nhận <span className="text-[#FF6B35] font-bold">+10 điểm uy tín</span> sau khi đánh giá
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              Để sau
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
