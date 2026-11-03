import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ClaimModal } from '../components/lostfound/ClaimModal';
import { ReportLostFoundModal } from '../components/lostfound/ReportLostFoundModal';
import { LostFoundItem, LostFoundType, ClaimRequest } from '../types';
import { DataStatePanel } from '../components/common/DataStatePanel';

export const LostItemsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { lostFoundItems, lostFoundState, refreshLostFound, claims, claimsState, refreshClaims } = useData();
  const location = useLocation();

  // URL query search
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('q') || '';
  const reportIntent = queryParams.get('report');

  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'my_claims'>(() =>
    queryParams.get('tab') === 'found' || queryParams.get('tab') === 'lost'
      ? queryParams.get('tab') as 'found' | 'lost'
      : 'all'
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Modals state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<LostFoundItem | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(
    () => reportIntent === 'lost' || reportIntent === 'found'
  );
  const [reportModalType, setReportModalType] = useState<LostFoundType>(
    reportIntent === 'found' ? 'found' : 'lost'
  );
  const foundItemCount = lostFoundItems.filter((item) => item.type === 'found').length;
  const lostItemCount = lostFoundItems.filter((item) => item.type === 'lost').length;
  const visibleClaims = claims;

  const filteredItems = lostFoundItems.filter((item: LostFoundItem) => {
    if (activeTab === 'lost' && item.type !== 'lost') return false;
    if (activeTab === 'found' && item.type !== 'found') return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedLocation !== 'All' && !item.location.includes(selectedLocation)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.titleAr?.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.descriptionAr?.toLowerCase().includes(q) ||
        item.tagNumber.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.locationAr?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenClaim = (item: LostFoundItem) => {
    setSelectedItemForClaim(item);
    setClaimModalOpen(true);
  };

  const handleOpenReportModal = (mode: LostFoundType) => {
    setReportModalType(mode);
    setReportModalOpen(true);
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Hero / Title & Stats Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-6 sm:p-8 lg:p-10 shadow-sm border border-outline-variant/30">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              {lang === 'ar' ? 'المفقودات والمعثورات' : 'Lost & Found'}
            </h1>
            <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
              {lang === 'ar'
                ? 'ابحث عن غرضك أو أخبرنا بما فقدته أو عثرت عليه.'
                : 'Search for an item, or tell us what you lost or found.'}
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-xl">
            <button
              type="button"
              onClick={() => handleOpenReportModal('lost')}
              className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 text-start shadow-sm transition hover:border-primary"
            >
              <span className="material-symbols-outlined text-2xl text-secondary" aria-hidden="true">search_off</span>
              <span>
                <span className="block font-bold text-on-surface">
                  {lang === 'ar' ? 'أنا فقدت غرضًا' : 'I Lost Something'}
                </span>
                <span className="mt-1 block text-xs text-on-surface-variant">
                  {lang === 'ar' ? 'أرسل بلاغًا عن غرضك المفقود.' : 'Report an item you can’t find.'}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenReportModal('found')}
              className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-start text-on-primary shadow-sm transition hover:bg-tertiary"
            >
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">inventory_2</span>
              <span>
                <span className="block font-bold">
                  {lang === 'ar' ? 'أنا عثرت على غرض' : 'I Found Something'}
                </span>
                <span className="mt-1 block text-xs opacity-90">
                  {lang === 'ar' ? 'ساعد صاحبه على استعادته.' : 'Help its owner get it back.'}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Filter Bar & Search Container */}
      <div className="flex flex-col gap-4 bg-surface-container-low p-4 sm:p-6 rounded-3xl shadow-sm border border-outline-variant/30">
        {/* Top Row: Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-full bg-surface-container shadow-inner border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lang === 'ar' ? `جميع العناصر (${lostFoundItems.length})` : `All Items (${lostFoundItems.length})`}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lost')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'lost'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lang === 'ar' ? `المفقودات (${lostItemCount})` : `Lost Items (${lostItemCount})`}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('found')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'found'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lang === 'ar' ? `المعثورات (${foundItemCount})` : `Found Items (${foundItemCount})`}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_claims')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                activeTab === 'my_claims'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>{t.claimRequests}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px]">
                {lang === 'ar' ? `${visibleClaims.length} طلب` : `${visibleClaims.length} requests`}
              </span>
            </button>
          </div>

          <div className="text-on-surface-variant text-xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>{lang === 'ar' ? 'يتطلب الاسترداد التحقق من الهوية الجامعية' : 'Verified Student & Faculty Authentication Required'}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchItemsPlaceholder}
            aria-label={t.searchItemsPlaceholder}
            dir="auto"
            className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 text-xs sm:text-sm pl-12 pr-12 py-3.5 rounded-2xl shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-outline hover:text-on-surface"
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-on-surface-variant">{t.categoryLabel}</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest text-on-surface text-xs font-semibold py-2.5 px-3 pr-8 rounded-xl shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="All">{t.allCategories}</option>
                <option value="Electronics & Gadgets">{lang === 'ar' ? 'أجهزة إلكترونية' : 'Electronics & Gadgets'}</option>
                <option value="IDs, Badges & Wallets">{lang === 'ar' ? 'بطاقات ومحافظ' : 'IDs, Badges & Wallets'}</option>
                <option value="Books, Notes & Binders">{lang === 'ar' ? 'كتب ودفاتر' : 'Books, Notes & Binders'}</option>
                <option value="Personal Accessories & Watches">{lang === 'ar' ? 'إكسسوارات وساعات' : 'Personal Accessories & Watches'}</option>
                <option value="Keys & FOBs">{lang === 'ar' ? 'مفاتيح' : 'Keys & FOBs'}</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                keyboard_arrow_down
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-on-surface-variant">{lang === 'ar' ? 'مبنى الحرم' : 'Building Location'}</label>
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest text-on-surface text-xs font-semibold py-2.5 px-3 pr-8 rounded-xl shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="All">{t.allLocations}</option>
                <option value="Library">{lang === 'ar' ? 'المكتبة المركزية' : 'Central Library'}</option>
                <option value="Engineering">{lang === 'ar' ? 'مبنى الهندسة والمختبرات' : 'Engineering Hall & Labs'}</option>
                <option value="Student Union">{lang === 'ar' ? 'اتحاد الطلاب' : 'Student Union & Café'}</option>
                <option value="Athletic">{lang === 'ar' ? 'المجمع الرياضي' : 'Athletic Sports Complex'}</option>
                <option value="Health">{lang === 'ar' ? 'مركز الرعاية الصحية' : 'Health & Wellness Center'}</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                keyboard_arrow_down
              </span>
            </div>
          </div>

          {/* Quick Clear */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLocation('All');
              }}
              className="py-2.5 px-3 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-xs font-semibold transition-colors text-center border border-outline-variant/30"
            >
              {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid or My Claims Tab */}
      {activeTab === 'my_claims' ? (
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
          <h3 className="font-bold text-lg text-on-surface">{t.claimRequests}</h3>
          <div className="space-y-3">
            {claimsState.status !== 'success' ? (
              <DataStatePanel state={claimsState} lang={lang} onRetry={() => void refreshClaims()} />
            ) : visibleClaims.map((claim: ClaimRequest) => {
              const claimItem = lostFoundItems.find((item) => item.id === claim.itemId);
              const claimTitle =
                lang === 'ar' && claimItem?.titleAr ? claimItem.titleAr : claim.itemTitle;
              return (
              <div
                key={claim.id}
                className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={claim.itemImageUrl}
                    alt={claimTitle}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[11px] text-outline font-semibold">{claim.itemTag}</span>
                    <h4 className="font-bold text-sm text-on-surface">{claimTitle}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {lang === 'ar' ? 'تاريخ الطلب:' : 'Submitted:'} {claim.submittedAt} •{' '}
                      {lang === 'ar' ? 'طريقة الاستلام:' : 'Method:'}{' '}
                      {claim.pickupMethod === 'central'
                        ? lang === 'ar' ? 'مكتب الأمن المركزي' : 'Central Desk'
                        : lang === 'ar' ? 'مكتب شؤون الكلية' : 'Department office'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={claim.status} />
                </div>
              </div>
            )})}
            {claimsState.status === 'success' && visibleClaims.length === 0 && (
              <p className="py-8 text-center text-sm text-on-surface-variant">
                {lang === 'ar' ? 'ليس لديك طلبات استرداد حتى الآن.' : 'You have no claim requests yet.'}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
        {lostFoundState.status !== 'success' ? (
          <DataStatePanel state={lostFoundState} lang={lang} onRetry={() => void refreshLostFound()} />
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostFoundState.status === 'success' && filteredItems.map((item: LostFoundItem) => {
            const title = lang === 'ar' ? item.titleAr || item.title : item.title;
            const description = lang === 'ar' ? item.descriptionAr || item.description : item.description;
            const itemLocation = lang === 'ar' ? item.locationAr || item.location : item.location;
            return (
            <div
              key={item.id}
              className="flex flex-col rounded-3xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all duration-200 group"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-surface-container">
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <StatusBadge status={item.status} />
                </div>
                <div className="absolute bottom-2.5 right-2.5 inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[11px] font-bold shadow-sm">
                  <span>{lang === 'ar' ? 'رقم' : 'Ref'} {item.tagNumber}</span>
                </div>
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h2 className="font-bold text-base text-on-surface line-clamp-1">{title}</h2>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
                      location_on
                    </span>
                    <span className="truncate">{itemLocation}</span>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2 border-t border-outline-variant/20">
                  {item.status === 'safe_with_security' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenClaim(item)}
                      className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>{t.initiateClaim}</span>
                    </button>
                  ) : item.status === 'reported_lost' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenClaim(item)}
                      className="w-full py-2.5 px-4 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary hover:text-on-secondary text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">inventory</span>
                      <span>{t.matchFoundItem}</span>
                    </button>
                  ) : item.status === 'claim_pending' ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-on-surface-variant text-xs font-semibold cursor-default text-center"
                    >
                      {t.underReview}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low text-outline text-xs font-semibold cursor-default text-center"
                    >
                      {t.archivedRecord}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )})}
          {lostFoundState.status === 'success' && filteredItems.length === 0 && (
            <div className="col-span-full rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-10 text-center">
              <span className="material-symbols-outlined text-outline text-[40px]">search_off</span>
              <p className="mt-2 font-bold text-sm text-on-surface">
                {lang === 'ar' ? 'مفيش عناصر مطابقة للاختيارات دي.' : 'No items match these filters.'}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                {lang === 'ar' ? 'جرّب تغيير البحث أو الفئة، أو أرسل بلاغًا جديدًا.' : 'Try another search or category, or create a report.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setActiveTab('all');
                }}
                className="mt-3 rounded-xl px-4 py-2 text-xs font-semibold text-primary hover:bg-surface-container"
              >
                {lang === 'ar' ? 'عرض كل العناصر' : 'Show all items'}
              </button>
              {activeTab === 'lost' && (
                <button
                  type="button"
                  onClick={() => handleOpenReportModal('lost')}
                  className="mt-3 ms-2 rounded-xl px-4 py-2 text-xs font-semibold text-primary hover:bg-surface-container"
                >
                  {lang === 'ar' ? 'الإبلاغ عن غرض مفقود' : 'Report a lost item'}
                </button>
              )}
            </div>
          )}
        </div>
        </>
      )}

      <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5">
        <h2 className="font-bold text-on-surface">
          {lang === 'ar' ? 'استعادة غرض عثرت عليه' : 'Claiming a found item'}
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          {lang === 'ar'
            ? 'افتح العنصر الذي يشبه غرضك، ثم أرسل طلب استعادة. سيظهر تحديث الطلب في صفحة طلباتي.'
            : 'Open an item that looks like yours and submit a claim. You can follow its status in Claim Requests.'}
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('found')}
          className="mt-3 text-sm font-bold text-primary hover:underline"
        >
          {lang === 'ar' ? 'عرض المعثورات' : 'Browse found items'}
        </button>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        item={selectedItemForClaim}
        isOpen={claimModalOpen}
        onClose={() => {
          setClaimModalOpen(false);
          setSelectedItemForClaim(null);
        }}
      />

      {/* Report Modal */}
      <ReportLostFoundModal
        isOpen={reportModalOpen}
        initialType={reportModalType}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
