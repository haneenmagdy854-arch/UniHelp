import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const HelpCenterPage: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-outline-variant/30 space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-secondary-fixed text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[24px]">support</span>
          </span>
          <h1 className="text-2xl font-bold text-on-surface">{t.helpCenter}</h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
          {lang === 'ar'
            ? 'دليل استجابة الطوارئ، بروتوكولات الحفظ الآمن للمفقودات، ومعايير أوقات إصلاح الأعطال الجامعية.'
            : 'Emergency dispatch protocols, custodial lost & found procedures, and campus facility SLAs.'}
        </p>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Protocol 1 */}
        <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-[22px]">engineering</span>
            <span>{lang === 'ar' ? 'تصنيف أولويات الصيانة' : 'Maintenance Triage & SLA'}</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {lang === 'ar'
              ? 'في الأعطال الحرجة، مثل تسرب المياه أو انقطاع الكهرباء أو تعطل المعامل، نوجّه الفني خلال 45 دقيقة. وتُعالج الأعطال العادية خلال 24 ساعة.'
              : 'Urgent hazard tickets (water leaks, AC blackout in lecture halls, lab disruptions) are dispatched within 45 minutes. Standard repair items are cleared within 24 hours.'}
          </p>
          <div className="p-3 rounded-2xl bg-surface-container-lowest text-xs space-y-1">
            <span className="font-bold text-on-surface block">
              {lang === 'ar' ? 'رقم الطوارئ:' : 'Dispatch Hotline:'}
            </span>
            <span className="text-primary font-bold text-sm">
              {lang === 'ar' ? 'تحويلة 4444 (على مدار الساعة)' : 'Ext: 4444 (24/7 Operations)'}
            </span>
          </div>
        </div>

        {/* Protocol 2 */}
        <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2 text-secondary font-bold text-sm">
            <span className="material-symbols-outlined text-[22px]">security</span>
            <span>{lang === 'ar' ? 'إجراءات استلام المفقودات' : 'Lost & Found Custody Rules'}</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {lang === 'ar'
              ? 'يجب إبراز البطاقة الجامعية المطابقة عند الاستلام. في حالة الأجهزة الإلكترونية الذكية، يلزم تقديم علامة سرية (رمز القفل، الرقم التسلسلي، صورة شاشة القفل).'
              : 'Proof of university identity required upon retrieval. For electronic devices, claimants must submit secret verifying traits (unlock passcode, serial number, lock screen photo).'}
          </p>
          <div className="p-3 rounded-2xl bg-surface-container-lowest text-xs space-y-1">
            <span className="font-bold text-on-surface block">
              {lang === 'ar' ? 'ساعات عمل المكتب المركزي:' : 'Central Desk Hours:'}
            </span>
            <span className="text-on-surface font-medium">
              {lang === 'ar' ? 'من الاثنين إلى الجمعة: 8 صباحًا – 8 مساءً' : 'Monday – Friday: 08:00 AM – 08:00 PM'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
