import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MaintenanceReport } from '../../types';

interface LiveIssueTrackerProps {
  report: MaintenanceReport;
}

export const LiveIssueTracker: React.FC<LiveIssueTrackerProps> = ({ report }) => {
  const { lang, t } = useLanguage();
  const title = lang === 'ar' ? report.titleAr || report.title : report.title;
  const building = lang === 'ar' ? report.buildingAr || report.building : report.building;
  const room = lang === 'ar' ? report.roomAr || report.room : report.room;
  const currentStep =
    report.status === 'pending'
      ? 0
      : report.status === 'dispatched'
      ? 1
      : report.status === 'resolved'
      ? 3
      : 2;
  const latestTimelineStep = [...report.timeline].reverse().find((step) => step.completed);
  const latestUpdate =
    lang === 'ar'
      ? report.technicianNoteAr || latestTimelineStep?.detailAr || latestTimelineStep?.detail
      : report.technicianNote || latestTimelineStep?.detail;
  const steps = [
    { title: lang === 'ar' ? 'تم الإرسال' : 'Submitted', source: report.timeline[0] },
    { title: lang === 'ar' ? 'قيد المراجعة' : 'Under Review', source: report.timeline[1] },
    { title: lang === 'ar' ? 'جارٍ العمل' : 'In Progress', source: report.timeline[2] },
    { title: lang === 'ar' ? 'تم الحل' : 'Resolved', source: report.timeline[3] }
  ];
  const statusLabel =
    report?.status === 'resolved'
      ? t.statusResolved
      : report?.status === 'pending'
      ? t.statusPending
      : report?.status === 'awaiting_parts'
      ? lang === 'ar' ? 'بانتظار قطع الغيار' : 'Awaiting parts'
      : t.statusInProgress;

  return (
    <aside className="flex flex-col gap-6">
      {/* Live Active Ticket Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-md border border-outline-variant/30 relative overflow-hidden">
        {/* Decorative Tonal Accent Layer */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header with ticket and status */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
                {t.liveTrackingCase}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
              {report.ticketNumber}
            </h2>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              {title}
            </p>
            <p className="text-[11px] text-outline flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>{building} • {room}</span>
            </p>
          </div>

        </div>

        {/* Live Status Indicator Bar */}
        <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-primary-fixed/40 my-5 border border-primary-fixed">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            <span className="text-xs font-bold text-on-primary-fixed">
              {statusLabel}
            </span>
          </div>
          <span className="text-xs text-on-primary-fixed-variant">
            {lang === 'ar' ? 'آخر تحديث' : 'Updated'}{' '}
            {new Date(report.updatedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
          </span>
        </div>

        <ol className="my-6 space-y-4" aria-label={lang === 'ar' ? 'مراحل البلاغ' : 'Report progress'}>
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isComplete = index < currentStep || isCurrent;
            return (
              <li key={step.title} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isComplete ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-outline'
                }`}>
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                    {step.title}
                  </span>
                  {isComplete && step.source?.timestamp && (
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      {step.source.timestamp}
                    </span>
                  )}
                  {isCurrent && !step.source?.timestamp && (
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      {lang === 'ar' ? 'الحالة الحالية' : 'Current status'}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="rounded-2xl bg-surface-container-low p-4">
          <h3 className="text-sm font-bold text-on-surface">
            {lang === 'ar' ? 'آخر تحديث من فريق الصيانة' : 'Latest maintenance update'}
          </h3>
          <p dir="auto" className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {latestUpdate || (lang === 'ar' ? 'لا توجد ملاحظات إضافية حتى الآن.' : 'No additional notes yet.')}
          </p>
        </div>
      </div>
    </aside>
  );
};
