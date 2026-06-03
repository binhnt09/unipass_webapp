// NEW FEATURE: Create Trade Request Modal - Form for users to propose item exchange
// Allows uploading up to 2 items + cash difference to trade for seller's item
// Features: Image upload, value estimation, meeting location selection

import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, MapPin, Home, Package, AlertCircle } from 'lucide-react';
import type { TradeType, MeetingLocationType, MeetingLocation } from '../../../shared/types/trade';

interface CreateTradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | undefined;
  productTitle?: string;
  productPrice: number;
  productImage: string;
  onSubmit: (data: TradeRequestFormData) => void;
}

export interface TradeRequestFormData {
  offeredItems: {
    title: string;
    description: string;
    estimatedValue: number;
    condition: string;
    images: File[];
  }[];
  tradeType: TradeType;
  cashDifference: number;
  reason: string;
  meetingLocation: MeetingLocation;
  phone: string;
}

export function CreateTradeRequestModal({
  isOpen,
  onClose,
  productTitle,
  productPrice,
  productImage,
  onSubmit,
}: CreateTradeRequestModalProps) {
  // Form state
  const [offeredItems, setOfferedItems] = useState<
    {
      title: string;
      description: string;
      estimatedValue: string;
      condition: string;
      images: File[];
      imagePreviews: string[];
    }[]
  >([{ title: '', description: '', estimatedValue: '', condition: '', images: [], imagePreviews: [] }]);

  const [tradeType, setTradeType] = useState<TradeType>('with_cash');
  const [cashDifference, setCashDifference] = useState('');
  const [reason, setReason] = useState('');
  const [phone, setPhone] = useState('');

  // Meeting location state
  const [meetingLocationType, setMeetingLocationType] = useState<MeetingLocationType>('public_place');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [publicPlace, setPublicPlace] = useState('');
  const [locationNotes, setLocationNotes] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Add new offered item (max 2)
  const addOfferedItem = () => {
    if (offeredItems.length < 2) {
      setOfferedItems([...offeredItems, { title: '', description: '', estimatedValue: '', condition: '', images: [], imagePreviews: [] }]);
    }
  };

  // Remove offered item
  const removeOfferedItem = (index: number) => {
    if (offeredItems.length > 1) {
      setOfferedItems(offeredItems.filter((_, i) => i !== index));
    }
  };

  // Handle image upload
  const handleImageUpload = (itemIndex: number, files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - offeredItems[itemIndex].images.length);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setOfferedItems(items =>
      items.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              images: [...item.images, ...newFiles],
              imagePreviews: [...item.imagePreviews, ...newPreviews],
            }
          : item,
      ),
    );
  };

  // Remove image
  const removeImage = (itemIndex: number, imageIndex: number) => {
    setOfferedItems(items =>
      items.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              images: item.images.filter((_, ii) => ii !== imageIndex),
              imagePreviews: item.imagePreviews.filter((_, ii) => ii !== imageIndex),
            }
          : item,
      ),
    );
  };

  // Calculate total offered value
  const getTotalOfferedValue = () => {
    return offeredItems.reduce((sum, item) => {
      const value = parseFloat(item.estimatedValue) || 0;
      return sum + value;
    }, 0);
  };

  // Calculate value difference
  const getValueDifference = () => {
    const totalOffered = getTotalOfferedValue();
    const cash = parseFloat(cashDifference) || 0;
    return productPrice - (totalOffered + cash);
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate offered items
    offeredItems.forEach((item, index) => {
      if (!item.title.trim()) {
        newErrors[`item${index}_title`] = 'Vui lòng nhập tên món đồ';
      }
      if (!item.description.trim()) {
        newErrors[`item${index}_description`] = 'Vui lòng mô tả món đồ';
      }
      if (!item.estimatedValue || parseFloat(item.estimatedValue) <= 0) {
        newErrors[`item${index}_value`] = 'Vui lòng nhập giá trị hợp lệ';
      }
      if (item.images.length === 0) {
        newErrors[`item${index}_images`] = 'Vui lòng upload ít nhất 1 ảnh';
      }
    });

    // Validate cash difference
    if (tradeType === 'with_cash') {
      if (!cashDifference || parseFloat(cashDifference) < 0) {
        newErrors.cashDifference = 'Vui lòng nhập số tiền bù hợp lệ';
      }
    }

    // Validate reason
    if (!reason.trim()) {
      newErrors.reason = 'Vui lòng cho biết lý do muốn đổi';
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Validate meeting location
    if (meetingLocationType === 'buyer_address' && !buyerAddress.trim()) {
      newErrors.buyerAddress = 'Vui lòng nhập địa chỉ của bạn';
    }
    if (meetingLocationType === 'public_place' && !publicPlace.trim()) {
      newErrors.publicPlace = 'Vui lòng nhập địa điểm công cộng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData: TradeRequestFormData = {
      offeredItems: offeredItems.map(item => ({
        title: item.title,
        description: item.description,
        estimatedValue: parseFloat(item.estimatedValue),
        condition: item.condition,
        images: item.images,
      })),
      tradeType,
      cashDifference: tradeType === 'with_cash' ? parseFloat(cashDifference) : 0,
      reason,
      phone,
      meetingLocation: {
        type: meetingLocationType,
        address: meetingLocationType === 'buyer_address' ? buyerAddress : undefined,
        publicPlace: meetingLocationType === 'public_place' ? publicPlace : undefined,
        notes: locationNotes || undefined,
      },
    };

    onSubmit(formData);
  };

  const valueDiff = getValueDifference();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-600" />
              Đề xuất đổi đồ
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Đổi lấy: {productTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Target Product Info */}
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

          {/* Offered Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">Món đồ bạn muốn đổi ({offeredItems.length}/2)</label>
              {offeredItems.length < 2 && (
                <button
                  type="button"
                  onClick={addOfferedItem}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm món đồ thứ 2
                </button>
              )}
            </div>

            <div className="space-y-6">
              {offeredItems.map((item, index) => (
                <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 relative">
                  {/* Remove button */}
                  {offeredItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOfferedItem(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Món đồ #{index + 1}</p>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ảnh món đồ (tối đa 5 ảnh) *</label>
                    <div className="grid grid-cols-5 gap-2">
                      {item.imagePreviews.map((preview, imgIndex) => (
                        <div key={imgIndex} className="relative aspect-square">
                          <img src={preview} alt={`Preview ${imgIndex + 1}`} className="w-full h-full object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeImage(index, imgIndex)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {item.images.length < 5 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                          <Upload className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handleImageUpload(index, e.target.files)}
                          />
                        </label>
                      )}
                    </div>
                    {errors[`item${index}_images`] && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors[`item${index}_images`]}</p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên món đồ *</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => {
                        const newItems = [...offeredItems];
                        newItems[index].title = e.target.value;
                        setOfferedItems(newItems);
                      }}
                      placeholder="VD: iPad Air M1 64GB"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {errors[`item${index}_title`] && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors[`item${index}_title`]}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả chi tiết *</label>
                    <textarea
                      value={item.description}
                      onChange={e => {
                        const newItems = [...offeredItems];
                        newItems[index].description = e.target.value;
                        setOfferedItems(newItems);
                      }}
                      placeholder="Mô tả tình trạng, thời gian sử dụng, bảo hành còn lại..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    />
                    {errors[`item${index}_description`] && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors[`item${index}_description`]}</p>
                    )}
                  </div>

                  {/* Value & Condition */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Giá trị ước tính *</label>
                      <input
                        type="number"
                        value={item.estimatedValue}
                        onChange={e => {
                          const newItems = [...offeredItems];
                          newItems[index].estimatedValue = e.target.value;
                          setOfferedItems(newItems);
                        }}
                        placeholder="8000000"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {errors[`item${index}_value`] && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors[`item${index}_value`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tình trạng</label>
                      <select
                        value={item.condition}
                        onChange={e => {
                          const newItems = [...offeredItems];
                          newItems[index].condition = e.target.value;
                          setOfferedItems(newItems);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Chọn tình trạng</option>
                        <option value="Mới 99%">Mới 99%</option>
                        <option value="Như mới">Như mới</option>
                        <option value="Đã qua sử dụng">Đã qua sử dụng</option>
                        <option value="Cũ">Cũ</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Type & Cash Difference */}
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
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.cashDifference && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.cashDifference}</p>}
                </div>
              )}
            </div>

            {/* Value Comparison */}
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
              placeholder="VD: Cần laptop cho học tập, iPad không phù hợp với công việc hiện tại..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
            {errors.reason && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.reason}</p>}
          </div>

          {/* Meeting Location */}
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
                      placeholder="VD: Ký túc xá A, Phòng 305, ĐH Bách Khoa Hà Nội"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      placeholder="VD: Thư viện Tầng 2, Quán cafe A..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                  {errors.publicPlace && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.publicPlace}</p>}
                </div>
              </label>

              {/* Location Notes */}
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ghi chú thêm (tùy chọn)</label>
                <input
                  type="text"
                  value={locationNotes}
                  onChange={e => setLocationNotes(e.target.value)}
                  placeholder="VD: Gần cổng B, bên cạnh cây ATM..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all shadow-lg"
            >
              Gửi đề xuất đổi đồ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
