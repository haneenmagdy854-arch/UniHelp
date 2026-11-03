import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MaintenanceCategory, MaintenanceReport } from '../../types';

interface WorkloadAnalyticsProps {
  reports: MaintenanceReport[];
}

const categoryColors = [
  'bg-primary',
  'bg-tertiary-container',
  'bg-secondary',
  'bg-primary-fixed-dim',
  'bg-surface-container-highest',
  'bg-tertiary',
  'bg-outline'
];

export const WorkloadAnalytics: React.FC<WorkloadAnalyticsProps> = ({ reports }) => {
  const { lang, t } = useLanguage();
  const categoryLabels: Record<MaintenanceCategory, string> = {
    electricity: t.categoryElectricity,
    ac: t.categoryAC,
    network: t.categoryNetwork,
    furniture: t.categoryFurniture,
    cleaning: t.categoryCleaning,
    lab: t.categoryLab,
    other: t.categoryOther
  };
  const categories = (Object.keys(categoryLabels) as MaintenanceCategory[]).map((category, index) => {
    const categoryReports = reports.filter((report) => report.category === category);
    const openReports = categoryReports.filter((report) => report.status !== 'resolved').length;
    return {
      category,
      label: categoryLabels[category],
      total: categoryReports.length,
      open: openReports,
      percentage: reports.length ? Math.round(categoryReports.length / reports.length * 100) : 0,
      color: categoryColors[index]
    };
  });
  const buildings = Array.from(new Set(reports.map((report) => report.building)))
    .map((building) => {
      const buildingReports = reports.filter((report) => report.building === building);
      const resolved = buildingReports.filter((report) => report.status === 'resolved').length;
      return {
        building,
        total: buildingReports.length,
        resolvedPercentage: Math.round(resolved / buildingReports.length * 100)
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-bold text-base text-on-surface block">{t.categoryBreakdown}</span>
              <span className="text-xs text-on-surface-variant">
                {lang === 'ar' ? 'توزيع البلاغات المسجلة حسب الفئة' : 'Submitted reports grouped by category'}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-semibold">
              {reports.length} {lang === 'ar' ? 'بلاغ' : 'reports'}
            </span>
          </div>

          <div className="w-full h-7 rounded-xl overflow-hidden flex shadow-inner mb-6 text-[10px] font-bold">
            {categories.filter((category) => category.total > 0).map((category) => (
              <div
                key={category.category}
                className={`${category.color} flex items-center justify-center text-on-primary`}
                style={{ width: `${category.percentage}%` }}
                title={`${category.label}: ${category.total}`}
              >
                {category.percentage >= 10 ? `${category.percentage}%` : ''}
              </div>
            ))}
            {reports.length === 0 && (
              <div className="h-full w-full bg-surface-container-highest" />
            )}
          </div>

          {reports.length === 0 ? (
            <p className="rounded-2xl bg-surface-container-low p-6 text-center text-sm text-on-surface-variant">
              {lang === 'ar' ? 'لا توجد بيانات كافية لعرض توزيع الفئات.' : 'No report data is available for category analytics.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.category} className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${category.color}`} />
                    <span className="text-xs font-bold text-on-surface">{category.label}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-on-surface">{category.total}</span>
                    <span className="text-xs text-on-surface-variant">
                      {category.open} {lang === 'ar' ? 'مفتوح' : 'open'}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-1">{category.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-bold text-base text-on-surface block">{t.zoneEfficiency}</span>
              <span className="text-xs text-on-surface-variant">
                {lang === 'ar' ? 'نسبة البلاغات التي تم حلها حسب المبنى' : 'Resolved-report rate by building'}
              </span>
            </div>
            <span className="p-2 rounded-xl bg-surface-container-low text-primary">
              <span className="material-symbols-outlined text-[20px]">domain</span>
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {buildings.length ? buildings.map((entry, index) => (
              <div key={entry.building}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="font-bold text-on-surface truncate">{entry.building}</span>
                  <span className="text-on-surface-variant shrink-0">
                    {entry.resolvedPercentage}% {lang === 'ar' ? 'تم الحل' : 'resolved'}
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div
                    className={`${categoryColors[index]} h-2 rounded-full`}
                    style={{ width: `${entry.resolvedPercentage}%` }}
                  />
                </div>
                <span className="mt-1 block text-[10px] text-on-surface-variant">
                  {entry.total} {lang === 'ar' ? 'بلاغ' : 'reports'}
                </span>
              </div>
            )) : (
              <p className="rounded-2xl bg-surface-container-low p-6 text-center text-sm text-on-surface-variant">
                {lang === 'ar' ? 'لا توجد بيانات مبانٍ لعرضها.' : 'No building data is available yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
