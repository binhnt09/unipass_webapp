import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { useSearchParams } from 'react-router';
import { Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

import { toast } from 'react-toastify';

import { useAppDispatch } from 'app/config/store';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { handlePasswordResetFinish, reset } from '../password-reset.reducer';

export const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');

  const [password, setPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = async (values: any) => {
    const { newPassword } = values;

    if (!key) {
      setResetError('Không tìm thấy mã token đặt lại mật khẩu. Vui lòng sử dụng đường dẫn đúng.');
      return;
    }

    if (!newPassword || !newPassword.trim()) {
      setResetError('Mật khẩu không được để trống.');
      return;
    }

    setResetError(null);
    try {
      await dispatch(handlePasswordResetFinish({ key, newPassword: newPassword.trim() })).unwrap();
      toast.success('Mật khẩu của bạn đã được đặt lại thành công!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || error.response?.data?.detail || error.message;
        setResetError(errorMsg === 'error.http.400' ? 'Mật khẩu không hợp lệ. Hãy thử mật khẩu khác.' : errorMsg);
      } else {
        setResetError('Đã có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.');
      }
    }
  };

  const updatePassword = event => setPassword(event.target.value);

  if (!key) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#0A2647] mb-2">Liên kết không hợp lệ</h2>
          <p className="text-gray-600 mb-6">Mã token đặt lại mật khẩu không được tìm thấy. Vui lòng yêu cầu liên kết mới.</p>
          <a
            href="/account/reset/request"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors"
          >
            Yêu cầu đặt lại mật khẩu
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#FF6B35]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-[#0A2647] mb-2">
            <Translate contentKey="reset.finish.title">Reset password</Translate>
          </h1>
          <p className="text-center text-gray-600 text-sm">Vui lòng nhập mật khẩu mới của bạn</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {resetError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{resetError}</p>
            </div>
          )}

          <ValidatedForm onSubmit={handleValidSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
              <div className="relative flex flex-col justify-center">
                <Lock className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                <ValidatedField
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới (tối thiểu 4 ký tự)"
                  type="password"
                  validate={{
                    required: { value: true, message: 'Mật khẩu không được để trống' },
                    minLength: { value: 4, message: 'Mật khẩu tối thiểu 4 ký tự' },
                    maxLength: { value: 50, message: 'Mật khẩu tối đa 50 ký tự' },
                    validate(v) {
                      if (!v || v.trim().length === 0) return 'Mật khẩu không được là khoảng trắng';
                      return true;
                    },
                  }}
                  onChange={updatePassword}
                  data-cy="resetPassword"
                  className="w-full pl-8"
                  inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                />
              </div>
              <div className="mt-3">
                <PasswordStrengthBar password={password} />
              </div>
              <p className="mt-2 text-xs text-gray-500">Mật khẩu tối thiểu 4 ký tự, khuyến nghị 6-8 ký tự trở lên.</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <div className="relative flex flex-col justify-center">
                <Lock className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                <ValidatedField
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu của bạn"
                  type="password"
                  validate={{
                    required: { value: true, message: 'Vui lòng xác nhận mật khẩu' },
                    minLength: { value: 4, message: 'Mật khẩu tối thiểu 4 ký tự' },
                    maxLength: { value: 50, message: 'Mật khẩu tối đa 50 ký tự' },
                    validate(v) {
                      if (!v || v.trim().length === 0) return 'Mật khẩu không được là khoảng trắng';
                      if (v !== password) return 'Mật khẩu không trùng khớp';
                      return true;
                    },
                  }}
                  data-cy="confirmResetPassword"
                  className="w-full pl-8"
                  inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              data-cy="submit"
              className="w-full py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <Translate contentKey="reset.finish.form.button">Validate new password</Translate>
            </button>
          </ValidatedForm>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Mật khẩu sẽ được cập nhật ngay lập tức. Bạn có thể đăng nhập với mật khẩu mới.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Nếu bạn không có liên kết này,{' '}
            <a href="/account/reset/request" className="font-semibold hover:underline">
              yêu cầu mã mới
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetFinishPage;
