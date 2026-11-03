import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MaintenanceReport } from '../../types';

interface FieldTechniciansPanelProps {
  reports: MaintenanceReport[];
}

export const FieldTechniciansPanel: React.FC<FieldTechniciansPanelProps> = ({ reports }) => {
  const { lang, t } = useLanguage();
  const technicianNames = Array.from(new Set(
    reports
      .map((report) => report.technicianName)
      .filter((name): name is string => Boolean(name))
  ));

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-base text-on-surface block">{t.fieldTechnicians}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
            {technicianNames.length} {lang === 'ar' ? 'فني مسجل' : 'assigned'}
          </span>
        </div>
        <span className="text-xs text-on-surface-variant block mb-4">
          {lang === 'ar'
            ? 'الفنيون الظاهرون هنا مستندون إلى تعيينات البلاغات المسجلة.'
            : 'Technicians shown here come from assignments saved on maintenance reports.'}
        </span>

        <div className="space-y-3">
          {technicianNames.length ? technicianNames.map((name) => {
            const assignedReports = reports.filter((report) =>
              report.technicianName === name && report.status !== 'resolved'
            );
            return (
              <div
                key={name}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-primary" aria-hidden="true">engineering</span>
                  <span className="text-xs font-bold text-on-surface truncate">{name}</span>
                </div>
                <span className="shrink-0 text-[11px] text-on-surface-variant">
                  {assignedReports.length} {lang === 'ar' ? 'بلاغ نشط' : 'active reports'}
                </span>
              </div>
            );
          }) : (
            <p className="rounded-2xl bg-surface-container-low p-6 text-center text-sm text-on-surface-variant">
              {lang === 'ar'
                ? 'لا توجد تعيينات فنيين مسجلة في قاعدة البيانات.'
                : 'No technician assignments are recorded in the database.'}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant">
        {lang === 'ar'
          ? 'لا يتضمن مخطط قاعدة البيانات الحالي سجلًا مستقلًا للفنيين أو حالة اتصال مباشرة.'
          : 'The current database schema has no separate technician directory or live presence data.'}
      </div>
    </div>
  );
};
