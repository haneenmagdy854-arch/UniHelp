import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { WorkloadAnalytics } from '../components/admin/WorkloadAnalytics';
import { AdminWorkOrdersTable } from '../components/admin/AdminWorkOrdersTable';
import { ClaimVerificationDrawer } from '../components/admin/ClaimVerificationDrawer';
import { FieldTechniciansPanel } from '../components/admin/FieldTechniciansPanel';
import { MaintenanceReport } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const AdminDashboard: React.FC = () => {
  const { lang, t, toggleLanguage } = useLanguage();
  const {
    reports,
    reportsState,
    refreshReports,
    lostFoundItems,
    lostFoundState,
    refreshLostFound,
    claims,
    claimsState,
    refreshClaims,
  } = useData();

  const openReports = reports.filter((report) => report.status !== 'resolved');
  const highPriorityReports = openReports.filter((report) => report.priority === 'high' || report.priority === 'urgent').length;
  const moderatePriorityReports = openReports.filter((report) => report.priority === 'moderate').length;
  const lowPriorityReports = openReports.filter((report) => report.priority === 'low').length;
  const resolvedReports = reports.filter((report) => report.status === 'resolved');
  const averageResolutionHours = resolvedReports.length
    ? resolvedReports.reduce((total, report) =>
      total + Math.max(0, Date.parse(report.updatedAt) - Date.parse(report.createdAt)) / 3600000, 0
    ) / resolvedReports.length
    : null;
  const itemsInCustody = lostFoundItems.filter((item) =>
    item.status === 'safe_with_security' || item.status === 'claim_pending'
  ).length;
  const lostItems = lostFoundItems.filter((item) => item.type === 'lost').length;
  const pendingClaims = claims.filter((claim) =>
    claim.status === 'pending_review' || claim.status === 'additional_proof_requested'
  );
  const assignedTechnicians = Array.from(new Set(
    reports.map((report) => report.technicianName).filter((name): name is string => Boolean(name))
  ));

  const [showBroadcastDrawer, setShowBroadcastDrawer] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastMessageAr, setBroadcastMessageAr] = useState('');
  const [broadcastError, setBroadcastError] = useState('');
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [selectedReportForReview, setSelectedReportForReview] = useState<MaintenanceReport | null>(null);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || !broadcastMessageAr.trim()) return;
    setBroadcastError(
      lang === 'ar'
        ? 'لم يتم إرسال الإشعار: قاعدة البيانات الحالية لا توفر آلية بث آمنة أو صلاحية إدراج لهذا الغرض.'
        : 'Notice not sent: the current database schema does not provide a secure broadcast fan-out or insert permission for this action.'
    );
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'TicketID,Title,Category,Priority,Building,Room,Status\n' +
      reports
        .map(
          (r: MaintenanceReport) =>
            `"${r.ticketNumber}","${r.title}","${r.category}","${r.priority}","${r.building}","${r.room}","${r.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'UniHelp_WorkOrders_Matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportDropdownOpen(false);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 space-y-6 max-w-[1560px] mx-auto">
      <div className="grid gap-3 sm:grid-cols-2">
        <DataStatePanel
          state={reportsState}
          lang={lang}
          onRetry={() => void refreshReports()}
          empty={reports.length === 0}
          emptyMessage={lang === 'ar' ? 'لا توجد بلاغات صيانة بعد.' : 'No maintenance reports yet.'}
        />
        <DataStatePanel
          state={claimsState}
          lang={lang}
          onRetry={() => void refreshClaims()}
          empty={claims.length === 0}
          emptyMessage={lang === 'ar' ? 'لا توجد طلبات استعادة بعد.' : 'No claim requests yet.'}
        />
        <DataStatePanel
          state={lostFoundState}
          lang={lang}
          onRetry={() => void refreshLostFound()}
          empty={lostFoundItems.length === 0}
          emptyMessage={lang === 'ar' ? 'لا توجد عناصر مفقودة أو معثور عليها بعد.' : 'No lost or found items yet.'}
        />
      </div>
      {/* RTL Bilingual Banner Strip */}
      <div className="w-full bg-surface-container rounded-2xl p-3 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">translate</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-on-surface">Bilingual Operations Active:</span>
            <span className="text-on-surface-variant font-arabic">
              واجهة المشرف والتحكم باللغة العربية متوافقة بالكامل مع نمط القراءة من اليمين لليسار (RTL Grid Ready)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary text-xs font-bold shadow-sm hover:bg-surface-bright transition-colors flex items-center gap-1 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            <span>{lang === 'ar' ? 'تبديل للإنجليزية' : 'تبديل للعربية (Preview RTL)'}</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
            Cairo Core v4.2
          </span>
        </div>
      </div>

      {/* Admin Top Bar & Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {t.opsCommandCore}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs font-semibold text-on-surface-variant">{t.academicYear}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {t.adminConsoleTitle}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            {t.adminSubtitle}
          </p>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="relative">
            <select className="appearance-none bg-surface-container-low text-on-surface text-xs font-bold pl-3 pr-8 py-2.5 rounded-xl cursor-pointer focus:outline-none border border-outline-variant/30 shadow-sm">
              <option>{t.allDepartments}</option>
              <option>College of Engineering</option>
              <option>Faculty of Health Sciences</option>
              <option>Faculty of Fine Arts</option>
              <option>Central Facilities & Grounds</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-3 text-[16px] pointer-events-none text-on-surface-variant">
              expand_more
            </span>
          </div>

          {/* Date Range Filter */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold hover:bg-surface-container shadow-sm border border-outline-variant/30 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
            <span>{t.last30Days}: Oct 15 – Nov 14</span>
          </button>

          {/* Broadcast Trigger Button */}
          <button
            type="button"
            onClick={() => setShowBroadcastDrawer(!showBroadcastDrawer)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold hover:bg-secondary-container shadow-sm transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>{t.broadcastNotice}</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold hover:bg-primary transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>{t.exportReports}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>
            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-2xl shadow-xl py-2 z-30 border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
                  <span>Download CSV Matrix</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('PDF summary exported!');
                    setExportDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 text-left"
                >
                  <span className="material-symbols-outlined text-[16px] text-error">picture_as_pdf</span>
                  <span>Download PDF Summary</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Alert Drawer */}
      {showBroadcastDrawer && (
        <div className="w-full bg-secondary-container text-on-secondary-container p-5 rounded-2xl shadow-md border border-secondary/30 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-surface-container-lowest text-secondary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </span>
              <div>
                <span className="text-sm font-bold block">
                  {lang === 'ar' ? 'وضع بث التنبيهات العاجلة للحرم الجامعي نشط' : 'System Alert Broadcast Mode Active'}
                </span>
                <span className="text-xs opacity-90">
                  {lang === 'ar'
                    ? 'سيُحفظ الإشعار في قاعدة البيانات حسب سياسات الوصول الحالية.'
                    : 'The notice will be saved to the database under its current access policies.'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowBroadcastDrawer(false)}
              className="p-1 rounded-lg hover:bg-surface-container-lowest/30 text-on-secondary-container"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <>
              <form onSubmit={handleSendBroadcast} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Compose campus notice in English..."
                  aria-label="Campus notice in English"
                  className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={broadcastMessageAr}
                  onChange={(e) => setBroadcastMessageAr(e.target.value)}
                  placeholder="اكتب التنبيه باللغة العربية..."
                  aria-label="نص الإشعار باللغة العربية"
                  dir="rtl"
                  className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold shadow-sm hover:opacity-90 transition-all shrink-0 disabled:opacity-50 sm:col-span-2"
                >
                  {lang === 'ar' ? 'إرسال الإشعار' : 'Send Broadcast'}
                </button>
              </form>
              {broadcastError && (
                <p className="mt-3 text-xs font-semibold text-error" role="alert">{broadcastError}</p>
              )}
          </>
        </div>
      )}

      {/* Executive KPI Summary Cards (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">build_circle</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">assignment</span> {reports.length} {lang === 'ar' ? 'الإجمالي' : 'total'}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-on-surface-variant block">{t.openWorkOrders}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-bold text-on-surface leading-none">{openReports.length}</span>
              <span className="text-[11px] text-outline font-medium">{lang === 'ar' ? 'بلاغ مفتوح' : 'open reports'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-on-surface-variant text-[11px] bg-surface-container-low px-2 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-error" /> {highPriorityReports} {lang === 'ar' ? 'عاجل' : 'high'}
            <span className="text-outline-variant">•</span>
            <span className="w-2 h-2 rounded-full bg-secondary" /> {moderatePriorityReports} {lang === 'ar' ? 'متوسط' : 'moderate'}
            <span className="text-outline-variant">•</span>
            <span className="w-2 h-2 rounded-full bg-primary" /> {lowPriorityReports} {lang === 'ar' ? 'منخفض' : 'low'}
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> {resolvedReports.length} {lang === 'ar' ? 'تم الحل' : 'resolved'}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-on-surface-variant block">{t.avgResolutionTime}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-bold text-tertiary leading-none">{averageResolutionHours?.toFixed(1) ?? '—'}</span>
              <span className="text-base font-bold text-tertiary">{lang === 'ar' ? 'ساعة' : 'hours'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{lang === 'ar' ? 'متوسط البلاغات المحلولة' : 'Resolved-report average'}</span>
            <span className="text-primary font-bold">{resolvedReports.length} {lang === 'ar' ? 'بلاغ' : 'reports'}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              {lostFoundItems.length ? Math.round(itemsInCustody / lostFoundItems.length * 100) : 0}% {lang === 'ar' ? 'في الحيازة' : 'in custody'}
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-on-surface-variant block">{lang === 'ar' ? 'المعثورات المحفوظة' : 'Items In Custody'}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-bold text-on-surface leading-none">{itemsInCustody}</span>
              <span className="text-[11px] text-outline font-medium">{lang === 'ar' ? 'عنصر محفوظ' : 'in custody'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{lang === 'ar' ? 'إجمالي العناصر' : 'Total items'}: {lostFoundItems.length}</span>
            <span className="text-secondary font-bold">{lang === 'ar' ? 'مفقود' : 'lost'}: {lostItems}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
              Action Req
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-on-surface-variant block">{t.activeClaims}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-bold text-secondary leading-none">{pendingClaims.length}</span>
              <span className="text-[11px] text-outline font-medium">claims review</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{lang === 'ar' ? 'طلبات تنتظر المراجعة' : 'Awaiting review'}</span>
            <span className="text-error font-bold">{pendingClaims.length}</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">engineering</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Live Fleet
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-on-surface-variant block">{t.activeTechnicians}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-bold text-primary leading-none">{assignedTechnicians.length}</span>
              <span className="text-base font-bold text-primary">{lang === 'ar' ? 'معين' : 'assigned'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{lang === 'ar' ? 'تعيينات محفوظة' : 'Saved assignments'}</span>
            <span className="text-on-surface font-bold">{assignedTechnicians.length}</span>
          </div>
        </div>
      </div>

      {/* Analytics & Workload Distribution */}
      <WorkloadAnalytics reports={reports} />

      {/* Main Operational Table */}
      <AdminWorkOrdersTable onSelectReport={(r: MaintenanceReport) => setSelectedReportForReview(r)} />

      {/* High-Priority Claim Verification Drawer + Field Technicians Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ClaimVerificationDrawer claim={null} />
        </div>
        <div className="lg:col-span-4">
          <FieldTechniciansPanel reports={reports} />
        </div>
      </div>
    </div>
  );
};
