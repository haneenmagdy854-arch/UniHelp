import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const NotificationsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const {
    notifications,
    notificationsState,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'maintenance' | 'lost_found'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'maintenance' && n.category !== 'maintenance') return false;
    if (filter === 'lost_found' && n.category !== 'lost_found') return false;
    return true;
  });
  const filters = [
    { key: 'all', label: lang === 'ar' ? 'كل الإشعارات' : 'All Alerts' },
    { key: 'unread', label: lang === 'ar' ? 'غير المقروءة' : 'Unread Only' },
    { key: 'maintenance', label: t.maintenance },
    { key: 'lost_found', label: t.lostAndFound }
  ] as const;

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">{t.notifications}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
              {notifications.filter((n) => !n.read).length}{' '}
              {lang === 'ar' ? 'غير مقروء' : 'Unread'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {lang === 'ar'
              ? 'تحديثات الصيانة الفورية وتنبيهات مطابقة المفقودات والبث العام للحرم'
              : 'Direct facility work order updates, lost & found matches, and campus broadcasts'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void markAllNotificationsRead().catch(() => undefined)}
          className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-colors border border-outline-variant/30 self-start sm:self-auto"
        >
          {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              filter === tab.key
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {notificationsState.status !== 'success' ? (
          <DataStatePanel
            state={notificationsState}
            lang={lang}
            onRetry={() => void refreshNotifications()}
          />
        ) : filtered.length === 0 ? (
          <DataStatePanel
            state={notificationsState}
            lang={lang}
            onRetry={() => void refreshNotifications()}
            empty
            emptyMessage={lang === 'ar' ? 'لا توجد إشعارات لعرضها.' : 'There are no notifications to show.'}
          />
        ) : filtered.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => void markNotificationRead(item.id).catch(() => undefined)}
            aria-label={`${lang === 'ar' ? item.titleAr : item.title}${
              item.read ? '' : lang === 'ar' ? '، غير مقروء' : ', unread'
            }`}
            aria-pressed={item.read}
            className={`w-full text-start p-5 rounded-2xl border transition-all flex items-start gap-4 ${
              !item.read
                ? 'bg-surface-container-lowest border-primary/40 shadow-sm'
                : 'bg-surface-container-low border-outline-variant/30 opacity-80'
            }`}
          >
            <div className="p-3 rounded-2xl bg-surface-container text-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">
                {item.category === 'maintenance'
                  ? 'build_circle'
                  : item.category === 'lost_found'
                  ? 'radar'
                  : 'campaign'}
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-on-surface">
                  {lang === 'ar' ? item.titleAr : item.title}
                </h3>
                <span className="text-[11px] text-outline shrink-0">{item.timeAgo}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {lang === 'ar' ? item.messageAr : item.message}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
