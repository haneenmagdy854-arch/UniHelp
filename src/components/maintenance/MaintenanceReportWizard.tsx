import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MaintenanceCategory, PriorityLevel } from '../../types';

interface MaintenanceReportWizardProps {
  onSuccess?: (ticketNumber: string) => void;
}

const arabicBuildingLabels: Record<string, string> = {
  'Building 4 (Al-Khawarizmi)': 'المبنى 4 (الخوارزمي)',
  'Building 1 (Administration)': 'مبنى الإدارة 1',
  'Building 2 (Central Library)': 'المبنى 2 (المكتبة المركزية)',
  'Building 9 (Student Union)': 'المبنى 9 (اتحاد الطلاب)'
};

const arabicFloorLabels: Record<string, string> = {
  'Floor 3 - Robotics Wing': 'الطابق الثالث - جناح الروبوتات',
  'Basement - Heavy Labs': 'القبو - المختبرات الثقيلة',
  'Floor 1 - Main Concourse': 'الطابق الأول - البهو الرئيسي',
  'Floor 2 - Faculty Offices': 'الطابق الثاني - مكاتب أعضاء هيئة التدريس'
};

export const MaintenanceReportWizard: React.FC<MaintenanceReportWizardProps> = ({ onSuccess }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { addReport } = useData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory | ''>('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('moderate');
  const [description, setDescription] = useState('');
  const [assetBarcode, setAssetBarcode] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');

  const categories: { key: MaintenanceCategory; emoji: string; labelEn: string; labelAr: string }[] = [
    { key: 'electricity', emoji: '⚡', labelEn: 'Electricity', labelAr: 'الكهرباء' },
    { key: 'ac', emoji: '❄️', labelEn: 'Air Cond.', labelAr: 'التكييف' },
    { key: 'network', emoji: '📶', labelEn: 'Network', labelAr: 'الشبكة' },
    { key: 'furniture', emoji: '🪑', labelEn: 'Furniture', labelAr: 'الأثاث' },
    { key: 'cleaning', emoji: '🧹', labelEn: 'Janitorial', labelAr: 'النظافة' },
    { key: 'lab', emoji: '🔬', labelEn: 'Laboratory', labelAr: 'المختبر' },
    { key: 'other', emoji: '🛠️', labelEn: 'Other Infrastructure', labelAr: 'أخرى' }
  ];

  const quickSnippets = [
    { en: '+ AC not cooling', ar: '+ التكييف لا يبرد' },
    { en: '+ Water leak on floor', ar: '+ تسريب مياه على الأرض' },
    { en: '+ No power to outlets', ar: '+ لا يوجد تيار بمقابس الكهرباء' },
    { en: '+ Door lock stuck', ar: '+ قفل الباب عالق' }
  ];

  const handleSnippetClick = (snippetText: string) => {
    setDescription((prev) => (prev ? `${prev} ${snippetText}` : snippetText));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleNext = () => {
    let error = '';
    if (step === 1 && !category) {
      error = lang === 'ar' ? 'اختار نوع المشكلة للمتابعة.' : 'Choose a problem category to continue.';
    } else if (step === 2 && (!building || !floor || !room.trim())) {
      error = lang === 'ar' ? 'حدد المبنى والطابق واكتب رقم الغرفة أو المكان.' : 'Choose a building and floor, then enter the room or location.';
    } else if (step === 3 && (!title.trim() || !description.trim())) {
      error = lang === 'ar' ? 'اكتب عنوانًا ووصفًا مختصرًا للمشكلة.' : 'Add a short title and description of the problem.';
    }

    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    setStep((current) => Math.min(current + 1, 5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      handleNext();
      return;
    }
    if (!category || !building || !floor || !room.trim() || !title.trim() || !description.trim()) {
      setValidationError(
        lang === 'ar'
          ? 'راجع نوع المشكلة والموقع والعنوان والوصف قبل الإرسال.'
          : 'Check the category, location, title, and description before submitting.'
      );
      return;
    }
    if (previewImage) {
      setValidationError(
        lang === 'ar'
          ? 'لا يمكن حفظ صورة من جهازك دون إعداد مساحة تخزين Supabase. أزل الصورة للمتابعة، أو أضف رابط صورة مستضافًا.'
          : 'A photo from your device cannot be saved until Supabase Storage is configured. Remove the photo to continue, or use a hosted image URL.'
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError('');
    try {
      const created = await addReport({
        title,
        titleAr: /[\u0600-\u06ff]/.test(title) ? title : undefined,
        description,
        descriptionAr: /[\u0600-\u06ff]/.test(description) ? description : undefined,
        category,
        priority,
        building,
        buildingAr: lang === 'ar' ? arabicBuildingLabels[building] || building : undefined,
        floor,
        floorAr: lang === 'ar' ? arabicFloorLabels[floor] || floor : undefined,
        room,
        roomAr: /[\u0600-\u06ff]/.test(room) ? room : undefined,
        assetBarcode,
        imageUrl: undefined,
        reporterId: user?.id || 'user-current',
        reporterName: user?.name || 'Campus Student',
        reporterRole: user?.role || 'student'
      });

      setIsSubmitting(false);
      setSuccessMessage(created.ticketNumber);

      if (onSuccess) {
        onSuccess(created.ticketNumber);
      } else {
        setTimeout(() => {
          navigate(`/maintenance/${created.ticketNumber.replace('#', '')}`);
        }, 1200);
      }
    } catch (error) {
      setValidationError(
        `${lang === 'ar' ? 'تعذر إرسال البلاغ:' : 'Could not submit the report:'} ${error instanceof Error ? error.message : ''}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Form Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-md border border-outline-variant/30">
        {/* Step Indicator Header */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">
              {lang === 'ar' ? `الخطوة ${step} من 5` : `Step ${step} of 5`}
            </span>
            <div
              className="flex items-center gap-1.5"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={5}
              aria-valuenow={step}
              aria-label={lang === 'ar' ? `الخطوة ${step} من 5` : `Step ${step} of 5`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`w-6 h-2 rounded-full ${index < step ? 'bg-primary' : 'bg-surface-container-highest'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-on-surface-variant">
            {lang === 'ar'
              ? ['اختار نوع المشكلة.', 'حدد مكان المشكلة.', 'اكتب وصفًا مختصرًا.', 'أرفق صورة إذا كانت متاحة.', 'راجع البيانات قبل الإرسال.'][step - 1]
              : ['Choose a problem category.', 'Tell us where it happened.', 'Add a short description.', 'Add a photo if you have one.', 'Review the details before sending.'][step - 1]}
          </p>
          <h2 className="font-bold text-2xl text-on-surface tracking-tight">
            {t.submitTitle}
          </h2>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#E6F4EA] border border-[#A3D9B1] text-[#1E5E3A] flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
            <div>
              <p className="font-bold text-sm">
                {lang === 'ar' ? `تم تسجيل البلاغ بنجاح! رقم التتبع: ${successMessage}` : `Report Logged Successfully! Tracking ID: ${successMessage}`}
              </p>
              <p className="text-xs">
                {onSuccess
                  ? lang === 'ar' ? 'تقدر تتابع حالة البلاغ أدناه.' : 'You can follow the report status below.'
                  : lang === 'ar' ? 'جاري فتح صفحة متابعة البلاغ...' : 'Opening report tracking...'}
              </p>
            </div>
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Issue Title */}
          {step === 3 && (
            <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface flex items-center justify-between" htmlFor="issueTitle">
              <span>{t.issueTitleLabel}</span>
              <span className="text-outline text-[11px] font-normal">
                {lang === 'ar' ? 'كن دقيقًا ومختصرًا' : 'Be specific & succinct'}
              </span>
            </label>
            <div className="relative">
              <input
                id="issueTitle"
                type="text"
                required
                aria-invalid={Boolean(validationError && !title.trim())}
                aria-describedby={validationError ? 'report-validation-error' : undefined}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setValidationError('');
                }}
                placeholder={t.issueTitlePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none transition-all pr-10"
              />
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-tertiary text-[20px] pointer-events-none">
                edit_note
              </span>
            </div>
          </div>
          </>
          )}

          {/* Category Classification Pills */}
          {step === 1 && (
            <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface">{t.categoryLabel}</label>
              <span className="text-[11px] text-outline">{t.categorySelectHint}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setCategory(cat.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all border ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container font-bold border-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-surface-container-lowest flex items-center justify-center text-[13px] shadow-sm">
                      {cat.emoji}
                    </span>
                    <span className="truncate">{lang === 'ar' ? cat.labelAr : cat.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
          </>
          )}

          {/* Cascading Campus Location Hierarchy */}
          {step === 2 && (
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
              <span className="text-xs font-semibold text-on-surface">{t.locationHierarchy}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Building */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-on-surface-variant font-medium">{t.building}</label>
                <div className="relative">
                  <select
                    value={building}
                    required
                    onChange={(e) => {
                      setBuilding(e.target.value);
                      setValidationError('');
                    }}
                    className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl bg-surface-container-lowest text-on-surface text-xs shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none"
                  >
                    <option value="">{lang === 'ar' ? 'اختار المبنى' : 'Choose a building'}</option>
                    <option value="Building 4 (Al-Khawarizmi)">{lang === 'ar' ? 'المبنى 4 (الخوارزمي)' : 'Building 4 (Al-Khawarizmi)'}</option>
                    <option value="Building 1 (Administration)">{lang === 'ar' ? 'مبنى الإدارة 1' : 'Building 1 (Administration)'}</option>
                    <option value="Building 2 (Central Library)">{lang === 'ar' ? 'المبنى 2 (المكتبة المركزية)' : 'Building 2 (Central Library)'}</option>
                    <option value="Building 9 (Student Union)">{lang === 'ar' ? 'المبنى 9 (اتحاد الطلاب)' : 'Building 9 (Student Union)'}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Floor */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-on-surface-variant font-medium">{t.floor}</label>
                <div className="relative">
                  <select
                    value={floor}
                    required
                    onChange={(e) => {
                      setFloor(e.target.value);
                      setValidationError('');
                    }}
                    className="w-full appearance-none px-3 py-2.5 pr-8 rounded-xl bg-surface-container-lowest text-on-surface text-xs shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none"
                  >
                    <option value="">{lang === 'ar' ? 'اختار الطابق' : 'Choose a floor'}</option>
                    <option value="Floor 3 - Robotics Wing">{lang === 'ar' ? 'الطابق الثالث - جناح الروبوتات' : 'Floor 3 - Robotics Wing'}</option>
                    <option value="Basement - Heavy Labs">{lang === 'ar' ? 'القبو - المختبرات الثقيلة' : 'Basement - Heavy Labs'}</option>
                    <option value="Floor 1 - Main Concourse">{lang === 'ar' ? 'الطابق الأول - البهو الرئيسي' : 'Floor 1 - Main Concourse'}</option>
                    <option value="Floor 2 - Faculty Offices">{lang === 'ar' ? 'الطابق الثاني - مكاتب أعضاء هيئة التدريس' : 'Floor 2 - Faculty Offices'}</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Room */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-on-surface-variant font-medium">{t.room}</label>
                <input
                  type="text"
                  value={room}
                  required
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: الغرفة 302، القاعة B' : 'e.g. Room 302, Hall B'}
                  dir="auto"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-xs shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
          )}

          {/* Priority Level */}
          {step === 1 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">{t.priorityLabel}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'low', label: t.priorityLow, color: 'text-primary' },
                { key: 'moderate', label: t.priorityModerate, color: 'text-secondary' },
                { key: 'high', label: t.priorityHigh, color: 'text-amber-700' },
                { key: 'urgent', label: t.priorityUrgent, color: 'text-error' }
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={priority === p.key}
                  onClick={() => setPriority(p.key as PriorityLevel)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    priority === p.key
                      ? 'bg-surface-container-highest border-primary shadow-sm ring-1 ring-primary'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  } ${p.color}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Detailed Symptoms & Textarea with Quick Snippets */}
          {step === 3 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface" htmlFor="reportDescription">
                {t.descriptionLabel}
              </label>
            </div>
            {/* Snippet shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-outline font-medium mr-1">{t.quickSnippets}</span>
              {quickSnippets.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSnippetClick(lang === 'ar' ? s.ar : s.en)}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] hover:bg-surface-container-high hover:text-on-surface transition-all border border-outline-variant/30"
                >
                  {lang === 'ar' ? s.ar : s.en}
                </button>
              ))}
            </div>
            <textarea
              id="reportDescription"
              required
              aria-invalid={Boolean(validationError && !description.trim())}
              aria-describedby={validationError ? 'report-validation-error' : undefined}
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setValidationError('');
              }}
              placeholder={t.descriptionPlaceholder}
              dir="auto"
              className="w-full p-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm shadow-sm border border-outline-variant/40 focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>
          )}

          {/* Evidence Uploader + Asset Barcode / Tag ID */}
          {step === 4 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface">
                {lang === 'ar' ? 'صورة للمشكلة (اختياري)' : 'Photo of the problem (optional)'}
              </label>
              <span className="text-[11px] text-outline">{t.dropzoneSubtext}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Dropzone & Preview */}
              <div className="md:col-span-8 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
                {previewImage ? (
                  <div className="relative group w-20 h-20 rounded-xl overflow-hidden shadow-sm shrink-0 bg-surface-dim">
                    <img
                      src={previewImage}
                      alt={lang === 'ar' ? 'معاينة الصورة المرفقة' : 'Uploaded preview'}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ) : null}

                <label className="flex-1 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-surface-container transition-colors rounded-xl border-2 border-dashed border-outline-variant/60 focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="file"
                    accept="image/*"
                    aria-label={lang === 'ar' ? 'إرفاق صورة للمشكلة' : 'Attach a photo of the problem'}
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-1 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                  </div>
                  <p className="text-xs font-bold text-on-surface">{t.dropzoneText}</p>
                  <p className="text-[10px] text-on-surface-variant">
                    {lang === 'ar' ? 'الصورة اختيارية' : 'Adding a photo is optional'}
                  </p>
                </label>
              </div>

              {/* Asset Barcode */}
              <div className="md:col-span-4 p-3 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-primary mb-1">
                    <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{t.assetBarcode}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-snug">
                    {t.assetBarcodeHint}
                  </p>
                </div>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    value={assetBarcode}
                    onChange={(e) => setAssetBarcode(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: EQ-1002' : 'e.g. EQ-1002'}
                    className="w-full px-3 py-1.5 pr-8 rounded-lg bg-surface-container-lowest text-xs font-semibold text-on-surface shadow-sm focus:outline-none uppercase tracking-wide border border-outline-variant/40"
                  />
                  <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-[16px]">
                    barcode
                  </span>
                </div>
              </div>
            </div>
          </div>
          )}

          {step === 5 && (
            <section className="space-y-4 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5" aria-labelledby="review-report-title">
              <h2 id="review-report-title" className="text-lg font-bold text-on-surface">
                {lang === 'ar' ? 'راجع البلاغ قبل الإرسال' : 'Review your report'}
              </h2>
              <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-xs text-on-surface-variant">{t.categoryLabel}</dt>
                  <dd className="font-semibold text-on-surface">{lang === 'ar' ? categories.find((item) => item.key === category)?.labelAr : categories.find((item) => item.key === category)?.labelEn}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">{t.locationHierarchy}</dt>
                  <dd className="font-semibold text-on-surface">
                    {lang === 'ar' ? arabicBuildingLabels[building] || building : building}
                    {' · '}
                    {lang === 'ar' ? arabicFloorLabels[floor] || floor : floor}
                    {' · '}{room}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-on-surface-variant">{t.issueTitleLabel}</dt>
                  <dd className="font-semibold text-on-surface">{title}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-on-surface-variant">{t.descriptionLabel}</dt>
                  <dd className="whitespace-pre-wrap text-on-surface">{description}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">{t.priorityLabel}</dt>
                  <dd className="font-semibold text-on-surface">
                    {priority === 'low' ? t.priorityLow : priority === 'moderate' ? t.priorityModerate : priority === 'high' ? t.priorityHigh : t.priorityUrgent}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-on-surface-variant">{lang === 'ar' ? 'الصورة' : 'Photo'}</dt>
                  <dd className="font-semibold text-on-surface">
                    {previewImage ? (lang === 'ar' ? 'مرفقة' : 'Attached') : (lang === 'ar' ? 'لا توجد صورة' : 'No photo')}
                  </dd>
                </div>
              </dl>
            </section>
          )}

          {validationError && (
            <p id="report-validation-error" className="text-sm font-semibold text-error" role="alert">
              {validationError}
            </p>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setStep((current) => current - 1);
                  setValidationError('');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-all"
              >
                {lang === 'ar' ? 'السابق' : 'Back'}
              </button>
            ) : <span />}

            <button
              type={step === 5 ? 'submit' : 'button'}
              onClick={step < 5 ? handleNext : undefined}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-tertiary shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[20px]">{step === 5 ? 'assignment_turned_in' : 'arrow_forward'}</span>
              )}
              <span>
                {step === 5
                  ? t.submitAndGenerateTracking
                  : lang === 'ar' ? 'التالي' : 'Continue'}
              </span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
