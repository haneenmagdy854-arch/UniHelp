import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LostFoundItem } from '../../types';

interface ClaimModalProps {
  item: LostFoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { submitClaim } = useData();

  const [privateDescription, setPrivateDescription] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'central' | 'department'>('central');
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPrivateDescription('');
      setValidationError('');
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateDescription.trim()) {
      setValidationError(
        lang === 'ar'
          ? 'اذكر علامة سرية واحدة على الأقل لإثبات ملكيتك للعنصر.'
          : 'Enter at least one private detail to verify ownership.'
      );
      return;
    }

    setIsSubmitting(true);
    setValidationError('');
    try {
      await submitClaim({
        itemId: item.id,
        claimantId: user?.id || 'user-current',
        claimantName: user?.name || 'Haneen Magdy',
        claimantStudentId: user?.studentId || 'ST-94821',
        claimantDepartment: user?.department || 'College of Engineering & Computer Science',
        claimantPhone: user?.phone || '+966 50 123 4567',
        privateDescription,
        proofDocumentUrl: proofFile || undefined,
        pickupMethod
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSubmitted(false);
        setPrivateDescription('');
        onClose();
      }, 1600);
    } catch (error) {
      setValidationError(
        `${lang === 'ar' ? 'تعذر إرسال الطلب:' : 'Could not submit the claim:'} ${error instanceof Error ? error.message : ''}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-outline-variant/30 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-5 bg-surface-container-low flex items-start justify-between border-b border-outline-variant/30">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">security</span>
                <span>
                  {lang === 'ar' ? 'التحقق من الهوية لدى أمن الجامعة' : 'Campus Security ID Verification'}
                </span>
              </div>
              <h2 id="claim-modal-title" className="font-bold text-xl text-on-surface">
                {t.secureClaimTitle}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {lang === 'ar' ? 'العنصر:' : 'Target item:'}{' '}
                <strong className="text-on-surface font-semibold">
                  {lang === 'ar' ? item.titleAr || item.title : item.title}
                </strong>{' '}
                <span className="text-outline">({item.tagNumber})</span>
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label={t.close}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          {submitted ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#E6F4EA] text-[#1E5E3A] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface">
                {lang === 'ar' ? 'تم تقديم طلب الاسترداد بنجاح!' : 'Claim Request Submitted!'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-md">
                {lang === 'ar'
                  ? 'أُرسل طلبك إلى فريق الأمن الجامعي للتحقق من ملكيتك للعنصر قبل تسليمه.'
                  : 'Your confidential ownership details have been queued for Campus Security administrative verification. You will receive an alert once authorized.'}
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-6">
              {/* Fraud Prevention Security Notice */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5">
                  verified_user
                </span>
                <div className="text-xs text-on-surface-variant space-y-1">
                  <strong className="text-on-surface block font-bold">
                    {lang === 'ar' ? 'ضمان إثبات الملكية ومنع الاحتيال' : 'Ownership Proof Guarantee'}
                  </strong>
                  <p>
                    {lang === 'ar'
                      ? 'لمنع أي استلام غير مصرح به، يرجى كتابة علامات سرية غير ظاهرة في الصور العامة (مثل: صورة شاشة القفل، الرقم التسلسلي، خدش مميز، ملصقات خلف الغطاء).'
                      : 'To prevent unauthorized or fraudulent pickups, provide identifying marks not visible in public photos (e.g. lock screen wallpaper image, device serial number, custom engraving, interior case stickers, or matching unlock code format).'}
                  </p>
                </div>
              </div>

              {/* Input 1: Private Identifying Features */}
              <div className="space-y-1.5">
                <label htmlFor="claim-private-description" className="block text-xs font-bold text-on-surface">
                  {t.privateFeaturesLabel} <span className="text-error">*</span>
                </label>
                <textarea
                  id="claim-private-description"
                  required
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? 'claim-validation-error' : undefined}
                  rows={4}
                  value={privateDescription}
                  onChange={(e) => {
                    setPrivateDescription(e.target.value);
                    setValidationError('');
                  }}
                  placeholder={t.privateFeaturesPlaceholder}
                  dir="auto"
                  className="w-full bg-surface text-on-surface placeholder:text-on-surface-variant/60 text-xs p-3.5 rounded-xl shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
                <span className="text-[11px] text-on-surface-variant block">
                  {t.privateFeaturesHint}
                </span>
                {validationError && (
                  <p id="claim-validation-error" className="text-xs font-semibold text-error" role="alert">
                    {validationError}
                  </p>
                )}
              </div>

              {/* Input 2: Proof of Ownership Upload */}
              <div className="space-y-1.5">
                <label htmlFor="claim-proof-document" className="block text-xs font-bold text-on-surface">
                  {t.proofUploadLabel}
                </label>
                <label className="p-5 rounded-2xl bg-surface-container-low border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors group">
                  <input
                    id="claim-proof-document"
                    type="file"
                    accept="image/*,application/pdf"
                    aria-label={t.proofUploadLabel}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setProofFile(e.target.files[0].name);
                      }
                    }}
                  />
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary mb-2 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
                  </div>
                  <span className="text-xs font-semibold text-on-surface">
                    {proofFile ? `Uploaded: ${proofFile}` : t.proofUploadPlaceholder}
                  </span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5">
                    PNG, JPG, or PDF up to 10MB
                  </span>
                </label>
              </div>

              {/* Input 3: Preferred Reclaim Method */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface">
                  {t.pickupMethodLabel} <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer border transition-all ${
                      pickupMethod === 'central'
                        ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pickupMethod"
                      value="central"
                      checked={pickupMethod === 'central'}
                      onChange={() => setPickupMethod('central')}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-on-surface block">
                        {t.centralDeskPickup}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {t.centralDeskDesc}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl cursor-pointer border transition-all ${
                      pickupMethod === 'department'
                        ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pickupMethod"
                      value="department"
                      checked={pickupMethod === 'department'}
                      onChange={() => setPickupMethod('department')}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-bold text-on-surface block">
                        {t.deanPickup}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">
                        {t.deanPickupDesc}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Student Contact Verification */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface">
                  {lang === 'ar' ? 'بيانات هوية مقدم الطلب' : 'Campus Student ID & Contact Verification'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${user?.name || 'Haneen Magdy'} (${user?.studentId || 'ST-94821'})`}
                    className="w-full bg-surface-container-low text-on-surface-variant text-xs font-semibold px-3 py-2.5 rounded-xl border border-outline-variant/30 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    readOnly
                    value={user?.phone || '+966 50 123 4567'}
                    className="w-full bg-surface-container-low text-on-surface-variant text-xs font-semibold px-3 py-2.5 rounded-xl border border-outline-variant/30 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-auto pt-4 flex items-center justify-end gap-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : t.submitClaimBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
