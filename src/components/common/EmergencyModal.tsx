import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 shadow-2xl z-10 border border-outline-variant/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-error-container text-on-error-container">
              <span className="material-symbols-outlined text-[28px]">emergency</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {lang === 'ar' ? 'طوارئ الحرم الجامعي والدعم السريع' : 'Campus Emergency & Urgent Dispatch'}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {lang === 'ar' ? 'مركز عمليات الحرم الجامعي متاح على مدار 24/7' : 'Campus Operations Hub — Manned 24/7'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#FBEEE8] border border-[#D98C70]/40 flex items-center justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-[#8E3618] uppercase tracking-wider block font-bold">
                {lang === 'ar' ? 'الخط الساخن المباشر' : 'Immediate Operations Hotline'}
              </span>
              <span className="font-display-lg text-display-lg text-[#8E3618] font-bold">
                Ext: 4444
              </span>
              <p className="font-body-sm text-body-sm text-[#8E3618]/80">
                +966 11 800 4444 (Direct Landline)
              </p>
            </div>
            <a
              href="tel:4444"
              className="px-5 py-3 rounded-xl bg-error text-on-error font-bold shadow-md hover:bg-error/90 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>{lang === 'ar' ? 'اتصال الآن' : 'Call Dispatch'}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[18px]">local_police</span>
                <span>{lang === 'ar' ? 'الأمن والحراسات' : 'Campus Security'}</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {lang === 'ar' ? 'برج الإدارة، الدور الأرضي، النافذة 3' : 'Admin Tower, Ground Floor, Window 3'}
              </p>
              <span className="font-label-sm text-xs font-semibold text-primary block mt-1">Ext: 4410</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40">
              <div className="flex items-center gap-2 text-secondary font-bold mb-1">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                <span>{lang === 'ar' ? 'العيادة الطبية' : 'Health Clinic'}</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                {lang === 'ar' ? 'مركز الرعاية الأولية، مبنى 7' : 'Primary Care Center, Building 7'}
              </p>
              <span className="font-label-sm text-xs font-semibold text-secondary block mt-1">Ext: 4422</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container text-body-sm text-xs text-on-surface-variant space-y-1">
            <strong className="text-on-surface block font-semibold">
              {lang === 'ar' ? 'بروتوكول السلامة للإخلاء والأعطال الجسيمة:' : 'Safety Protocol for Critical Facility Hazards:'}
            </strong>
            <p>
              {lang === 'ar'
                ? 'في حالات انقطاع التيار الكهربائي الشامل، أو تسريب الغاز، أو احتجاز المصاعد، اتصل فورًا بالخط 4444 وابق بعيدًا عن اللوحات الكهربائية.'
                : 'In events of power blackout, gas odor, severe water flooding, or elevator entrapment, dial Ext 4444 immediately and maintain safe distance from panels.'}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors text-sm"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

