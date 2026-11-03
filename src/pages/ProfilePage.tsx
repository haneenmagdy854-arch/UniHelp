import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { checkBackendConnection, isSupabaseConfigured } from '../services/supabase';

export const ProfilePage: React.FC = () => {
  const { lang, t, setLanguage } = useLanguage();
  const { user, updateProfile, role, setRole } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [building, setBuilding] = useState(user?.building || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedToast, setSavedToast] = useState(false);

  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    message: string;
    isMock: boolean;
  }>({
    connected: false,
    message: 'Checking...',
    isMock: true
  });

  useEffect(() => {
    checkBackendConnection().then((res) => setBackendStatus(res));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      department,
      building,
      phone
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatarUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDzsdr8AR31Mqn_SpbpEz66QScm7EhbrKGAFEGPMv0mZ1gj-c29PcguJwLlkvylIAW4q7oANEwjBcZ-YxlrKcLdmEDL6gnOEUXeoitgWr9iZYwWTdDeDo7seQxjSMBwNvRdxgDcMfr0C-7yhWsv0MFDnfMgQmzVcSv5zPiL20oSLVy5De5skubvVTwTwHQYCP5eWgKlZjW9EwD6zY7AoxxvldayoUBP4lTzh6aPyu-6'
            }
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-fixed"
          />
          <div>
            <h1 className="text-xl font-bold text-on-surface">{user?.name}</h1>
            <p className="text-xs text-on-surface-variant">{user?.email}</p>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {savedToast && (
          <div className="px-4 py-2 rounded-xl bg-[#E6F4EA] border border-[#A3D9B1] text-[#1E5E3A] text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{lang === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Profile updated successfully'}</span>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 space-y-6">
        <h2 className="text-base font-bold text-on-surface">
          {lang === 'ar' ? 'المعلومات الشخصية والأكاديمية' : 'Personal & Academic Details'}
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-on-surface mb-1">
                {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-on-surface mb-1">
                {lang === 'ar' ? 'الكلية / القسم' : 'College / Department'}
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">
                {lang === 'ar' ? 'المبنى الافتراضي / المكتب' : 'Default Building / Office'}
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-on-surface mb-1">
                {lang === 'ar' ? 'رقم الهاتف / الجوال' : 'Contact Phone'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-on-surface mb-1">
                {lang === 'ar' ? 'لغة الواجهة المفضلة' : 'Interface Language'}
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    lang === 'en'
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-transparent'
                  }`}
                >
                  English (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all font-arabic ${
                    lang === 'ar'
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-transparent'
                  }`}
                >
                  العربية (RTL)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary shadow-sm transition-all active:scale-95"
            >
              {lang === 'ar' ? 'حفظ التغييرات' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Backend & Security Diagnostic Tile */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">database</span>
            <h3 className="font-bold text-sm text-on-surface">Backend & Database Infrastructure</h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              backendStatus.connected
                ? 'bg-[#E6F4EA] text-[#1E5E3A]'
                : 'bg-secondary-fixed text-on-secondary-fixed-variant'
            }`}
          >
            {backendStatus.connected
              ? lang === 'ar' ? 'اتصال Supabase مباشر' : 'Supabase connected'
              : lang === 'ar' ? 'Supabase غير متصل' : 'Supabase not connected'}
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {backendStatus.message}
        </p>

        {!isSupabaseConfigured && (
          <div className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface-variant space-y-1">
            <span className="font-bold text-on-surface block">
              {lang === 'ar' ? 'إعداد الاتصال:' : 'Connection setup:'}
            </span>
            <p>
              {lang === 'ar'
                ? <>أضف <code className="bg-surface-container px-1 rounded">VITE_SUPABASE_URL</code> و<code className="bg-surface-container px-1 rounded">VITE_SUPABASE_ANON_KEY</code> إلى ملف <code className="bg-surface-container px-1 rounded">.env</code>. راجع مخطط قاعدة البيانات الحالي قبل أي تغيير؛ لا تشغّل ملف المخطط تلقائيًا.</>
                : <>Add <code className="bg-surface-container px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-surface-container px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to <code className="bg-surface-container px-1 rounded">.env</code>. Review the existing database schema before making changes; do not apply the schema file automatically.</>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
