import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LostFoundType } from '../../types';

interface ReportLostFoundModalProps {
  isOpen: boolean;
  initialType?: LostFoundType;
  onClose: () => void;
  onSuccess?: () => void;
}

const arabicLostFoundLocations: Record<string, string> = {
  'Main University Library': 'المكتبة المركزية',
  'Engineering Hall & Labs': 'مبنى الهندسة والمختبرات',
  'Student Union & Dining Hall': 'اتحاد الطلاب والمطعم',
  'Sports Complex & Arena': 'المجمع والصالة الرياضية',
  'Health Sciences Center': 'مركز العلوم الصحية'
};

export const ReportLostFoundModal: React.FC<ReportLostFoundModalProps> = ({
  isOpen,
  initialType = 'lost',
  onClose,
  onSuccess
}) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { addLostFoundItem } = useData();

  const [type, setType] = useState<LostFoundType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [location, setLocation] = useState('Main University Library');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setSubmitted(false);
      setValidationError('');
      return;
    }

    setTitle('');
    setDescription('');
    setImageUrl('');
    setValidationError('');
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setValidationError(
        lang === 'ar'
          ? 'اكتب اسم العنصر ووصفه قبل الإرسال.'
          : 'Enter an item name and description before submitting.'
      );
      return;
    }
    if (imageUrl.trim() && !/^https?:\/\/\S+$/i.test(imageUrl.trim())) {
      setValidationError(
        lang === 'ar'
          ? 'أدخل رابط صورة يبدأ بـ http أو https، أو اترك الحقل فارغًا.'
          : 'Enter an image URL starting with http or https, or leave the field empty.'
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError('');
    try {
      await addLostFoundItem({
        title,
        titleAr: /[\u0600-\u06ff]/.test(title) ? title : undefined,
        description,
        descriptionAr: /[\u0600-\u06ff]/.test(description) ? description : undefined,
        type,
        category,
        location,
        locationAr: arabicLostFoundLocations[location] || location,
        imageUrl: imageUrl.trim(),
        status: type === 'lost' ? 'reported_lost' : 'safe_with_security',
        reportedBy: user?.id || 'user-current',
        reportedByName: user?.name || 'Campus Student',
        holdingLocation: type === 'found' ? 'Campus Security Central Desk' : undefined
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      setValidationError(
        `${lang === 'ar' ? 'تعذر تسجيل العنصر:' : 'Could not submit the item:'} ${error instanceof Error ? error.message : ''}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-2xl border border-outline-variant/40 z-10 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lost-found-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              {type === 'lost' ? 'search_off' : 'inventory'}
            </span>
            <h3 id="lost-found-modal-title" className="font-bold text-lg text-on-surface">
              {type === 'lost'
                ? lang === 'ar' ? 'تسجيل عنصر مفقود' : 'Report Lost Item'
                : lang === 'ar' ? 'تسجيل عنصر تم العثور عليه' : 'Report Found Item'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]" aria-label={t.close}>close</span>
          </button>
        </div>

        {/* Type Toggle */}
        <div className="my-4 p-1 rounded-xl bg-surface-container flex items-center gap-1">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === 'lost'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.reportedLost}
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              type === 'found'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.foundItems}
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3" role="status" aria-live="polite">
            <span className="material-symbols-outlined text-primary text-[40px]">check_circle</span>
            <p className="font-bold text-sm text-on-surface">
              {lang === 'ar'
                ? type === 'lost' ? 'تم تسجيل بلاغك عن المفقود.' : 'تم تسجيل العنصر الذي عثرت عليه.'
                : type === 'lost' ? 'Your lost-item report has been recorded.' : 'Your found-item report has been recorded.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary"
            >
              {t.close}
            </button>
          </div>
        ) : (
        <form noValidate onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="lost-found-title" className="block text-xs font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'اسم العنصر / المفقود' : 'Item Name & Model'}
            </label>
            <input
            id="lost-found-title"
            type="text"
            required
            aria-invalid={Boolean(validationError && !title.trim())}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setValidationError('');
              }}
              placeholder={
                lang === 'ar'
                  ? 'مثال: جهاز آيباد رمادي بغطاء أزرق'
                  : 'e.g. Space Gray iPad Air with Blue Cover'
              }
              aria-label={lang === 'ar' ? 'اسم العنصر' : 'Item name'}
              dir="auto"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs border border-outline-variant/40 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="lost-found-category" className="block text-xs font-bold text-on-surface mb-1">
                {t.categoryLabel}
              </label>
              <select
                id="lost-found-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-outline-variant/40 focus:border-primary focus:outline-none"
              >
                <option value="Electronics & Gadgets">{lang === 'ar' ? 'أجهزة إلكترونية' : 'Electronics & Gadgets'}</option>
                <option value="IDs, Badges & Wallets">{lang === 'ar' ? 'بطاقات ومحافظ' : 'IDs, Badges & Wallets'}</option>
                <option value="Books, Notes & Binders">{lang === 'ar' ? 'كتب ودفاتر' : 'Books, Notes & Binders'}</option>
                <option value="Personal Accessories & Watches">{lang === 'ar' ? 'إكسسوارات وساعات' : 'Personal Accessories & Watches'}</option>
                <option value="Keys & FOBs">{lang === 'ar' ? 'مفاتيح' : 'Keys & FOBs'}</option>
                <option value="Bags & Backpacks">{lang === 'ar' ? 'حقائب وشنط ظهر' : 'Bags & Backpacks'}</option>
              </select>
            </div>

            <div>
              <label htmlFor="lost-found-location" className="block text-xs font-bold text-on-surface mb-1">
                {lang === 'ar' ? 'الموقع والمبنى' : 'Building Location'}
              </label>
              <select
                id="lost-found-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-outline-variant/40 focus:border-primary focus:outline-none"
              >
                <option value="Main University Library">{lang === 'ar' ? 'المكتبة المركزية' : 'Main University Library'}</option>
                <option value="Engineering Hall & Labs">{lang === 'ar' ? 'مبنى الهندسة والمختبرات' : 'Engineering Hall & Labs'}</option>
                <option value="Student Union & Dining Hall">{lang === 'ar' ? 'اتحاد الطلاب والمطعم' : 'Student Union & Dining Hall'}</option>
                <option value="Sports Complex & Arena">{lang === 'ar' ? 'المجمع والصالة الرياضية' : 'Sports Complex & Arena'}</option>
                <option value="Health Sciences Center">{lang === 'ar' ? 'مركز العلوم الصحية' : 'Health Sciences Center'}</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="lost-found-description" className="block text-xs font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'الوصف والعلامات الظاهرة' : 'Description & Visible Attributes'}
            </label>
            <textarea
              id="lost-found-description"
              required
              aria-invalid={Boolean(validationError && !description.trim())}
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setValidationError('');
              }}
              placeholder={
                lang === 'ar'
                  ? 'اذكر اللون أو النوع أو العلامات الظاهرة، ومتى وأين فُقد أو عُثر عليه.'
                  : 'Describe its color, type, visible features, and when and where it was lost or found.'
              }
              dir="auto"
              className="w-full p-3 rounded-xl bg-surface-container-low text-xs border border-outline-variant/40 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="lost-found-image-url" className="block text-xs font-bold text-on-surface mb-1">
              {lang === 'ar' ? 'رابط الصورة (اختياري)' : 'Image URL (optional)'}
            </label>
            <input
              id="lost-found-image-url"
              type="url"
              placeholder="https://"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              dir="ltr"
              aria-label={lang === 'ar' ? 'رابط صورة العنصر' : 'Item image URL'}
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs border border-outline-variant/40 focus:border-primary focus:outline-none"
            />
          </div>

          {validationError && (
            <p className="text-xs font-semibold text-error" role="alert">
              {validationError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting
                ? lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'
                : lang === 'ar' ? 'تسجيل العنصر' : 'Register Item'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
