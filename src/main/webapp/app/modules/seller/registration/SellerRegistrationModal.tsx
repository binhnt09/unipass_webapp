import React, { useState } from 'react';
import { X, CheckCircle, ArrowLeft, ArrowRight, Loader2, Phone, MapPin, FileText, Camera, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useAppSelector } from 'app/config/store';
import { useAuth } from 'app/contexts/AuthContext';

interface SellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerRegistrationModal({ isOpen, onClose }: SellerRegistrationModalProps) {
  const navigate = useNavigate();
  const account = useAppSelector(state => state.authentication.account);
  const { user } = useAuth();
  const currentUserId = account?.id || Number(user?.id);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hostelLocation, setHostelLocation] = useState('');
  const [bio, setBio] = useState('');
  const [idCardUrl, setIdCardUrl] = useState('');
  const [uploadPreview, setUploadPreview] = useState('');

  // Drag and drop state
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  // Regions list for FPT University Hoa Lac campus surroundings
  const regions = [
    { value: 'KTX Dom A', label: 'Kí túc xá Dom A' },
    { value: 'KTX Dom B', label: 'Kí túc xá Dom B' },
    { value: 'KTX Dom C', label: 'Kí túc xá Dom C' },
    { value: 'KTX Dom D', label: 'Kí túc xá Dom D' },
    { value: 'KTX Dom E', label: 'Kí túc xá Dom E' },
    { value: 'KTX Dom G', label: 'Kí túc xá Dom G' },
    { value: 'Tân Xã', label: 'Khu vực Tân Xã' },
    { value: 'Hạ Bằng', label: 'Khu vực Hạ Bằng' },
    { value: 'Thạch Hòa', label: 'Khu vực Thạch Hòa' },
    { value: 'Khác', label: 'Khu vực khác gần Hoa Lạc' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chỉ tải lên các tệp định dạng hình ảnh.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 10MB.');
      return;
    }

    setIsUploading(true);
    const localPreviewUrl = URL.createObjectURL(file);
    setUploadPreview(localPreviewUrl);

    try {
      const imageFormData = new FormData();
      imageFormData.append('file', file);

      const response = await axios.post<any>('/api/seller-requests/my-id-card', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const backendUrl = response.data.url || response.data;
      setIdCardUrl(backendUrl);
      toast.success('Tải ảnh xác minh lên thành công!');
    } catch (err) {
      console.error('Lỗi tải ảnh xác minh:', err);
      toast.error('Tải ảnh xác minh thất bại. Vui lòng thử lại!');
      setUploadPreview('');
      setIdCardUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!phoneNumber || phoneNumber.trim() === '') {
        toast.error('Vui lòng nhập số điện thoại liên hệ.');
        return;
      }
      if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phoneNumber.trim())) {
        toast.error('Số điện thoại không đúng định dạng Việt Nam (10 chữ số).');
        return;
      }
      if (!hostelLocation) {
        toast.error('Vui lòng chọn khu vực phòng trọ của bạn.');
        return;
      }
    }

    if (step === 2) {
      if (!bio || bio.trim() === '') {
        toast.error('Vui lòng mô tả ngắn về mặt hàng bạn dự định bán.');
        return;
      }
      if (bio.trim().length < 10) {
        toast.error('Mô tả tiểu sử phải tối thiểu 10 ký tự.');
        return;
      }
    }

    if (step === 3) {
      if (!idCardUrl) {
        toast.error('Vui lòng tải lên ảnh CCCD hoặc Thẻ sinh viên để xác minh.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4) return;

    setIsSubmitting(true);
    try {
      const finalPayload = {
        phoneNumber: phoneNumber.trim(),
        hostelLocation,
        bio: bio.trim(),
        idCardUrl, // The local path returned from Step 3
        user: { id: currentUserId }, // Links the request to the active student account
        submittedAt: new Date().toISOString(), // Current timestamp matching Instant type
        status: 'PENDING', // Enforces the starting verification state
      };

      await axios.post('/api/seller-requests', finalPayload);
      toast.success('Yêu cầu đăng ký làm Người bán đã được gửi thành công!');

      // Close the modal and navigate to success polling page
      onClose();
      navigate('/seller-success');
    } catch (err: any) {
      console.error('Lỗi gửi yêu cầu đăng ký:', err);
      const serverMsg = err.response?.data?.title || err.response?.data?.message;
      toast.error(serverMsg || 'Gửi yêu cầu đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0A2647] text-white p-6 relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Nâng Cấp Tài Khoản Người Bán</h2>
          </div>
          <p className="text-white/80 text-xs">Trở thành người bán để bắt đầu kinh doanh trên UniPass Hoa Lạc</p>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="bg-gray-50 border-b border-gray-100 py-4 px-6 flex-shrink-0">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FF6B35] transition-all duration-300 z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {[1, 2, 3, 4].map(s => {
              const label = (() => {
                switch (s) {
                  case 1:
                    return 'Liên hệ';
                  case 2:
                    return 'Sản phẩm';
                  case 3:
                    return 'Xác minh';
                  case 4:
                    return 'Hoàn tất';
                  default:
                    return '';
                }
              })();
              const isActive = step >= s;
              const isCurrent = step === s;
              return (
                <div key={`step-indicator-${s}`} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#FF6B35] text-white ring-4 ring-orange-100 scale-110'
                        : isActive
                          ? 'bg-[#0A2647] text-white'
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {isActive && s < step ? '✓' : s}
                  </div>
                  <span
                    className={`text-[10px] font-medium mt-1 transition-colors duration-300 ${
                      isActive ? 'text-[#0A2647] font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Content - Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* STEP 1: CONTACT INFORMATION */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-[#0A2647]">
                  <p className="font-semibold mb-1">💡 Hướng dẫn bước 1:</p>
                  Cung cấp số điện thoại chính xác để người mua có thể liên lạc và lựa chọn đúng khu vực học tập/cư trú của bạn tại khu vực
                  FPT Hoa Lạc.
                </div>

                {/* Phone number input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="Ví dụ: 0987654321"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Số điện thoại liên hệ di động gồm 10 chữ số bắt đầu bằng đầu số Việt Nam.</p>
                </div>

                {/* Hostel location select */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Khu vực phòng trọ/Ký túc xá tại Hoa Lạc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <select
                      value={hostelLocation}
                      onChange={e => setHostelLocation(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white text-sm text-gray-700 appearance-none"
                      required
                    >
                      <option value="">Chọn khu vực cư trú của bạn</option>
                      {regions.map(r => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-5 h-5">
                        <path d="M6 8l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Khu vực sinh hoạt này giúp tối ưu hóa việc vận chuyển và giao dịch trực tiếp.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: BUSINESS BIO */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-[#0A2647]">
                  <p className="font-semibold mb-1">💡 Hướng dẫn bước 2:</p>
                  Mô tả ngắn gọn về các loại mặt hàng/dịch vụ bạn muốn đăng bán trên UniPass. Điều này giúp chúng tôi phê duyệt vai trò của
                  bạn nhanh hơn.
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Mô tả ngắn mặt hàng dự định kinh doanh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Ví dụ: Mình dự định bán lại sách giáo trình cũ kì 1-9, tài liệu ôn thi môn tiếng Anh, các đồ điện tử gia dụng như quạt bàn, ấm siêu tốc..."
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white text-sm resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                    <span>Tối thiểu 10 ký tự</span>
                    <span>{bio.trim().length} ký tự</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ID CARD VERIFICATION IMAGE */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-[#0A2647]">
                  <p className="font-semibold mb-1">🔒 Bảo mật tuyệt đối:</p>
                  Tải lên ảnh CCCD (mặt trước) hoặc Thẻ sinh viên chính chủ. Dữ liệu này chỉ được dùng để đội ngũ quản trị viên xác thực
                  danh tính người bán, phòng chống lừa đảo trong chợ trường.
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Ảnh thẻ căn cước (CCCD) hoặc Thẻ sinh viên <span className="text-red-500">*</span>
                  </label>

                  {/* Upload zone */}
                  <div
                    onDragEnter={!isUploading && !isSubmitting ? handleDrag : undefined}
                    onDragLeave={!isUploading && !isSubmitting ? handleDrag : undefined}
                    onDragOver={!isUploading && !isSubmitting ? handleDrag : undefined}
                    onDrop={!isUploading && !isSubmitting ? handleDrop : undefined}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      dragActive
                        ? 'border-[#FF6B35] bg-orange-50'
                        : 'border-gray-300 bg-gray-50 hover:border-[#FF6B35] hover:bg-orange-50/30'
                    } ${isUploading || isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-[#FF6B35]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Kéo & thả ảnh thẻ xác minh vào đây</p>
                        <p className="text-xs text-gray-500">hoặc click để duyệt ảnh</p>
                      </div>
                      <input
                        type="file"
                        id="modalFileInput"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={isUploading || isSubmitting}
                      />
                      <label
                        htmlFor="modalFileInput"
                        className="px-5 py-2 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Chọn ảnh thẻ
                      </label>
                      <p className="text-[10px] text-gray-400">Định dạng JPG, PNG dung lượng dưới 10MB.</p>
                    </div>
                  </div>

                  {/* Preview file upload */}
                  {isUploading && (
                    <div className="flex items-center justify-center gap-2 py-4 text-[#FF6B35] text-sm font-medium">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tải ảnh lên hệ thống...</span>
                    </div>
                  )}

                  {!isUploading && uploadPreview && (
                    <div className="mt-4 p-2 border border-gray-200 rounded-lg relative bg-gray-50 max-w-xs mx-auto">
                      <img src={uploadPreview} alt="Xác minh" className="w-full h-40 object-contain rounded-md" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
                  <p className="font-semibold mb-1">✓ Đã sẵn sàng gửi hồ sơ:</p>
                  Vui lòng kiểm tra lại toàn bộ thông tin đăng ký bên dưới trước khi xác nhận gửi yêu cầu nâng cấp tài khoản.
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3 text-sm">
                  {/* Phone */}
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Số điện thoại:</span>
                    <span className="text-gray-900 font-semibold">{phoneNumber}</span>
                  </div>

                  {/* Hostel Location */}
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Khu vực phòng trọ:</span>
                    <span className="text-gray-900 font-semibold">
                      {regions.find(r => r.value === hostelLocation)?.label || hostelLocation}
                    </span>
                  </div>

                  {/* Bio */}
                  <div className="border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium block mb-1">Tiểu sử kinh doanh:</span>
                    <p className="text-gray-900 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-150 text-xs">{bio}</p>
                  </div>

                  {/* Verified Image Preview */}
                  <div>
                    <span className="text-gray-500 font-medium block mb-1">Ảnh xác minh đã tải lên:</span>
                    <div className="mt-1 flex items-center gap-3">
                      <img
                        src={
                          idCardUrl && idCardUrl.startsWith('/uploads/') ? `http://localhost:8080${idCardUrl}` : idCardUrl || uploadPreview
                        }
                        alt="Xác minh"
                        className="w-24 h-16 object-cover rounded-md border border-gray-300"
                      />
                      <div className="text-xs text-gray-500">
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Ảnh đã lưu trên cloud
                        </span>
                        <p className="mt-0.5 truncate max-w-[200px]">{idCardUrl}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 leading-relaxed">
                  Nhấn nút <strong>&quot;Xác nhận &amp; Gửi yêu cầu&quot;</strong> đồng nghĩa với việc bạn cam kết các thông tin khai báo
                  trên là chính xác và hoàn toàn chịu trách nhiệm về các sản phẩm kinh doanh của mình.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer - Persistent Control Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          {/* Back Button */}
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          ) : (
            <div />
          )}

          {/* Next / Submit Button */}
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isUploading || (step === 3 && !idCardUrl)}
              className="px-6 py-2.5 bg-[#0A2647] hover:bg-[#144272] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              Tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !idCardUrl}
              className="px-8 py-2.5 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang gửi yêu cầu...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Xác nhận & Gửi yêu cầu
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
