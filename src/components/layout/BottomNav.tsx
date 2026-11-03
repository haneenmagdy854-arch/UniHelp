import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNav: React.FC = () => {
  const { t, lang } = useLanguage();
  const { role } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-colors ${
      isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/30 z-30 lg:hidden flex items-center justify-around px-2 shadow-[0_-2px_8px_rgba(75,56,46,0.05)]">
      <NavLink to="/" end className={navClass}>
        <span className="material-symbols-outlined text-[20px]">dashboard</span>
        <span className="text-[10px]">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
      </NavLink>

      <NavLink to="/my-reports" className={navClass}>
        <span className="material-symbols-outlined text-[20px]">assignment</span>
        <span className="text-[10px]">{t.myReports}</span>
      </NavLink>

      <NavLink
        to="/submit-issue"
        aria-label={t.submitIssue}
        title={t.submitIssue}
        className="flex flex-col items-center justify-center -mt-5 bg-primary text-on-primary w-12 h-12 rounded-full shadow-lg hover:bg-tertiary transition-transform active:scale-95"
      >
        <span className="material-symbols-outlined text-[24px]">add</span>
      </NavLink>

      <NavLink to="/lost-items" className={navClass}>
        <span className="material-symbols-outlined text-[20px]">search_check</span>
        <span className="text-[10px]">{lang === 'ar' ? 'المفقودات' : 'Lost & Found'}</span>
      </NavLink>

      {role === 'admin' ? (
        <NavLink to="/admin" className={navClass}>
          <span className="material-symbols-outlined text-[20px]">shield_person</span>
          <span className="text-[10px]">{t.admin}</span>
        </NavLink>
      ) : (
        <NavLink to="/notifications" className={navClass}>
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="text-[10px]">{t.notifications}</span>
        </NavLink>
      )}
    </nav>
  );
};
