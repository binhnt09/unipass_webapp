import React, { useState, useEffect } from 'react';
import { X, MapPin, Home, Package, AlertCircle, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import type { TradeType, MeetingLocationType } from '../../../shared/types/trade';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

interface CreateTradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | undefined;
  productTitle?: string;
  productPrice: number;
  productImage: string;
  sellerId?: number;
}

interface OfferedItemForm {
  name: string;
  description: string;
  estimatedValue: string;
  condition: string;
  imageFiles: File[];
  imagePreviews: string[];
}

const EMPTY_ITEM: OfferedItemForm = {
  name: '',
  description: '',
  estimatedValue: '',
  condition: '',
  imageFiles: [],
  imagePreviews: [],
};

export function CreateTradeRequestModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  productPrice,
  productImage,
  sellerId,
}: CreateTradeRequestModalProps) {
  // const { user } = useAuth();
  const navigate = useNavigate();

  // Offered items (max 2)
  const [offeredItems, setOfferedItems] = useState<OfferedItemForm[]>([{ ...EMPTY_ITEM }]);

  // Form state
  const [tradeType, setTradeType] = useState<TradeType>('with_cash');
  const [cashDifference, setCashDifference] = useState('');
  const [reason, setReason] = useState('');
  const [phone, setPhone] = useState('');

  // Meeting location state
  const [meetingLocationType, setMeetingLocationType] = useState<MeetingLocationType>('public_place');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [publicPlace, setPublicPlace] = useState('');
  const [locationNotes, setLocationNotes] = useState('');

  // Validation & submission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      offeredItems.forEach(item => {
        item.imagePreviews.forEach(url => {
          if (url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
      });
    };
  }, []);

  if (!isOpen) return null;

  // ─── Offered items helpers ───
  const updateItem = (index: number, updates: Partial<OfferedItemForm>) => {
    setOfferedItems(prev => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const addItem = () => {
    if (offeredItems.length < 2) {
      setOfferedItems(prev => [...prev, { ...EMPTY_ITEM }]);
    }
  };

  const removeItem = (index: number) => {
    if (offeredItems.length > 1) {
      offeredItems[index].imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      setOfferedItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = (index: number, files: FileList) => {
    const item = offeredItems[index];
    const remaining = 5 - item.imageFiles.length;
    const newFiles = Array.from(files).slice(0, remaining);

    const newPreviews = newFiles.map(f => URL.createObjectURL(f));

    updateItem(index, {
      imageFiles: [...item.imageFiles, ...newFiles],
      imagePreviews: [...item.imagePreviews, ...newPreviews],
    });
  };

  const removeImage = (itemIndex: number, imageIndex: number) => {
    const item = offeredItems[itemIndex];
    const url = item.imagePreviews[imageIndex];
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);

    updateItem(itemIndex, {
      imageFiles: item.imageFiles.filter((_, i) => i !== imageIndex),
      imagePreviews: item.imagePreviews.filter((_, i) => i !== imageIndex),
    });
  };

  // ─── Value calculations ───
  const getTotalOfferedValue = () => {
    return offeredItems.reduce((sum, item) => sum + (parseFloat(item.estimatedValue) || 0), 0);
  };

  const getValueDifference = () => {
    const totalOffered = getTotalOfferedValue();
    const cash = parseFloat(cashDifference) || 0;
    return productPrice - (totalOffered + cash);
  };

  // ─── Validation ───
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    offeredItems.forEach((item, i) => {
      if (!item.name.trim()) newErrors[`item${i}_name`] = 'Vui lòng nhập tên món đồ';
      if (!item.estimatedValue || parseFloat(item.estimatedValue) <= 0) newErrors[`item${i}_value`] = 'Vui lòng nhập giá trị ước tính';
      if (!item.condition) newErrors[`item${i}_condition`] = 'Vui lòng chọn tình trạng';
      if (item.imageFiles.length === 0) newErrors[`item${i}_images`] = 'Vui lòng thêm ít nhất 1 hình ảnh';
    });

    if (tradeType === 'with_cash') {
      if (!cashDifference || parseFloat(cashDifference) < 0) {
        newErrors.cashDifference = 'Vui lòng nhập số tiền bù hợp lệ';
      }
    }

    if (!reason.trim()) newErrors.reason = 'Vui lòng cho biết lý do muốn đổi';

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (meetingLocationType === 'buyer_address' && !buyerAddress.trim()) newErrors.buyerAddress = 'Vui lòng nhập địa chỉ';
    if (meetingLocationType === 'public_place' && !publicPlace.trim()) newErrors.publicPlace = 'Vui lòng nhập địa điểm';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit handler ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Step 1: Upload images for each offered item
      const newOfferedItems: {
        name: string;
        description: string;
        price: number;
        condition: string;
        imageUrls: string[];
      }[] = [];
      for (const item of offeredItems) {
        const uploadedUrls: string[] = [];
        for (const file of item.imageFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await axios.post<string>('/api/product-images/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          uploadedUrls.push(uploadRes.data);
        }

        newOfferedItems.push({
          name: item.name.trim(),
          description: item.description.trim(),
          price: parseFloat(item.estimatedValue),
          condition: item.condition,
          imageUrls: uploadedUrls,
        });
      }

      // Step 2: Build and send the trade request payload
      const payload = {
        tradeRequest: {
          targetProduct: { id: productId },
          seller: sellerId ? { id: sellerId } : undefined,
          topUpAmount: tradeType === 'with_cash' ? parseFloat(cashDifference) : 0,
          meetupLocation: meetingLocationType === 'buyer_address' ? buyerAddress : publicPlace,
          status: 'PENDING',
        },
        newOfferedItems,
      };

      await axios.post('/api/trade-requests/create-with-items', payload);

      toast.success('Đề xuất đổi đồ đã được gửi thành công!');
      onClose();
      setTimeout(() => navigate('/trades/mine'), 500);
    } catch (err) {
      console.error('Error creating trade request:', err);
      toast.error('Có lỗi xảy ra khi tạo đề xuất đổi đồ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const valueDiff = getValueDifference();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-600" />
              Đề xuất đổi đồ
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Đổi lấy: {productTitle}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Target product */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Món đồ bạn muốn lấy:</p>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img src={productImage} alt={productTitle} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">{productTitle}</h4>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{productPrice.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>

          {/* Offered items */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Món đồ bạn muốn đem đổi (Tối đa 2 món) *</label>

            {offeredItems.map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 mb-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-purple-600">Món đồ {idx + 1}</span>
                  {offeredItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Image upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hình ảnh (tối đa 5) *</label>
                  <div className="flex gap-2 flex-wrap">
                    {item.imagePreviews.map((url, imgIdx) => (
                      <div key={imgIdx} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx, imgIdx)}
                          disabled={isSubmitting}
                          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-bl-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs disabled:opacity-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {item.imageFiles.length < 5 && (
                      <label
                        className={`w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-400">Thêm ảnh</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={isSubmitting}
                          onChange={e => e.target.files && handleImageUpload(idx, e.target.files)}
                        />
                      </label>
                    )}
                  </div>
                  {errors[`item${idx}_images`] && <p className="text-sm text-red-600 mt-1">{errors[`item${idx}_images`]}</p>}
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên món đồ *</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => updateItem(idx, { name: e.target.value })}
                    placeholder="VD: Laptop Dell Inspiron 15"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                  {errors[`item${idx}_name`] && <p className="text-sm text-red-600 mt-1">{errors[`item${idx}_name`]}</p>}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                  <textarea
                    value={item.description}
                    onChange={e => updateItem(idx, { description: e.target.value })}
                    placeholder="Mô tả tình trạng, phụ kiện đi kèm..."
                    rows={2}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none disabled:opacity-50"
                  />
                </div>

                {/* Value & Condition row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giá trị ước tính (VND) *</label>
                    <input
                      type="number"
                      value={item.estimatedValue}
                      onChange={e => updateItem(idx, { estimatedValue: e.target.value })}
                      placeholder="5000000"
                      min="0"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                    {errors[`item${idx}_value`] && <p className="text-sm text-red-600 mt-1">{errors[`item${idx}_value`]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tình trạng *</label>
                    <select
                      value={item.condition}
                      onChange={e => updateItem(idx, { condition: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    >
                      <option value="">Chọn tình trạng</option>
                      <option value="Brand New">Mới 100%</option>
                      <option value="Like New">Như mới (99%)</option>
                      <option value="Excellent">Rất tốt</option>
                      <option value="Good">Tốt</option>
                      <option value="Fair">Trung bình</option>
                    </select>
                    {errors[`item${idx}_condition`] && <p className="text-sm text-red-600 mt-1">{errors[`item${idx}_condition`]}</p>}
                  </div>
                </div>
              </div>
            ))}

            {offeredItems.length < 2 && (
              <button
                type="button"
                onClick={addItem}
                disabled={isSubmitting}
                className="w-full py-3 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Thêm món đồ thứ 2
              </button>
            )}
          </div>

          {/* Trade type & value summary */}
          <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Loại trao đổi</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tradeType"
                  value="straight"
                  checked={tradeType === 'straight'}
                  onChange={e => setTradeType(e.target.value as TradeType)}
                  className="w-4 h-4 text-purple-600"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Đổi thẳng (không bù tiền)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="tradeType"
                  value="with_cash"
                  checked={tradeType === 'with_cash'}
                  onChange={e => setTradeType(e.target.value as TradeType)}
                  className="w-4 h-4 text-purple-600"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Đổi + bù tiền</span>
              </label>

              {tradeType === 'with_cash' && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số tiền bạn sẽ bù thêm *</label>
                  <input
                    type="number"
                    value={cashDifference}
                    onChange={e => setCashDifference(e.target.value)}
                    placeholder="4000000"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  />
                  {errors.cashDifference && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.cashDifference}</p>}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-purple-300 dark:border-purple-700">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tổng giá trị món đổi:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{getTotalOfferedValue().toLocaleString('vi-VN')}đ</span>
                </div>
                {tradeType === 'with_cash' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tiền bù thêm:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      + {(parseFloat(cashDifference) || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-purple-300 dark:border-purple-700">
                  <span className="text-gray-600 dark:text-gray-400">Giá trị món đổi lấy:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{productPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-purple-400 dark:border-purple-600">
                  <span className="font-bold text-gray-900 dark:text-white">Chênh lệch:</span>
                  <span
                    className={`text-lg font-bold ${valueDiff > 0 ? 'text-red-600' : valueDiff < 0 ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    {valueDiff > 0 && '+'}
                    {valueDiff.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
              {valueDiff > 0 && (
                <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Giá trị đề xuất thấp hơn {valueDiff.toLocaleString('vi-VN')}đ. Cân nhắc tăng số tiền bù để tăng khả năng được chấp
                      nhận.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Lý do muốn đổi *</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="VD: Cần laptop cho học tập..."
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none disabled:opacity-50"
            />
            {errors.reason && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.reason}</p>}
          </div>

          {/* Meeting location */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Địa điểm gặp mặt đề xuất *</label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="locationType"
                  value="buyer_address"
                  checked={meetingLocationType === 'buyer_address'}
                  onChange={e => setMeetingLocationType(e.target.value as MeetingLocationType)}
                  className="w-4 h-4 text-purple-600 mt-1"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Địa chỉ của tôi</span>
                  </div>
                  {meetingLocationType === 'buyer_address' && (
                    <input
                      type="text"
                      value={buyerAddress}
                      onChange={e => setBuyerAddress(e.target.value)}
                      placeholder="VD: Ký túc xá A"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                  )}
                  {errors.buyerAddress && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.buyerAddress}</p>}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="locationType"
                  value="public_place"
                  checked={meetingLocationType === 'public_place'}
                  onChange={e => setMeetingLocationType(e.target.value as MeetingLocationType)}
                  className="w-4 h-4 text-purple-600 mt-1"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Địa điểm công cộng</span>
                  </div>
                  {meetingLocationType === 'public_place' && (
                    <input
                      type="text"
                      value={publicPlace}
                      onChange={e => setPublicPlace(e.target.value)}
                      placeholder="VD: Thư viện"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                  )}
                  {errors.publicPlace && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.publicPlace}</p>}
                </div>
              </label>

              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ghi chú thêm (tùy chọn)</label>
                <input
                  type="text"
                  value={locationNotes}
                  onChange={e => setLocationNotes(e.target.value)}
                  placeholder="VD: Gần cổng B"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Số điện thoại liên hệ *</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0912 345 678"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
            />
            {errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đề xuất đổi đồ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
