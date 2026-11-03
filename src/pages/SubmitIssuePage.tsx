import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MaintenanceReportWizard } from '../components/maintenance/MaintenanceReportWizard';
import { LiveIssueTracker } from '../components/maintenance/LiveIssueTracker';
import { useData } from '../contexts/DataContext';

export const SubmitIssuePage: React.FC = () => {
  const { lang } = useLanguage();
  const { reports } = useData();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const activeReport = selectedTicket
    ? reports.find((report) => report.ticketNumber === selectedTicket)
    : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
      {!activeReport && (
        <header className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
            {lang === 'ar' ? 'الإبلاغ عن مشكلة صيانة' : 'Report a maintenance problem'}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {lang === 'ar'
              ? 'أكمل الخطوات الخمس لإرسال البلاغ. إضافة صورة اختيارية.'
              : 'Complete five short steps to send your report. Adding a photo is optional.'}
          </p>
        </header>
      )}
      <section>
          <MaintenanceReportWizard onSuccess={(tNum: string) => setSelectedTicket(tNum)} />
      </section>
      {activeReport && (
        <section aria-label={lang === 'ar' ? 'تتبع البلاغ' : 'Report tracking'}>
          <LiveIssueTracker report={activeReport} />
        </section>
      )}
    </div>
  );
};
