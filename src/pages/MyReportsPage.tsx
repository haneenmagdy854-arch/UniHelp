import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { MaintenanceStatus, MaintenanceReport, MaintenanceCategory } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const MyReportsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { reports, reportsState, refreshReports } = useData();
  const { user, role } = useAuth();

  const [statusFilter, setStatusFilter] = useState<'all' | MaintenanceStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const categoryLabels: Record<MaintenanceCategory, string> = {
    electricity: t.categoryElectricity,
    ac: t.categoryAC,
    network: t.categoryNetwork,
    furniture: t.categoryFurniture,
    cleaning: t.categoryCleaning,
    lab: t.categoryLab,
    other: t.categoryOther
  };
  const statusFilters: Array<{ key: 'all' | MaintenanceStatus; label: string }> = [
    { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
    { key: 'dispatched', label: lang === 'ar' ? 'تم توجيه الفني' : 'Dispatched' },
    { key: 'in_progress', label: t.inProgressRepairs },
    { key: 'pending', label: t.statusPending },
    { key: 'awaiting_parts', label: lang === 'ar' ? 'بانتظار قطع الغيار' : 'Awaiting Parts' },
    { key: 'resolved', label: t.resolvedIssues }
  ];

  const visibleReports =
    role === 'admin'
      ? reports
      : reports.filter((report) => report.reporterId === user?.id || report.reporterName === user?.name);
  const filteredReports = visibleReports.filter((r: MaintenanceReport) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.ticketNumber.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.titleAr?.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        r.buildingAr?.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.roomAr?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">{t.myReports}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
              {filteredReports.length} {lang === 'ar' ? 'بلاغ' : 'Logged Tickets'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {lang === 'ar'
              ? 'متابعة مباشرة لجميع بلاغات الصيانة المقدمة وتحديثات الفنيين الميدانيين'
              : 'Live tracking audit trail of your submitted maintenance issues and technician updates'}
          </p>
        </div>

        <Link
          to="/submit-issue"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary transition-all shadow-sm active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{t.newReport}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {statusFilters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === item.key
                  ? 'bg-surface-container-lowest text-primary border-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث برقم التتبع أو المبنى...' : 'Search by ticket # or room...'}
            aria-label={lang === 'ar' ? 'ابحث برقم البلاغ أو المبنى' : 'Search reports by ticket or building'}
            dir="auto"
            className="w-full bg-surface-container-lowest text-xs text-on-surface pl-9 pr-3 py-2 rounded-xl border border-outline-variant/40 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reportsState.status !== 'success' ? (
          <DataStatePanel state={reportsState} lang={lang} onRetry={() => void refreshReports()} />
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-2">
            <span className="material-symbols-outlined text-outline text-[48px]">assignment_late</span>
            <p className="font-bold text-sm text-on-surface">
              {lang === 'ar' ? 'لا توجد بلاغات تطابق البحث' : 'No maintenance reports match your query.'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {lang === 'ar' ? 'يمكنك تقديم بلاغ جديد في أي وقت.' : 'Submit a new report whenever maintenance is needed.'}
            </p>
          </div>
        ) : (
          filteredReports.map((report: MaintenanceReport) => {
            const title = lang === 'ar' ? report.titleAr || report.title : report.title;
            const description =
              lang === 'ar' ? report.descriptionAr || report.description : report.description;
            const building = lang === 'ar' ? report.buildingAr || report.building : report.building;
            const floor = lang === 'ar' ? report.floorAr || report.floor : report.floor;
            const room = lang === 'ar' ? report.roomAr || report.room : report.room;
            return (
            <div
              key={report.id}
              className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-outline">{report.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold uppercase">
                    {categoryLabels[report.category]}
                  </span>
                  <StatusBadge status={report.status} />
                  <span className="text-[11px] text-outline">• {report.createdAt.split('T')[0]}</span>
                </div>

                <h3 className="font-bold text-base text-on-surface">{title}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">{description}</p>

                <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">apartment</span>
                    {building} • {floor} • {room}
                  </span>
                  {report.technicianName && (
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <span className="material-symbols-outlined text-[16px]">engineering</span>
                      {report.technicianName}
                    </span>
                  )}
                  {report.assetBarcode && (
                    <span className="text-outline text-[11px]">Tag: {report.assetBarcode}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                <Link
                  to={`/maintenance/${report.ticketNumber.replace('#', '')}`}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors flex items-center gap-1 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>{lang === 'ar' ? 'تتبع البلاغ' : 'Track Issue'}</span>
                </Link>
              </div>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
};
