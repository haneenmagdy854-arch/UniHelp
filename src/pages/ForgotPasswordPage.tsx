import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

export const ForgotPasswordPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
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
          <h2 className="text-lg font-bold text-on-surface">
            {lang === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'}
          </h2>
          <p className="text-xs text-on-surface-variant font-medium">
            {lang === 'ar'
              ? 'أدخل بريدك الجامعي لإرسال رابط إعادة تعيين كلمة المرور'
              : 'Enter your university email to receive a password recovery link'}
          </p>
        </div>

        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-[#E6F4EA] border border-[#A3D9B1] text-[#1E5E3A] text-center space-y-2">
            <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
            <p className="font-bold text-sm">
              {lang === 'ar' ? 'تم إرسال رابط الاستعادة إلى بريدك!' : 'Recovery link dispatched to your inbox!'}
            </p>
            <p className="text-xs">
              {lang === 'ar' ? 'يرجى مراجعة صندوق الوارد والبريد غير الهام.' : 'Please inspect your university inbox.'}
            </p>
            <div className="pt-2">
              <Link to="/login" className="text-xs font-bold text-primary hover:underline">
                {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          </div>
        ) : (
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
                placeholder="name@campus.edu"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary transition-all shadow-md active:scale-95"
            >
              {lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
          <Link to="/login" className="text-primary font-bold hover:underline">
            {lang === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};
