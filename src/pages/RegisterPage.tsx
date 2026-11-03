import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

export const RegisterPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('College of Engineering');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register({
      name,
      email,
      role,
      department
    });
    setLoading(false);
    navigate('/');
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
            {lang === 'ar' ? 'إنشاء حساب جامعي جديد' : `Create ${t.appName} Account`}
          </p>
        </div>

        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: حنين مجدي' : 'e.g. Haneen Magdy'}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
            />
          </div>

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

          <div>
            <label className="block font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'نوع الحساب / الدور' : 'Account Role'}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none text-xs font-semibold"
            >
              <option value="student">{t.student}</option>
              <option value="doctor">{t.doctor}</option>
              <option value="admin">{t.admin}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating...' : lang === 'ar' ? 'تسجيل الحساب' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
          <span>{lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}</span>
          <Link to="/login" className="text-primary font-bold hover:underline">
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
};
