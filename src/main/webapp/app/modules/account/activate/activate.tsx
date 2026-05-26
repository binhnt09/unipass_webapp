import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { activateAction, reset } from './activate.reducer';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const ActivatePage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      dispatch(activateAction(key));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, searchParams]);

  const { activationSuccess, activationFailure } = useAppSelector(state => state.activate);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#0A2647] text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-md flex items-center justify-center font-bold">U</div>
            <div>
              <h2 className="text-xl font-semibold">Unipass</h2>
              <p className="text-sm text-white/80">Xác thực tài khoản của bạn</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {activationSuccess && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Translate contentKey="activate.title">Activation</Translate>
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                <Translate contentKey="activate.messages.success">
                  <strong>Your user account has been activated.</strong> Please
                </Translate>
              </p>
              <Link to="/login" className="inline-block w-full py-3 bg-[#FF6B35] text-white rounded-lg text-center font-medium">
                <Translate contentKey="global.messages.info.authenticated.link">Sign in</Translate>
              </Link>
            </div>
          )}

          {activationFailure && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kích hoạt thất bại</h3>
              <p className="text-sm text-gray-600 mb-6">
                <Translate contentKey="activate.messages.error">
                  <strong>Your user could not be activated.</strong> Please use the registration form to sign up.
                </Translate>
              </p>
              <div className="flex gap-3">
                <Link to="/" className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg text-center">
                  Về trang chủ
                </Link>
                <Link to="/account/register" className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg text-center">
                  Đăng ký lại
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivatePage;
