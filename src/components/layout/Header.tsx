import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenEmergency }) => {
  const { lang, t } = useLanguage();
  const { user, role, setRole } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const navigate = useNavigate();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lost-items?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(75,56,46,0.04)] border-b border-outline-variant/30">
      <div className="h-16 w-full px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger (Mobile) + Logo */}
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container lg:hidden"
            aria-label={lang === 'ar' ? 'فتح قائمة التنقل' : 'Open navigation menu'}
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              alt={`${t.appName} Logo`}
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyid1nxTCvD5ZbPiWtRrRPaHkWl4CX7ffbVBfgnukHN_UxXiYCmM9h1hKRHDoCOx50sfzcS17UMj4i7LdMUCXnOId7u-KFacDc4Wk9Ii0u6jeKZAuITOp9pMeIq3vdMsAYwwcG_tcAnapLb3WaJsafN9Q7eZ0Qez_1HzaotgjjGnty23z2VJSt43Q_CJCkEsfeCGESRg4R3pIiUUX5i97D_rIYth8ytx8X9rhGP8zv"
            />
            <span className="font-bold text-lg sm:text-xl text-primary tracking-tight">{t.appName}</span>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="w-full flex items-center bg-surface-container-low px-4 py-2 rounded-full shadow-[0_1px_3px_rgba(75,56,46,0.03)] border border-outline-variant/30 focus-within:border-primary focus-within:bg-surface-container-lowest transition-all">
              <span className="material-symbols-outlined text-outline text-[18px] mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                dir="auto"
                className="w-full bg-transparent border-none text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/65 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-outline hover:text-on-surface text-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1 sm:gap-3 justify-end shrink-0">
          <LanguageSwitcher />

          {/* New Report CTA Button */}
          {role === 'admin' && (
            <Link
              to="/submit-issue"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs sm:text-sm font-semibold hover:bg-tertiary-container hover:text-on-tertiary-container shadow-[0_2px_6px_rgba(53,75,62,0.12)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>{t.newReport}</span>
            </Link>
          )}

          {/* Notifications Bell with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              title={t.notifications}
              aria-label={t.notifications}
              aria-expanded={showNotifMenu}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-on-secondary text-[10px] font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-on-surface">{t.notifications}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    {lang === 'ar' ? 'عرض الكل' : 'View all'}
                  </Link>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/20">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        void markNotificationRead(notif.id).catch(() => undefined);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-primary-fixed/15' : ''
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-surface-container text-primary h-fit">
                        <span className="material-symbols-outlined text-[16px]">
                          {notif.category === 'maintenance'
                            ? 'build_circle'
                            : notif.category === 'lost_found'
                            ? 'radar'
                            : 'campaign'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate">
                          {lang === 'ar' ? notif.titleAr : notif.title}
                        </p>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                          {lang === 'ar' ? notif.messageAr : notif.message}
                        </p>
                        <span className="text-[10px] text-outline mt-1 block">{notif.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 rounded-full hover:bg-surface-container-low p-1 transition-all"
              aria-label={lang === 'ar' ? 'فتح قائمة الملف الشخصي' : 'Open profile menu'}
              aria-expanded={showProfileMenu}
            >
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-semibold text-on-surface leading-tight">
                  {user?.name || 'Campus User'}
                </span>
                <span className="text-[11px] text-on-surface-variant leading-none">
                  {user?.building || 'Campus Facilities'}
                </span>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed"
                src={
                  user?.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDzsdr8AR31Mqn_SpbpEz66QScm7EhbrKGAFEGPMv0mZ1gj-c29PcguJwLlkvylIAW4q7oANEwjBcZ-YxlrKcLdmEDL6gnOEUXeoitgWr9iZYwWTdDeDo7seQxjSMBwNvRdxgDcMfr0C-7yhWsv0MFDnfMgQmzVcSv5zPiL20oSLVy5De5skubvVTwTwHQYCP5eWgKlZjW9EwD6zY7AoxxvldayoUBP4lTzh6aPyu-6'
                }
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 py-2 z-50">
                <div className="px-4 py-3 border-b border-outline-variant/30">
                  <p className="font-semibold text-sm text-on-surface">{user?.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">badge</span>
                    <span className="capitalize">{user?.role}</span>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-container font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    <span>{lang === 'ar' ? 'الملف الشخصي' : 'My Profile'}</span>
                  </Link>
                  <Link
                    to="/my-reports"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-container font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">assignment</span>
                    <span>{t.myReports}</span>
                  </Link>
                  <button
                    onClick={() => {
                      onOpenEmergency();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-secondary hover:bg-secondary-fixed/20 font-medium text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">emergency</span>
                    <span>{t.emergencyHotline}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
