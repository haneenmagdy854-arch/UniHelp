import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export type BadgeStatusType =
  | 'pending'
  | 'dispatched'
  | 'in_progress'
  | 'awaiting_parts'
  | 'resolved'
  | 'reported_lost'
  | 'safe_with_security'
  | 'claim_pending'
  | 'returned'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'urgent';

interface StatusBadgeProps {
  status: BadgeStatusType | string;
  customLabel?: string;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customLabel,
  className = '',
  showDot = true
}) => {
  const { lang, t } = useLanguage();

  const getBadgeConfig = () => {
    switch (status) {
      case 'pending':
      case 'pending_dispatch':
        return {
          bg: 'bg-[#FDF5D9]',
          text: 'text-[#8C630D]',
          border: 'border-[#F5D98E]',
          dot: 'bg-[#C28A13]',
          labelEn: 'Pending Dispatch',
          labelAr: 'بانتظار التوجيه'
        };
      case 'dispatched':
        return {
          bg: 'bg-primary-fixed/40',
          text: 'text-on-primary-fixed-variant',
          border: 'border-primary-fixed',
          dot: 'bg-primary',
          labelEn: 'Dispatched',
          labelAr: 'تم التوجيه'
        };
      case 'in_progress':
        return {
          bg: 'bg-[#EDF7F2]',
          text: 'text-[#354B3E]',
          border: 'border-[#A8DCC5]',
          dot: 'bg-[#527C68] animate-pulse',
          labelEn: 'In Progress',
          labelAr: 'قيد الصيانة'
        };
      case 'awaiting_parts':
        return {
          bg: 'bg-surface-container-highest',
          text: 'text-on-surface-variant',
          border: 'border-outline-variant',
          dot: 'bg-outline',
          labelEn: 'Awaiting Parts',
          labelAr: 'بانتظار قطع الغيار'
        };
      case 'resolved':
      case 'approved':
        return {
          bg: 'bg-[#E6F4EA]',
          text: 'text-[#1E5E3A]',
          border: 'border-[#A3D9B1]',
          dot: 'bg-[#1E5E3A]',
          labelEn: 'Resolved',
          labelAr: 'تم الإصلاح'
        };
      case 'safe_with_security':
        return {
          bg: 'bg-primary',
          text: 'text-on-primary',
          border: 'border-transparent',
          dot: 'bg-white',
          labelEn: 'Safe with Security',
          labelAr: 'في حوزة الأمن'
        };
      case 'reported_lost':
        return {
          bg: 'bg-secondary',
          text: 'text-on-secondary',
          border: 'border-transparent',
          dot: 'bg-white',
          labelEn: 'Reported Lost',
          labelAr: 'مفقود مسجل'
        };
      case 'claim_pending':
      case 'pending_review':
        return {
          bg: 'bg-surface-container-highest',
          text: 'text-on-surface',
          border: 'border-outline-variant',
          dot: 'bg-amber-500',
          labelEn: 'Claim Pending',
          labelAr: 'مطالبة قيد المراجعة'
        };
      case 'returned':
        return {
          bg: 'bg-[#E0F2F1]',
          text: 'text-[#004D40]',
          border: 'border-[#80CBC4]',
          dot: 'bg-[#004D40]',
          labelEn: 'Returned / Reclaimed',
          labelAr: 'تم الاسترداد للمالك'
        };
      case 'rejected':
      case 'urgent':
        return {
          bg: 'bg-[#FBEEE8]',
          text: 'text-[#8E3618]',
          border: 'border-[#D98C70]',
          dot: 'bg-[#D98C70]',
          labelEn: 'Urgent Priority',
          labelAr: 'أولوية قصوى'
        };
      default:
        return {
          bg: 'bg-surface-container',
          text: 'text-on-surface-variant',
          border: 'border-outline-variant',
          dot: 'bg-outline',
          labelEn: status,
          labelAr: status
        };
    }
  };

  const config = getBadgeConfig();
  const label = customLabel || (lang === 'ar' ? config.labelAr : config.labelEn);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {showDot && (
        <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      )}
      <span className="truncate">{label}</span>
    </span>
  );
};

