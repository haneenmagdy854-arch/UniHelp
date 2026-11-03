import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ClaimModal } from '../components/lostfound/ClaimModal';
import { ReportLostFoundModal } from '../components/lostfound/ReportLostFoundModal';
import { LostFoundItem } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const FoundItemsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { lostFoundItems, lostFoundState, refreshLostFound } = useData();

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<LostFoundItem | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');

  const foundItems = lostFoundItems.filter((i: LostFoundItem) => i.type === 'found');
  const filtered = foundItems.filter((item: LostFoundItem) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.titleAr?.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.descriptionAr?.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.locationAr?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-on-surface">{t.foundItems}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
              {foundItems.length} {lang === 'ar' ? 'عنصر معثور عليه' : 'Cataloged'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {lang === 'ar'
              ? 'العناصر التي تم العثور عليها وتوثيقها في مكاتب الأمانات والحراسة المركزية'
              : 'Verified campus items currently secured across custodial holding desks and ready for authorized claim'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary shadow-sm transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">inventory</span>
          <span>{t.reportFoundItem}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
          search
        </span>
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={t.searchItemsPlaceholder}
          className="w-full bg-surface-container-lowest text-xs text-on-surface pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant/40 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Grid */}
      {lostFoundState.status !== 'success' && (
        <DataStatePanel state={lostFoundState} lang={lang} onRetry={() => void refreshLostFound()} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lostFoundState.status === 'success' && filtered.map((item: LostFoundItem) => {
          const title = lang === 'ar' ? item.titleAr || item.title : item.title;
          const description = lang === 'ar' ? item.descriptionAr || item.description : item.description;
          const location = lang === 'ar' ? item.locationAr || item.location : item.location;
          return (
            <div
              key={item.id}
              className="flex flex-col rounded-3xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all group"
            >
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-surface-container">
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <StatusBadge status={item.status} />
                </div>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[11px] font-bold shadow-sm">
                  {lang === 'ar' ? 'رقم' : 'Tag'} {item.tagNumber}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                <h3 className="font-bold text-sm text-on-surface line-clamp-1">{title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{description}</p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                    <span className="truncate">{location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemForClaim(item);
                      setClaimModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>{t.initiateClaim}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {lostFoundState.status === 'success' && filtered.length === 0 && (
          <div className="col-span-full rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-10 text-center">
            <span className="material-symbols-outlined text-outline text-[40px]">inventory_2</span>
            <p className="mt-2 font-bold text-sm text-on-surface">
              {lang === 'ar' ? 'لا توجد عناصر معثور عليها تطابق بحثك.' : 'No found items match your search.'}
            </p>
          </div>
        )}
      </div>

      <ClaimModal
        item={selectedItemForClaim}
        isOpen={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
          setSelectedItemForClaim(null);
        }}
      />

      <ReportLostFoundModal
        isOpen={reportModalOpen}
        initialType="found"
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
