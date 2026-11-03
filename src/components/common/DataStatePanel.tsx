import React from 'react';
import { ResourceState } from '../../contexts/DataContext';
import { Language } from '../../translations';

interface DataStatePanelProps {
  state: ResourceState;
  lang: Language;
  onRetry: () => void;
  empty?: boolean;
  emptyMessage?: string;
}

export const DataStatePanel: React.FC<DataStatePanelProps> = ({
  state,
  lang,
  onRetry,
  empty = false,
  emptyMessage
}) => {
  if (state.status === 'success' && !empty) return null;

  const isArabic = lang === 'ar';
  const title = state.status === 'loading'
    ? isArabic ? 'جارٍ تحميل البيانات...' : 'Loading data...'
    : state.status === 'error'
      ? isArabic ? 'تعذر تحميل البيانات' : 'Unable to load data'
      : isArabic ? 'لا توجد بيانات حتى الآن' : 'No records yet';

  return (
    <div
      className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center"
      role={state.status === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {state.status === 'loading' && (
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]" aria-hidden="true">
          progress_activity
        </span>
      )}
      {state.status === 'error' && (
        <span className="material-symbols-outlined text-error text-[32px]" aria-hidden="true">
          error
        </span>
      )}
      {state.status === 'success' && empty && (
        <span className="material-symbols-outlined text-outline text-[32px]" aria-hidden="true">
          inbox
        </span>
      )}
      <p className="mt-2 font-bold text-sm text-on-surface">
        {state.status === 'success' && empty ? emptyMessage : title}
      </p>
      {state.status === 'error' && (
        <>
          <p className="mt-1 text-xs text-on-surface-variant">
            {isArabic ? 'تحقق من اتصال قاعدة البيانات وإعدادات Supabase، ثم حاول مرة أخرى.' : 'Check the Supabase connection and configuration, then try again.'}
          </p>
          {state.error && <p className="mt-2 break-words text-xs text-error">{state.error}</p>}
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-tertiary"
          >
            {isArabic ? 'إعادة المحاولة' : 'Try again'}
          </button>
        </>
      )}
    </div>
  );
};
