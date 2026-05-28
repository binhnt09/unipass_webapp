import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';
import { Mail, AlertCircle } from 'lucide-react';

import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(
    () => () => {
      dispatch(reset());
    },
    [],
  );

  const handleValidSubmit = async (values: any) => {
    const mail = (values.email ?? '').toString().trim();
    setResetError(null);
    try {
      await dispatch(handlePasswordResetInit(mail)).unwrap();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResetError(error.response?.data?.message || error.response?.data?.detail || error.message);
      } else {
        setResetError('Đã có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu.');
      }
    }
  };

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#FF6B35]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-[#0A2647] mb-2">
            <Translate contentKey="reset.request.title">Reset your password</Translate>
          </h1>
          <p className="text-center text-gray-600 text-sm">
            <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
          </p>
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
            <ValidatedField
              name="email"
              label={translate('global.form.email.placeholder')}
              labelClass="block text-sm font-medium text-gray-700 mb-2"
              placeholder={translate('global.form.email.placeholder')}
              type="email"
              validate={{
                required: { value: true, message: translate('global.messages.validate.email.required') },
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
              data-cy="emailResetPassword"
              className="mb-0"
              inputClass="w-full pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />

            <button
              type="submit"
              data-cy="submit"
              className="w-full py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md"
            >
              <Translate contentKey="reset.request.form.button">Reset password</Translate>
            </button>
          </ValidatedForm>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Sau khi gửi, bạn sẽ nhận được email với liên kết đặt lại mật khẩu. Liên kết này sẽ hết hạn sau 24 giờ.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Kiểm tra folder <strong>Spam</strong> nếu bạn không nhận được email sau vài phút.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetInit;
