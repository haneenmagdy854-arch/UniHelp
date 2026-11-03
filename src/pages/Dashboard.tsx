import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActivityFeedItem, LostFoundItem, MaintenanceCategory, UserRole } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const Dashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { user, role, setRole } = useAuth();
  const dashboardRole: UserRole = role;
  const {
    reports,
    reportsState,
    refreshReports,
    lostFoundItems,
    lostFoundState,
    refreshLostFound,
    activityFeed
  } = useData();
  const navigate = useNavigate();

  // Active reports for display
  const activeReports = reports.filter((report) => report.status !== 'resolved').slice(0, 3);
  const activeReport = activeReports[0];
  const showcaseItems = lostFoundItems.slice(0, 3);
  const inProgressCount = reports.filter((report) =>
    report.status === 'dispatched' || report.status === 'in_progress' || report.status === 'awaiting_parts'
  ).length;
  const resolvedCount = reports.filter((report) => report.status === 'resolved').length;
  const resolvedRate = reports.length ? Math.round(resolvedCount / reports.length * 100) : 0;
  const claimPendingCount = lostFoundItems.filter((item) => item.status === 'claim_pending').length;
  const resolvedReports = reports.filter((report) => report.status === 'resolved');
  const averageResolutionHours = resolvedReports.length
    ? resolvedReports.reduce((total, report) =>
      total + Math.max(0, Date.parse(report.updatedAt) - Date.parse(report.createdAt)) / 3600000, 0
    ) / resolvedReports.length
    : 0;
  const categoryLabels: Record<MaintenanceCategory, string> = {
    electricity: t.categoryElectricity,
    ac: t.categoryAC,
    network: t.categoryNetwork,
    furniture: t.categoryFurniture,
    cleaning: t.categoryCleaning,
    lab: t.categoryLab,
    other: t.categoryOther
  };
  const activeReportTitle = activeReport
    ? lang === 'ar' ? activeReport.titleAr || activeReport.title : activeReport.title
    : '';
  const activeReportBuilding = activeReport
    ? lang === 'ar' ? activeReport.buildingAr || activeReport.building : activeReport.building
    : '';
  const activeReportRoom = activeReport
    ? lang === 'ar' ? activeReport.roomAr || activeReport.room : activeReport.room
    : '';
  const activeReportStep = activeReport?.status === 'pending'
    ? 0
    : activeReport?.status === 'dispatched'
      ? 1
      : activeReport?.status === 'resolved'
        ? 3
        : 2;
  const priorityLabels: Record<string, string> = {
    low: t.priorityLow,
    moderate: t.priorityModerate,
    high: t.priorityHigh,
    urgent: t.priorityUrgent
  };

  if (role === 'student') {
    const recentReports = reports
      .filter((report) => report.reporterId === user?.id || report.reporterName === user?.name)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 3);

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <section className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            {lang === 'ar' ? 'أهلًا بك' : `Welcome${user?.name ? `, ${user.name}` : ''}`}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            {lang === 'ar' ? 'كيف نقدر نساعدك النهارده؟' : 'How can we help you today?'}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {lang === 'ar'
              ? 'اختار الخدمة المناسبة وابدأ مباشرة.'
              : 'Choose what you need and get started.'}
          </p>
        </section>

        <section aria-label={lang === 'ar' ? 'الخدمات الرئيسية' : 'Main services'} className="grid gap-4 md:grid-cols-3">
          <Link
            to="/submit-issue"
            className="min-h-36 flex items-center gap-4 rounded-2xl bg-primary text-on-primary p-5 shadow-sm transition hover:bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="material-symbols-outlined text-3xl" aria-hidden="true">build</span>
            <span className="font-bold text-base sm:text-lg">
              {lang === 'ar' ? 'الإبلاغ عن مشكلة صيانة' : 'Report a Maintenance Problem'}
            </span>
          </Link>
          <Link
            to="/lost-items?tab=found"
            className="min-h-36 flex items-center gap-4 rounded-2xl bg-surface-container-lowest text-on-surface p-5 border border-outline-variant/40 shadow-sm transition hover:border-primary"
          >
            <span className="material-symbols-outlined text-3xl text-secondary" aria-hidden="true">search</span>
            <span className="font-bold text-base sm:text-lg">
              {lang === 'ar' ? 'البحث عن غرض مفقود' : 'Find a Lost Item'}
            </span>
          </Link>
          <Link
            to="/lost-items?report=found"
            className="min-h-36 flex items-center gap-4 rounded-2xl bg-surface-container-lowest text-on-surface p-5 border border-outline-variant/40 shadow-sm transition hover:border-primary"
          >
            <span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">inventory_2</span>
            <span className="font-bold text-base sm:text-lg">
              {lang === 'ar' ? 'الإبلاغ عن غرض عثرت عليه' : 'Report a Found Item'}
            </span>
          </Link>
        </section>

        <section className="space-y-4" aria-labelledby="recent-reports-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="recent-reports-title" className="text-xl font-bold text-on-surface">
                {lang === 'ar' ? 'بلاغاتي الأخيرة' : 'Recent reports'}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {lang === 'ar' ? 'تابع حالة البلاغات التي أرسلتها.' : 'Check the latest status of reports you submitted.'}
              </p>
            </div>
            {recentReports.length > 0 && (
              <Link to="/my-reports" className="shrink-0 text-sm font-semibold text-primary hover:underline">
                {lang === 'ar' ? 'عرض الكل' : 'View all'}
              </Link>
            )}
          </div>

          {reportsState.status !== 'success' ? (
            <DataStatePanel state={reportsState} lang={lang} onRetry={() => void refreshReports()} />
          ) : recentReports.length ? (
            <div className="divide-y divide-outline-variant/40 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  to={`/maintenance/${report.ticketNumber.replace('#', '')}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-surface-container-low transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-on-surface truncate">
                      {lang === 'ar' ? report.titleAr || report.title : report.title}
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      {report.ticketNumber} · {lang === 'ar' ? report.buildingAr || report.building : report.building}
                    </span>
                  </span>
                  <StatusBadge status={report.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-lowest p-6">
              <p className="font-semibold text-on-surface">
                {lang === 'ar' ? 'ما أرسلتش أي بلاغات لسه.' : 'You have not submitted any reports yet.'}
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {lang === 'ar' ? 'لو لاحظت مشكلة في مرافق الجامعة، ابدأ ببلاغ صيانة.' : 'If something on campus needs repair, start with a maintenance report.'}
              </p>
              <Link to="/submit-issue" className="mt-3 inline-flex text-sm font-bold text-primary hover:underline">
                {lang === 'ar' ? 'تقديم بلاغ صيانة' : 'Report a maintenance problem'}
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (role === 'doctor') {
    const facultyReports = reports
      .filter((report) => report.reporterId === user?.id || report.reporterName === user?.name)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 4);

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            {lang === 'ar' ? 'أهلًا بك' : `Welcome${user?.name ? `, ${user.name}` : ''}`}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            {lang === 'ar' ? 'خدمات المرافق لأعضاء هيئة التدريس' : 'Faculty facilities workspace'}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {lang === 'ar'
              ? 'قدّم بلاغات مرافق الكلية وتابع تحديثاتها من هنا.'
              : 'Report an issue with campus facilities and follow your updates here.'}
          </p>
        </header>

        <Link
          to="/submit-issue"
          className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-primary px-6 py-4 font-bold text-on-primary shadow-sm transition hover:bg-tertiary"
        >
          <span className="material-symbols-outlined" aria-hidden="true">build</span>
          {lang === 'ar' ? 'الإبلاغ عن مشكلة في المرافق' : 'Report a facilities problem'}
        </Link>

        <section className="space-y-4" aria-labelledby="faculty-reports-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="faculty-reports-title" className="text-xl font-bold text-on-surface">
                {lang === 'ar' ? 'بلاغاتي الأخيرة' : 'My recent reports'}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {lang === 'ar' ? 'حالة كل بلاغ وآخر تحديث.' : 'Current status and latest updates.'}
              </p>
            </div>
            {facultyReports.length > 0 && (
              <Link to="/my-reports" className="shrink-0 text-sm font-semibold text-primary hover:underline">
                {lang === 'ar' ? 'عرض الكل' : 'View all'}
              </Link>
            )}
          </div>

          {reportsState.status !== 'success' ? (
            <DataStatePanel state={reportsState} lang={lang} onRetry={() => void refreshReports()} />
          ) : facultyReports.length ? (
            <div className="divide-y divide-outline-variant/40 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
              {facultyReports.map((report) => (
                <Link
                  key={report.id}
                  to={`/maintenance/${report.ticketNumber.replace('#', '')}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-surface-container-low transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-on-surface truncate">
                      {lang === 'ar' ? report.titleAr || report.title : report.title}
                    </span>
                    <span className="mt-1 block text-xs text-on-surface-variant">
                      {report.ticketNumber} · {lang === 'ar' ? report.buildingAr || report.building : report.building}
                    </span>
                  </span>
                  <StatusBadge status={report.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-outline-variant/60 bg-surface-container-lowest p-6">
              <p className="font-semibold text-on-surface">
                {lang === 'ar' ? 'لا توجد بلاغات مسجلة باسمك.' : 'You have not submitted any reports yet.'}
              </p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {lang === 'ar' ? 'قدّم بلاغًا عند الحاجة، ثم تابع حالته هنا.' : 'Submit a report when needed, then follow its status here.'}
              </p>
              <Link to="/submit-issue" className="mt-3 inline-flex text-sm font-bold text-primary hover:underline">
                {lang === 'ar' ? 'بدء بلاغ جديد' : 'Start a report'}
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6 space-y-8 max-w-[1520px] mx-auto">
      <div className="grid gap-3 sm:grid-cols-2">
        <DataStatePanel
          state={reportsState}
          lang={lang}
          onRetry={() => void refreshReports()}
          empty={reports.length === 0}
          emptyMessage={lang === 'ar' ? 'لا توجد بلاغات صيانة بعد.' : 'No maintenance reports yet.'}
        />
        <DataStatePanel
          state={lostFoundState}
          lang={lang}
          onRetry={() => void refreshLostFound()}
          empty={lostFoundItems.length === 0}
          emptyMessage={lang === 'ar' ? 'لا توجد عناصر مفقودة أو معثور عليها بعد.' : 'No lost or found items yet.'}
        />
      </div>
      {/* ANNOUNCEMENT BANNER TICKER */}
      <div className="w-full bg-surface-container-low rounded-2xl p-3 sm:px-4 flex items-center justify-between shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="inline-flex items-center justify-center p-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[18px]">campaign</span>
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider shrink-0">
              {lang === 'ar' ? 'إعلان الحرم الجامعي:' : 'Campus Notice:'}
            </span>
            <p className="text-xs sm:text-sm text-on-surface truncate">
              {t.noticeHVAC}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 pl-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{t.opsNominal}</span>
          </div>
          <Link to="/help-center" className="text-xs font-semibold text-secondary hover:underline cursor-pointer">
            {lang === 'ar' ? 'إعلان الصيانة الدوري' : 'Maintenance Schedule'}
          </Link>
        </div>
      </div>

      {/* WELCOME & PRIMARY CTA HERO BENTO */}
      <div className="relative w-full rounded-3xl bg-surface-container-low p-6 sm:p-8 lg:p-10 shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 rounded-full bg-secondary-fixed/25 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-semibold flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                {t.academicTerm}
              </span>
              <span className="text-outline text-xs">•</span>
              <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">apartment</span>
                {user?.building || 'Building 4 • West Wing'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">
              {t.welcomeBack}, {user?.name || 'Haneen Magdy'}!{' '}
              <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {lang === 'ar'
                ? 'كلية الهندسة وعلوم الحاسب. جميع طوابير الصيانة والمرافق وقاعات المحاضرات وسجلات المفقودات تعمل بكفاءة تامة.'
                : 'College of Engineering & Computer Science. All campus maintenance queues, audio-visual support, and Lost & Found registries are fully operational.'}
            </p>

            {/* ROLE SWITCHER INTERACTIVE PILL */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-outline uppercase tracking-wider">
                {t.activeWorkspace}
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-surface-container shadow-inner border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    dashboardRole === 'student'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>{t.studentView}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    role === 'doctor'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                  <span>{t.doctorView}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    navigate('/admin');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    role === 'admin'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">shield_person</span>
                  <span>{t.adminHub}</span>
                </button>
              </div>

              <span className="text-xs text-on-surface-variant italic">
                {dashboardRole === 'student'
                  ? t.roleDescStudent
                  : role === 'doctor'
                  ? t.roleDescDoctor
                  : t.roleDescAdmin}
              </span>
            </div>
          </div>

          {/* ACTION CTAS */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-3 shrink-0 min-w-[280px]">
            <Link
              to="/submit-issue"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-md hover:bg-tertiary transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>{t.reportIssueBtn}</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/lost-items"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
                <span>{t.lostDirectory}</span>
              </Link>
              <Link
                to="/found-items"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                <span>{t.foundItems}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t.totalSubmitted}
            </span>
            <span className="p-2.5 rounded-2xl bg-surface-container text-primary">
              <span className="material-symbols-outlined text-[20px]">feed</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{reports.length}</span>
              <span className="text-xs font-semibold text-primary">{lang === 'ar' ? 'بلاغ مسجل' : 'submitted'}</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${resolvedRate}%` }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">{t.activeSemesterTracking}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t.inProgressRepairs}
            </span>
            <span className="p-2.5 rounded-2xl bg-primary-fixed text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">engineering</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{inProgressCount}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                {t.activeNow}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
              {lang === 'ar'
                ? `متوسط الإصلاح: ${averageResolutionHours.toFixed(1)} ساعة`
                : `Average resolution: ${averageResolutionHours.toFixed(1)} hours`}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t.resolvedIssues}
            </span>
            <span className="p-2.5 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed">
              <span className="material-symbols-outlined text-[20px]">task_alt</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{resolvedCount}</span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed text-[10px] font-bold">
                {resolvedRate}% {lang === 'ar' ? 'تم الحل' : 'resolved'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              {lang === 'ar' ? 'نسبة البلاغات المغلقة من الإجمالي' : 'Share of reports resolved'}
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t.lostFoundMatches}
            </span>
            <span className="relative p-2.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">radar</span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-error animate-ping" />
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-secondary">{claimPendingCount}</span>
              <span className="text-sm font-bold text-secondary">{lang === 'ar' ? 'قيد المطالبة' : 'claims pending'}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">notification_important</span>
              {lang === 'ar' ? 'عناصر بانتظار التحقق من طلب الاستعادة' : 'Items with a claim awaiting review'}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD BODY */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT 8-COLS: ACTIVE MAINTENANCE REPORTS & TIMELINE */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-on-surface">{t.activeMaintenanceReports}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                  {activeReports.length} {t.activeTrackingCount}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{t.realtimeDispatched}</p>
            </div>
            <Link
              to="/my-reports"
              className="inline-flex items-center gap-1 text-primary hover:text-tertiary text-xs font-bold transition-colors"
            >
              <span>{t.viewAuditTrail}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {/* REPORT 1 */}
          {activeReport && (
            <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-outline">{activeReport.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">devices</span>
                      {categoryLabels[activeReport.category]}
                    </span>
                    <StatusBadge status={activeReport.status} />
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">{activeReportTitle}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                    {activeReportBuilding} • {activeReportRoom}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-container border border-outline-variant/30">
                    <span className="material-symbols-outlined text-[18px] text-primary">engineering</span>
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-on-surface">
                        {activeReport.technicianName || (lang === 'ar' ? 'غير معين' : 'Unassigned')}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">
                        {activeReport.technicianStatus || (lang === 'ar' ? 'لا يوجد تحديث للفني' : 'No technician update')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MINI-STEPPER PIPELINE */}
              <div className="pt-2">
                <div className="grid grid-cols-4 gap-2 relative">
                  {[
                    lang === 'ar' ? 'تم الإرسال' : 'Reported',
                    lang === 'ar' ? 'تم التوجيه' : 'Dispatched',
                    lang === 'ar' ? 'قيد التنفيذ' : 'In Progress',
                    lang === 'ar' ? 'تم الحل' : 'Resolved'
                  ].map((step, index) => {
                    const timelineStep = activeReport.timeline[index];
                    const complete = index <= activeReportStep;
                    return (
                      <div key={step} className={`flex flex-col gap-1.5 ${complete ? '' : 'opacity-40'}`}>
                        <div className={`h-2 rounded-full ${complete ? 'bg-primary' : 'bg-surface-container-highest'}`} />
                        <span className={`text-[11px] font-bold flex items-center gap-1 ${complete ? 'text-primary' : 'text-outline'}`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {complete ? 'check' : 'radio_button_unchecked'}
                          </span>
                          {step}
                        </span>
                        {timelineStep?.timestamp && (
                          <span className="text-[10px] text-on-surface-variant">{timelineStep.timestamp}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container flex items-center justify-between text-xs border border-outline-variant/30">
                <span className="text-on-surface-variant italic truncate">
                  "{lang === 'ar' ? activeReport.technicianNoteAr || activeReport.technicianNote : activeReport.technicianNote}"
                </span>
                <Link
                  to={`/maintenance/${activeReport.ticketNumber.replace('#', '')}`}
                  className="text-primary hover:underline font-bold text-xs shrink-0 ml-3"
                >
                  {t.quickPingTech}
                </Link>
              </div>
            </div>
          )}

          {/* REPORT 2 */}
          {activeReports[1] && (
            <div className="bg-surface-container-low rounded-3xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-outline">{activeReports[1].ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                    {activeReports[1].category.toUpperCase()}
                  </span>
                  <StatusBadge status={activeReports[1].status} />
                </div>
                <h4 className="text-base font-bold text-on-surface">{activeReports[1].title}</h4>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  {activeReports[1].building} • {activeReports[1].room}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-outline block">{t.priorityLabel}</span>
                  <span className="text-xs font-bold text-secondary flex items-center md:justify-end gap-1">
                    <span className="material-symbols-outlined text-[16px]">priority_high</span>
                    {priorityLabels[activeReports[1].priority]}
                  </span>
                </div>
                <Link
                  to={`/maintenance/${activeReports[1].ticketNumber.replace('#', '')}`}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-outline-variant/30"
                >
                  {t.addPhoto}
                </Link>
              </div>
            </div>
          )}

          {/* REPORT 3 */}
          {activeReports[2] && (
            <div className="bg-surface-container-low rounded-3xl p-5 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-outline">{activeReports[2].ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px]">
                    {activeReports[2].category.toUpperCase()}
                  </span>
                  <StatusBadge status="resolved" />
                </div>
                <h4 className="text-base font-bold text-on-surface">{activeReports[2].title}</h4>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  {activeReports[2].building} • {activeReports[2].room}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-on-surface-variant">Closed Yesterday 4:30 PM</span>
                  <span className="text-xs font-bold text-primary block">AP #12 Rebooted & Recabled</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(lang === 'ar' ? 'شكرًا لتقييمك الخدمة!' : 'Thank you for your feedback!')}
                  className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-colors flex items-center gap-1 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">rate_review</span> {t.feedback}
                </button>
              </div>
            </div>
          )}

          {/* LOST & FOUND HIGHLIGHTS SECTION */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-on-surface">{t.lostFoundRegistry}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                    {lostFoundItems.length} {t.activeItemsCount}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{t.recentVerifiedEntries}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/lost-items"
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-colors border border-outline-variant/30"
                >
                  {t.browseAllItems}
                </Link>
                <Link
                  to="/claim-requests"
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-bold transition-colors shadow-sm"
                >
                  {t.submitFastClaim}
                </Link>
              </div>
            </div>

            {/* Showcase Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {showcaseItems.map((item: LostFoundItem) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-44 w-full bg-surface-container">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={item.status} />
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-surface/90 backdrop-blur text-on-surface text-[10px] font-bold">
                      Tag {item.tagNumber}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-bold text-sm text-on-surface line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2 border-t border-outline-variant/20">
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                        <span className="flex items-center gap-1 truncate">
                          <span className="material-symbols-outlined text-[14px]">place</span>
                          {item.location}
                        </span>
                        <span className="shrink-0">{item.reportedAt}</span>
                      </div>

                      <Link
                        to="/lost-items"
                        className="w-full py-2 rounded-xl bg-surface-container text-primary hover:bg-primary hover:text-on-primary text-xs font-bold transition-all text-center block"
                      >
                        {item.status === 'safe_with_security'
                          ? t.initiateClaim
                          : item.status === 'reported_lost'
                          ? t.matchFoundItem
                          : t.underReview}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 4-COLS: LIVE ACTIVITY STREAM */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </span>
                <h3 className="font-bold text-base text-on-surface">{t.campusActivityFeed}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-outline text-[11px] font-bold">
                {t.live}
              </span>
            </div>

            <div className="space-y-4">
              {activityFeed.map((act: ActivityFeedItem) => (
                <div key={act.id} className="flex gap-3 items-start p-2 rounded-2xl hover:bg-surface-container transition-colors">
                  <div className="p-2 rounded-xl bg-primary text-on-primary shrink-0 mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-on-surface truncate">
                        {act.actor}
                      </span>
                      <span className="text-[10px] text-outline shrink-0">{act.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-snug">
                      {lang === 'ar' ? act.actionAr : act.action}
                    </p>
                    <p className="text-[11px] text-secondary italic font-medium">
                      {lang === 'ar' ? act.detailAr : act.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Facility Guidelines Widget */}
          <div className="bg-surface-container-low rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>{lang === 'ar' ? 'معايير تسليم واستلام المفقودات' : 'Custody Handover Protocol'}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {lang === 'ar'
                ? 'يتم تحويل الأجهزة الثمينة والهواتف والحواسيب يوميًا في تمام الساعة 6:00 مساءً إلى خزينة الأمانات ببرج الإدارة المركزي.'
                : 'All high-value items (laptops, phones, jewelry, wallets) are transferred daily at 6:00 PM to the Central Holding Vault in the Administration Tower.'}
            </p>
            <div className="pt-2">
              <Link
                to="/lost-items"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>{lang === 'ar' ? 'قراءة البروتوكول المعتمد' : 'Review Full Security Policy'}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
