import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenEmergency }) => {
  const { lang, t } = useLanguage();
  const { role, setRole } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 rounded-xl transition-all gap-3 text-sm font-medium ${
      isActive
        ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_2px_8px_-2px_rgba(53,75,62,0.1)]'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        style={{ insetInlineStart: 0 }}
        className={`fixed top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col pt-20 pb-6 shadow-[0_2px_8px_-2px_rgba(75,56,46,0.05)] border-r border-outline-variant/30 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : lang === 'ar' ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        {/* Role Selector Pill */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between p-1 rounded-full bg-surface-container shadow-inner">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex-1 py-1 rounded-full text-xs font-semibold transition-all text-center ${
                role === 'student'
                  ? 'bg-surface-container-lowest text-primary shadow-[0_1px_3px_0_rgba(75,56,46,0.03)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.student}
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('doctor')}
              className={`flex-1 py-1 rounded-full text-xs font-semibold transition-all text-center ${
                role === 'doctor'
                  ? 'bg-surface-container-lowest text-primary shadow-[0_1px_3px_0_rgba(75,56,46,0.03)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.doctor}
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 py-1 rounded-full text-xs font-semibold transition-all text-center ${
                role === 'admin'
                  ? 'bg-surface-container-lowest text-primary shadow-[0_1px_3px_0_rgba(75,56,46,0.03)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.admin}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <NavLink
            to="/"
            end
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={navItemClass}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>{role === 'student' ? (lang === 'ar' ? 'الرئيسية' : 'Home') : t.dashboard}</span>
          </NavLink>

          {/* Admin Command Link (Highlighted when in admin role) */}
          {role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={navItemClass}
            >
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
              <span>{t.adminHub}</span>
            </NavLink>
          )}

          {/* Maintenance Section */}
          <div className="pt-3 pb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-outline">
            {t.maintenance}
          </div>
          <NavLink
            to="/my-reports"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={navItemClass}
          >
            <span className="material-symbols-outlined text-[20px]">assignment</span>
            <span>{t.myReports}</span>
          </NavLink>
          <NavLink
            to="/submit-issue"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={navItemClass}
          >
            <span className="material-symbols-outlined text-[20px]">report_problem</span>
            <span>{t.submitIssue}</span>
          </NavLink>

          {/* Lost & Found Section */}
          <div className="pt-3 pb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-outline">
            {t.lostAndFound}
          </div>
          <NavLink
            to="/lost-items"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={navItemClass}
          >
            <span className="material-symbols-outlined text-[20px]">search_check</span>
            <span>{lang === 'ar' ? 'المفقودات والمعثورات' : 'Lost & Found'}</span>
          </NavLink>
          {role !== 'student' && (
            <NavLink
              to="/found-items"
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={navItemClass}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>{t.foundItems}</span>
            </NavLink>
          )}
          <NavLink
            to="/claim-requests"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={navItemClass}
          >
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span>{t.claimRequests}</span>
          </NavLink>

          {/* Updates Section */}
          <div className="pt-3 pb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-outline">
            {t.updates}
          </div>
          <NavLink
            to="/notifications"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={navItemClass}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="flex-1">{t.notifications}</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Emergency Hotline Card & Help Center Bottom Tile */}
        <div className="px-4 pt-3 mt-auto">
          <div className="p-3.5 rounded-2xl bg-surface-container flex flex-col gap-2 border border-outline-variant/30 shadow-sm">
            <div className="flex items-center gap-2 text-secondary text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              <span>{t.emergencyHotline}</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              {t.emergencyOps}
            </p>
            <button
              type="button"
              onClick={onOpenEmergency}
              className="text-xs text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1 mt-1 font-semibold text-left"
            >
              <span>{t.helpCenter}</span>
              <span className="material-symbols-outlined text-[14px]">
                {lang === 'ar' ? 'arrow_back' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
