import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ClaimRequest } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const ClaimRequestsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { claims, claimsState, refreshClaims, lostFoundItems } = useData();
  const visibleClaims = claims;

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">{t.claimRequests}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
              {visibleClaims.length} {lang === 'ar' ? 'طلب' : 'Logged Claims'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {lang === 'ar'
              ? 'تابع طلبات استعادة المفقودات وتفاصيل استلامها من مكتب الأمن.'
              : 'Track ownership claims, verification status, and retrieval instructions'}
          </p>
        </div>

        <Link
          to="/lost-items"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-colors border border-outline-variant/30 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span>{lang === 'ar' ? 'تصفح المفقودات' : 'Browse Registry'}</span>
        </Link>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claimsState.status !== 'success' ? (
          <DataStatePanel state={claimsState} lang={lang} onRetry={() => void refreshClaims()} />
        ) : visibleClaims.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/30 space-y-2">
            <span className="material-symbols-outlined text-outline text-[48px]">verified</span>
            <p className="font-bold text-sm text-on-surface">
              {lang === 'ar' ? 'لا توجد طلبات استعادة حاليًا.' : 'No claim requests logged yet.'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {lang === 'ar'
                ? 'إذا وجدت غرضًا يخصك، قدّم طلبًا لإثبات ملكيتك واستعادته.'
                : 'If you locate your lost belongings in the found registry, initiate a secure claim.'}
            </p>
          </div>
        ) : (
          visibleClaims.map((claim: ClaimRequest) => {
            const item = lostFoundItems.find((entry) => entry.id === claim.itemId);
            const itemTitle = lang === 'ar' && item?.titleAr ? item.titleAr : claim.itemTitle;
            const reviewNote =
              claim.adminVerificationNote ||
              (lang === 'ar'
                ? 'بانتظار مطابقة بيانات العنصر والتحقق من الهوية.'
                : 'Awaiting custodial inspection and ID comparison.');
            return (
            <div
              key={claim.id}
              className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
                  <img
                    src={claim.itemImageUrl}
                    alt={itemTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-outline">{claim.itemTag}</span>
                    <StatusBadge status={claim.status} />
                  </div>
                  <h3 className="font-bold text-base text-on-surface">{itemTitle}</h3>
                  <p className="text-xs text-on-surface-variant">
                    {lang === 'ar' ? 'طريقة الاستلام:' : 'Pickup Method:'}{' '}
                    <strong className="text-on-surface">
                      {claim.pickupMethod === 'central'
                        ? lang === 'ar' ? 'مكتب الأمن المركزي، برج الإدارة' : 'Central Security Desk (Admin Tower, 1st Floor)'
                        : lang === 'ar' ? 'مكتب شؤون الكلية' : 'Department Dean Reception'}
                    </strong>
                  </p>
                  <p className="text-[11px] text-outline">
                    {lang === 'ar' ? 'تاريخ الطلب:' : 'Submitted'} {claim.submittedAt}
                  </p>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 max-w-sm text-xs space-y-1">
                <span className="font-bold text-on-surface block text-[11px]">
                  {lang === 'ar' ? 'ملاحظة التدقيق الأمني:' : 'Security Review Note:'}
                </span>
                <p className="text-on-surface-variant italic">
                  "{reviewNote}"
                </p>
              </div>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
};
