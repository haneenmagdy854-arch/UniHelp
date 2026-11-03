import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high hover:text-on-surface transition-all shadow-sm border border-outline-variant/30 active:scale-95"
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      aria-pressed={lang === 'ar'}
    >
      <span className={lang === 'en' ? 'text-primary font-bold' : 'opacity-70'}>EN</span>
      <span className="mx-1.5 text-outline-variant">|</span>
      <span lang="ar" className={lang === 'ar' ? 'text-primary font-bold font-arabic' : 'opacity-70'}>
        عربي
      </span>
    </button>
  );
};
