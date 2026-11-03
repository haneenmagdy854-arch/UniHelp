import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { LiveIssueTracker } from '../components/maintenance/LiveIssueTracker';
import { StatusBadge } from '../components/common/StatusBadge';
import { MaintenanceCategory, PriorityLevel } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const ReportDetailsPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { lang, t } = useLanguage();
  const { reports, reportsState, refreshReports } = useData();

  if (reportsState.status !== 'success') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <DataStatePanel state={reportsState} lang={lang} onRetry={() => void refreshReports()} />
      </div>
    );
  }

  const normalizedTicket = ticketId?.replace(/^#/, '');
  const report = reports.find(
    (r) => r.ticketNumber.replace(/^#/, '') === normalizedTicket
  );
  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-on-surface">
          {lang === 'ar' ? 'لم نعثر على هذا البلاغ.' : 'Report not found.'}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          {lang === 'ar' ? 'تأكد من رقم البلاغ أو ارجع إلى قائمة بلاغاتك.' : 'Check the report number or return to your reports.'}
        </p>
        <Link to="/my-reports" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary">
          {lang === 'ar' ? 'عرض بلاغاتي' : 'View my reports'}
        </Link>
      </div>
    );
  }
  const title = lang === 'ar' ? report.titleAr || report.title : report.title;
  const description =
    lang === 'ar' ? report.descriptionAr || report.description : report.description;
  const building = lang === 'ar' ? report.buildingAr || report.building : report.building;
  const floor = lang === 'ar' ? report.floorAr || report.floor : report.floor;
  const room = lang === 'ar' ? report.roomAr || report.room : report.room;
  const categoryLabels: Record<MaintenanceCategory, string> = {
    electricity: t.categoryElectricity,
    ac: t.categoryAC,
    network: t.categoryNetwork,
    furniture: t.categoryFurniture,
    cleaning: t.categoryCleaning,
    lab: t.categoryLab,
    other: t.categoryOther
  };
  const priorityLabels: Record<PriorityLevel, string> = {
    low: t.priorityLow,
    moderate: t.priorityModerate,
    high: t.priorityHigh,
    urgent: t.priorityUrgent
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-reports"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-tertiary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            {lang === 'ar' ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{lang === 'ar' ? 'العودة إلى بلاغاتي' : 'Back to My Reports'}</span>
        </Link>
        <span className="text-xs text-outline font-semibold">
          {report.ticketNumber} • {report.createdAt.split('T')[0]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Issue Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-outline">{report.ticketNumber}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase">
                {categoryLabels[report.category]}
              </span>
              <StatusBadge status={report.status} />
            </div>

            <h1 className="text-2xl font-bold text-on-surface">{title}</h1>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-outline block text-[11px] font-medium">{t.locationHierarchy}</span>
                <span className="font-bold text-on-surface">
                  {building} • {floor} • {room}
                </span>
              </div>
              <div>
                <span className="text-outline block text-[11px] font-medium">{t.assetBarcode}</span>
                <span className="font-bold text-on-surface font-mono">{report.assetBarcode || 'N/A'}</span>
              </div>
              <div>
                <span className="text-outline block text-[11px] font-medium">{t.priorityLabel}</span>
                <span className="font-bold text-secondary">{priorityLabels[report.priority]}</span>
              </div>
              <div>
                <span className="text-outline block text-[11px] font-medium">
                  {lang === 'ar' ? 'مقدم البلاغ' : 'Reporter'}
                </span>
                <span className="font-bold text-on-surface">
                  {report.reporterName} ({report.reporterRole})
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">{t.descriptionLabel}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
                {description}
              </p>
            </div>

            {report.imageUrl && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">{t.photoEvidence}</h3>
                <div className="h-56 w-full rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 bg-surface-container">
                  <img
                    src={report.imageUrl}
                    alt={lang === 'ar' ? 'الصورة المرفقة بالبلاغ' : 'Attached Evidence'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Issue Tracker Component */}
        <div className="lg:col-span-5">
          <LiveIssueTracker report={report} />
        </div>
      </div>
    </div>
  );
};
