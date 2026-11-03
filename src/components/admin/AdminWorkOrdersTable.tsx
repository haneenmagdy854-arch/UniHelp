import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { MaintenanceReport } from '../../types';

interface AdminWorkOrdersTableProps {
  onSelectReport?: (report: MaintenanceReport) => void;
}

export const AdminWorkOrdersTable: React.FC<AdminWorkOrdersTableProps> = ({ onSelectReport }) => {
  const { lang, t } = useLanguage();
  const { reports, updateReportStatus, assignTechnician } = useData();

  const [activeTab, setActiveTab] = useState<'work_orders' | 'claims' | 'users'>('work_orders');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const technicians = Array.from(new Set(
    reports
      .map((report) => report.technicianName)
      .filter((name): name is string => Boolean(name))
  ));

  const filteredReports = reports.filter((r) => {
    const q = filterText.toLowerCase();
    return (
      r.ticketNumber.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q) ||
      r.room.toLowerCase().includes(q) ||
      (r.technicianName && r.technicianName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
      {/* Header and Nav Tabs */}
      <div className="p-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-2xl w-fit flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('work_orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'work_orders'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.workOrdersTab} ({filteredReports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'claims'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>{t.pendingClaimsTab}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
              7 Action
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.userDirectoryTab}
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
            <span className="material-symbols-outlined text-outline text-[16px] mr-2">filter_alt</span>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={lang === 'ar' ? 'تصفية حسب الرمز أو الغرفة أو الفني...' : 'Filter orders by ID, room, or tech...'}
              className="bg-transparent border-none text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none w-48 sm:w-60"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterText('')}
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container text-[11px] font-bold text-on-surface uppercase tracking-wider border-y border-outline-variant/30">
            <tr>
              <th className="py-3 px-6">{lang === 'ar' ? 'رمز البلاغ والتاريخ' : 'Ticket ID & Date'}</th>
              <th className="py-3 px-6">{lang === 'ar' ? 'المشكلة والتصنيف' : 'Issue & Category'}</th>
              <th className="py-3 px-6">{lang === 'ar' ? 'الموقع' : 'Location'}</th>
              <th className="py-3 px-6">{lang === 'ar' ? 'صاحب البلاغ' : 'Reporter Role'}</th>
              <th className="py-3 px-6">{lang === 'ar' ? 'الفني المعين' : 'Technician'}</th>
              <th className="py-3 px-6">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th className="py-3 px-6 text-right">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredReports.map((report, idx) => (
              <tr
                key={report.id}
                className={`hover:bg-surface-container-low transition-colors ${
                  idx % 2 === 1 ? 'bg-surface-container-low/30' : ''
                }`}
              >
                {/* ID & Date */}
                <td className="py-3.5 px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{report.ticketNumber}</span>
                    <span className="text-outline text-[11px]">{report.createdAt.split('T')[0]}</span>
                  </div>
                </td>

                {/* Issue & Category */}
                <td className="py-3.5 px-6 max-w-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface truncate">{report.title}</span>
                    <span className="text-on-surface-variant text-[11px] capitalize">{report.category}</span>
                  </div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline text-[16px]">location_on</span>
                    <span className="truncate max-w-[180px]">
                      {report.building}, {report.room}
                    </span>
                  </div>
                </td>

                {/* Reporter */}
                <td className="py-3.5 px-6">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold whitespace-nowrap">
                    {report.reporterName} ({report.reporterRole})
                  </span>
                </td>

                {/* Technician select */}
                <td className="py-3.5 px-6">
                  <select
                    value={report.technicianName || ''}
                    onChange={(e) => void assignTechnician(report.id, e.target.value).catch(() => undefined)}
                    className="text-[11px] font-medium bg-surface-container-low px-2 py-1 rounded-lg text-on-surface border border-outline-variant/40 focus:outline-none"
                  >
                    <option value="">{lang === 'ar' ? 'غير معين' : 'Unassigned'}</option>
                    {technicians.map((tName) => (
                      <option key={tName} value={tName}>
                        {tName}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Status */}
                <td className="py-3.5 px-6">
                  <StatusBadge status={report.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-6 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectReport && onSelectReport(report)}
                      className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface"
                      title="Review Details"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateReportStatus(report.id, 'resolved', 'Resolved by admin console').catch(() => undefined)}
                      className="p-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container"
                      title="Mark Resolved"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateReportStatus(report.id, 'in_progress', 'Priority escalated to high queue').catch(() => undefined)}
                      className="p-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error"
                      title="Escalate Priority"
                    >
                      <span className="material-symbols-outlined text-[16px]">north_east</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-low border-t border-outline-variant/30 text-xs">
        <span className="text-on-surface-variant">
          {lang === 'ar'
            ? `عرض 1 إلى ${filteredReports.length} من إجمالي ${filteredReports.length} أمر عمل نشط`
            : `Showing 1 to ${filteredReports.length} of ${filteredReports.length} Active Orders`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-semibold disabled:opacity-50 border border-outline-variant/30"
          >
            {lang === 'ar' ? 'السابق' : 'Previous'}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-sm"
          >
            1
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-semibold border border-outline-variant/30"
          >
            2
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-semibold border border-outline-variant/30"
          >
            {lang === 'ar' ? 'التالي' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
