import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, ValidatedForm, isEmail, translate } from 'react-jhipster';
import { Link } from 'react-router';

import { toast } from 'react-toastify';
import './register.scss';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

import { handleRegister } from './register.reducer';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(fetchUniversities());
  //   return () => {
  //     dispatch(reset());
  //   };
  // }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const universities = useAppSelector(state => state.register.universities);
  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const handleValidSubmit = (values: any) => {
    const { firstName, lastName, universityId, studentIdNumber, email, firstPassword } = values;
    dispatch(
      handleRegister({
        login: email, // Backend set login to email
        email,
        password: firstPassword,
        langKey: currentLocale,
        firstName,
        lastName,
        universityId,
        studentIdNumber,
      }),
    );
  };

  const updatePassword = event => setPassword(event.target.value);

  const updateStudentId = event => {
    const uppercaseValue = event.target.value.toUpperCase();
    event.target.value = uppercaseValue;
    setStudentId(uppercaseValue);
  };

  const renderEmailHelperText = () => {
    if (!studentId || studentId.length < 4) return null;

    // Attempt to parse batch
    const match = studentId.match(/^[A-Z]{2}(\d{2})/);
    if (match) {
      const batch = parseInt(match[1], 10);
      if (batch <= 18) {
        return (
          <div className="mt-1 text-sm text-blue-600 font-medium">
            Hệ thống yêu cầu bạn nhập đúng Email @fpt.edu.vn chính chủ của mã sinh viên này
          </div>
        );
      } else {
        return <div className="mt-1 text-sm text-emerald-600 font-medium">Khóa K19 có thể tự do sử dụng Email cá nhân để đăng ký</div>;
      }
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 id="register-title" data-cy="registerTitle" className="text-3xl font-semibold text-slate-900 mb-6">
          <Translate contentKey="register.title">Registration</Translate>
        </h1>
        <ValidatedForm id="register-form" onSubmit={handleValidSubmit} mode="onBlur" className="register-form space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValidatedField
              name="firstName"
              label={translate('settings.form.firstname')}
              labelClass="block text-sm font-medium text-slate-700 mb-2"
              placeholder={translate('settings.form.firstname.placeholder')}
              validate={{
                required: { value: true, message: 'Vui lòng nhập tên' },
                minLength: { value: 1, message: 'Tên phải có ít nhất 1 ký tự' },
                maxLength: { value: 50, message: 'Tên không được vượt quá 50 ký tự' },
              }}
              data-cy="firstName"
              inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <ValidatedField
              name="lastName"
              label={translate('settings.form.lastname')}
              labelClass="block text-sm font-medium text-slate-700 mb-2"
              placeholder={translate('settings.form.lastname.placeholder')}
              validate={{
                required: { value: true, message: 'Vui lòng nhập họ' },
                minLength: { value: 1, message: 'Họ phải có ít nhất 1 ký tự' },
                maxLength: { value: 50, message: 'Họ không được vượt quá 50 ký tự' },
              }}
              data-cy="lastName"
              inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <ValidatedField
            type="select"
            name="universityId"
            label="Trường học"
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            validate={{
              required: { value: true, message: 'Vui lòng chọn trường học' },
            }}
            data-cy="university"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="" key="0" />
            {universities
              ? universities.map(otherEntity => (
                  <option value={otherEntity.id} key={otherEntity.id}>
                    {otherEntity.name}
                  </option>
                ))
              : null}
          </ValidatedField>

          <ValidatedField
            name="studentIdNumber"
            label="Mã sinh viên"
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder="Ví dụ: HE18012"
            onChange={updateStudentId}
            onBlur={updateStudentId}
            validate={{
              required: { value: true, message: 'Mã sinh viên là bắt buộc' },
              pattern: {
                value: /^[A-Z]{2}\d{5}$/,
                message: 'Mã sinh viên không đúng định dạng FPT (VD: HE18012)',
              },
            }}
            data-cy="studentIdNumber"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <div>
            <ValidatedField
              name="email"
              label={translate('global.form.email.label')}
              labelClass="block text-sm font-medium text-slate-700 mb-2"
              placeholder={translate('global.form.email.placeholder')}
              type="email"
              validate={{
                required: { value: true, message: translate('global.messages.validate.email.required') },
                minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
              }}
              data-cy="email"
              inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {renderEmailHelperText()}
          </div>

          <ValidatedField
            name="firstPassword"
            label={translate('global.form.newpassword.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.newpassword.placeholder')}
            type="password"
            onChange={updatePassword}
            validate={{
              required: { value: true, message: translate('global.messages.validate.newpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
            }}
            data-cy="firstPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <PasswordStrengthBar password={password} />

          <ValidatedField
            className="mb-6"
            name="secondPassword"
            label={translate('global.form.confirmpassword.label')}
            labelClass="block text-sm font-medium text-slate-700 mb-2"
            placeholder={translate('global.form.confirmpassword.placeholder')}
            type="password"
            validate={{
              required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
              minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
              maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
              validate: v => v === password || translate('global.messages.error.dontmatch'),
            }}
            data-cy="secondPassword"
            inputClass="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="terms" className="text-sm text-slate-700">
              Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi
            </label>
          </div>

          <div>
            <button
              id="register-submit"
              type="submit"
              data-cy="submit"
              disabled={!termsAccepted}
              className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition ${
                termsAccepted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <Translate contentKey="register.form.button">Register</Translate>
            </button>
          </div>
        </ValidatedForm>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 mt-6">
          <span>
            <Translate contentKey="global.messages.info.authenticated.prefix">If you want to</Translate>{' '}
          </span>
          <Link to="/login" className="font-semibold text-amber-900 underline">
            <Translate contentKey="global.messages.info.authenticated.link">sign in</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
