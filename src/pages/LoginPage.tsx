import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

export const LoginPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('nour.almansour@campus.edu');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, selectedRole);
    setLoading(false);
    if (selectedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 shadow-xl border border-outline-variant/30 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              alt={`${t.appName} Logo`}
              className="h-10 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyid1nxTCvD5ZbPiWtRrRPaHkWl4CX7ffbVBfgnukHN_UxXiYCmM9h1hKRHDoCOx50sfzcS17UMj4i7LdMUCXnOId7u-KFacDc4Wk9Ii0u6jeKZAuITOp9pMeIq3vdMsAYwwcG_tcAnapLb3WaJsafN9Q7eZ0Qez_1HzaotgjjGnty23z2VJSt43Q_CJCkEsfeCGESRg4R3pIiUUX5i97D_rIYth8ytx8X9rhGP8zv"
            />
            <span className="font-bold text-2xl text-primary tracking-tight">{t.appName}</span>
          </Link>
          <p className="text-xs text-on-surface-variant font-medium">
            {lang === 'ar' ? 'بوابة الدخول الموحد للخدمات الجامعية' : 'University Support & Facilities Portal'}
          </p>
        </div>

        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>

        <div className="p-1 rounded-2xl bg-surface-container flex items-center gap-1 shadow-inner border border-outline-variant/20">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'student'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.student}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('doctor')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'doctor'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.doctor}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === 'admin'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.admin}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني الجامعي' : 'University Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-on-surface">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline text-[11px] font-semibold">
                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? lang === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Signing in...' : lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
          <span>{lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}</span>
          <Link to="/register" className="text-primary font-bold hover:underline">
            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Register Now'}
          </Link>
        </div>
      </div>
    </div>
  );
};
