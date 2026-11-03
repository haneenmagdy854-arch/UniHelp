import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { ClaimRequest } from '../../types';

interface ClaimVerificationDrawerProps {
  claim: ClaimRequest | null;
  onClose?: () => void;
}

export const ClaimVerificationDrawer: React.FC<ClaimVerificationDrawerProps> = ({
  claim,
  onClose
}) => {
  const { lang, t } = useLanguage();
  const { claims, reviewClaim } = useData();

  // Pick first pending claim if none selected
  const activeClaim = claim || claims.find((c) => c.status === 'pending_review') || claims[0];
  const [auditNote, setAuditNote] = useState(
    activeClaim?.adminVerificationNote ||
      'Student ID checked in person by Desk Officer; passcode test validated on unit screen.'
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!activeClaim) return null;

  const handleAction = async (actionStatus: 'approved' | 'rejected' | 'additional_proof_requested') => {
    try {
      await reviewClaim(activeClaim.id, actionStatus, auditNote);
    } catch (error) {
      setFeedback(
        `${lang === 'ar' ? 'تعذر تحديث الطلب:' : 'Could not update the claim:'} ${error instanceof Error ? error.message : ''}`
      );
      return;
    }
    if (actionStatus === 'approved') {
      setFeedback(lang === 'ar' ? 'تم اعتماد تسليم العنصر بنجاح وتوثيق الهوية!' : 'Claim approved & item release logged in audit registry!');
    } else if (actionStatus === 'rejected') {
      setFeedback(lang === 'ar' ? 'تم رفض المطالبة وإشعار مقدم الطلب.' : 'Claim rejected and claimant notified.');
    } else {
      setFeedback(lang === 'ar' ? 'تم طلب إثباتات إضافية من مقدم الطلب.' : 'Additional ownership proof requested from claimant.');
    }

    setTimeout(() => {
      setFeedback(null);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30 space-y-5">
      {/* Drawer Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </span>
          <div>
            <h3 className="font-bold text-lg text-on-surface">
              {lang === 'ar' ? 'نافذة التحقق ومطابقة الملكية عالية الأولوية' : 'High-Priority Claim Verification Drawer'}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {lang === 'ar' ? 'إجراءات التدقيق والتحقق من هوية مستلم المفقودات' : 'Lost & Found Item Match ID Verification Process'}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
          {lang === 'ar' ? `طابور الإجراء: ${activeClaim.itemTag}` : `Action Queue: Item ${activeClaim.itemTag}`}
        </span>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-[#E6F4EA] border border-[#A3D9B1] text-[#1E5E3A] text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Target Item Card */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-44 h-36 rounded-xl overflow-hidden bg-surface-container shrink-0">
          <img
            src={activeClaim.itemImageUrl}
            alt={activeClaim.itemTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-sm text-on-surface">{activeClaim.itemTitle}</h4>
            <span className="text-[11px] text-tertiary bg-tertiary-fixed px-2.5 py-0.5 rounded-full font-bold">
              {lang === 'ar' ? 'تطابق الرقم التسلسلي' : 'Matched Serial Hash'}
            </span>
          </div>

          {/* Confidential Private Identifying Features */}
          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface-variant space-y-1">
            <div className="flex items-center gap-1.5 text-secondary font-bold text-[11px]">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>{lang === 'ar' ? 'العلامات السرية المقدمة من الطالب (مشفرة):' : 'Private Traits Provided by Claimant:'}</span>
            </div>
            <p className="italic text-on-surface font-medium">"{activeClaim.privateDescription}"</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
              <span className="text-outline text-[11px] block">{lang === 'ar' ? 'الطالب المطالب:' : 'Claimant Student:'}</span>
              <span className="text-on-surface font-bold">
                {activeClaim.claimantName} ({activeClaim.claimantStudentId})
              </span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
              <span className="text-outline text-[11px] block">{lang === 'ar' ? 'الكلية / البرنامج:' : 'Department / Program:'}</span>
              <span className="text-on-surface font-bold truncate block">
                {activeClaim.claimantDepartment}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Verification Audit Note Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-on-surface block">
          {lang === 'ar' ? 'ملاحظة التدقيق والتحقق الإداري' : 'Admin Verification & Identity Audit Note'}
        </label>
        <input
          type="text"
          value={auditNote}
          onChange={(e) => setAuditNote(e.target.value)}
          className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/40 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-end flex-wrap gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => handleAction('additional_proof_requested')}
          className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high transition-colors"
        >
          {t.requestAdditionalProof}
        </button>
        <button
          type="button"
          onClick={() => handleAction('rejected')}
          className="px-4 py-2.5 rounded-xl bg-error-container text-on-error-container text-xs font-semibold hover:bg-error hover:text-on-error transition-colors"
        >
          {t.rejectClaim}
        </button>
        <button
          type="button"
          onClick={() => handleAction('approved')}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-tertiary shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{t.approveClaim}</span>
        </button>
      </div>
    </div>
  );
};
