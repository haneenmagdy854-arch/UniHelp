import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityFeedItem,
  ClaimRequest,
  ClaimStatus,
  LostFoundItem,
  MaintenanceCategory,
  MaintenanceReport,
  MaintenanceStatus,
  NotificationItem,
  PriorityLevel,
  UserRole
} from '../types';
import { isSupabaseConfigured, supabase } from '../services/supabase';

export interface ResourceState {
  status: 'loading' | 'error' | 'success';
  error?: string;
}

interface DataContextType {
  reports: MaintenanceReport[];
  reportsState: ResourceState;
  lostFoundItems: LostFoundItem[];
  lostFoundState: ResourceState;
  claims: ClaimRequest[];
  claimsState: ResourceState;
  notifications: NotificationItem[];
  notificationsState: ResourceState;
  activityFeed: ActivityFeedItem[];
  refreshReports: () => Promise<void>;
  refreshLostFound: () => Promise<void>;
  refreshClaims: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  addReport: (report: {
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    category: MaintenanceCategory;
    priority: PriorityLevel;
    building: string;
    buildingAr?: string;
    floor: string;
    floorAr?: string;
    room: string;
    roomAr?: string;
    assetBarcode?: string;
    imageUrl?: string;
    reporterId: string;
    reporterName: string;
    reporterRole: UserRole;
  }) => Promise<MaintenanceReport>;
  updateReportStatus: (id: string, status: MaintenanceStatus, techNote?: string, progress?: number) => Promise<void>;
  assignTechnician: (reportId: string, technicianName: string) => Promise<void>;
  addLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'tagNumber' | 'reportedAt'>) => Promise<LostFoundItem>;
  submitClaim: (claim: {
    itemId: string;
    claimantId: string;
    claimantName: string;
    claimantStudentId: string;
    claimantDepartment: string;
    claimantPhone: string;
    privateDescription: string;
    proofDocumentUrl?: string;
    pickupMethod: 'central' | 'department';
  }) => Promise<void>;
  reviewClaim: (claimId: string, status: ClaimStatus, adminNote?: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

type ReportRow = {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  building: string;
  floor: string;
  room: string;
  asset_barcode: string | null;
  image_url: string | null;
  status: string;
  progress_percent: number | null;
  reporter_id: string | null;
  reporter_name: string;
  reporter_role: string;
  technician_name: string | null;
  technician_status: string | null;
  technician_note: string | null;
  technician_note_ar: string | null;
  estimated_resolution: string | null;
  created_at: string;
  updated_at: string;
};

type LostFoundRow = {
  id: string;
  tag_number: string;
  title: string;
  title_ar: string | null;
  description: string;
  description_ar: string | null;
  type: string;
  category: string;
  location: string;
  location_ar: string | null;
  image_url: string | null;
  status: string;
  reported_by: string | null;
  reported_by_name: string;
  holding_location: string | null;
  private_notes: string | null;
  created_at: string;
};

type ClaimRow = {
  id: string;
  item_id: string | null;
  item_title: string;
  item_tag: string;
  claimant_id: string | null;
  claimant_name: string;
  claimant_student_id: string;
  claimant_department: string;
  claimant_phone: string;
  private_description: string;
  proof_document_url: string | null;
  pickup_method: string;
  status: string;
  admin_verification_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  item?: { title: string; title_ar: string | null; image_url: string | null } | null;
};

type NotificationRow = {
  id: string;
  title: string;
  title_ar: string;
  message: string;
  message_ar: string;
  category: string;
  read: boolean | null;
  link: string | null;
  created_at: string;
};

const initialState: ResourceState = { status: 'loading' };
const configurationError = 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project .env file.';

const isUuid = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected database error occurred.';

const reportProgress: Record<MaintenanceStatus, number> = {
  pending: 15,
  dispatched: 35,
  in_progress: 65,
  awaiting_parts: 45,
  resolved: 100
};

const mapReport = (row: ReportRow): MaintenanceReport => {
  const status = row.status as MaintenanceStatus;
  const submittedAt = new Date(row.created_at).toLocaleString();
  const updatedAt = new Date(row.updated_at).toLocaleString();
  const dispatched = status !== 'pending';
  const inProgress = status === 'in_progress' || status === 'awaiting_parts' || status === 'resolved';
  const resolved = status === 'resolved';

  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    title: row.title,
    description: row.description,
    category: row.category as MaintenanceCategory,
    priority: row.priority as PriorityLevel,
    building: row.building,
    floor: row.floor,
    room: row.room,
    assetBarcode: row.asset_barcode || undefined,
    imageUrl: row.image_url || undefined,
    status,
    progressPercent: row.progress_percent ?? reportProgress[status],
    reporterId: row.reporter_id || '',
    reporterName: row.reporter_name,
    reporterRole: row.reporter_role as UserRole,
    technicianName: row.technician_name || undefined,
    technicianStatus: row.technician_status || undefined,
    technicianNote: row.technician_note || undefined,
    technicianNoteAr: row.technician_note_ar || undefined,
    estimatedResolution: row.estimated_resolution || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    timeline: [
      { title: 'Ticket Submitted', titleAr: 'تم استلام البلاغ', timestamp: submittedAt, completed: true },
      { title: 'Technician Dispatched', titleAr: 'تم توجيه الفني', timestamp: dispatched ? updatedAt : '', completed: dispatched },
      { title: 'In Progress', titleAr: 'قيد التنفيذ', timestamp: inProgress ? updatedAt : '', completed: inProgress },
      { title: 'Resolved', titleAr: 'تم الحل', timestamp: resolved ? updatedAt : '', completed: resolved }
    ]
  };
};

const mapLostFoundItem = (row: LostFoundRow): LostFoundItem => ({
  id: row.id,
  tagNumber: row.tag_number,
  title: row.title,
  titleAr: row.title_ar || undefined,
  description: row.description,
  descriptionAr: row.description_ar || undefined,
  type: row.type as LostFoundItem['type'],
  category: row.category,
  location: row.location,
  locationAr: row.location_ar || undefined,
  imageUrl: row.image_url || '',
  status: row.status as LostFoundItem['status'],
  reportedBy: row.reported_by || '',
  reportedByName: row.reported_by_name,
  reportedAt: row.created_at,
  holdingLocation: row.holding_location || undefined,
  privateNotes: row.private_notes || undefined
});

const mapClaim = (row: ClaimRow): ClaimRequest => ({
  id: row.id,
  itemId: row.item_id || '',
  itemTitle: row.item?.title_ar || row.item?.title || row.item_title,
  itemTag: row.item_tag,
  itemImageUrl: row.item?.image_url || '',
  claimantId: row.claimant_id || '',
  claimantName: row.claimant_name,
  claimantStudentId: row.claimant_student_id,
  claimantDepartment: row.claimant_department,
  claimantPhone: row.claimant_phone,
  privateDescription: row.private_description,
  proofDocumentUrl: row.proof_document_url || undefined,
  pickupMethod: row.pickup_method as ClaimRequest['pickupMethod'],
  status: row.status as ClaimStatus,
  adminVerificationNote: row.admin_verification_note || undefined,
  submittedAt: row.submitted_at,
  reviewedAt: row.reviewed_at || undefined,
  reviewedBy: row.reviewed_by || undefined
});

const mapNotification = (row: NotificationRow): NotificationItem => ({
  id: row.id,
  title: row.title,
  titleAr: row.title_ar,
  message: row.message,
  messageAr: row.message_ar,
  timeAgo: row.created_at,
  category: row.category as NotificationItem['category'],
  read: row.read ?? false,
  link: row.link || undefined
});

const createActivityFeed = (
  reports: MaintenanceReport[],
  items: LostFoundItem[]
): ActivityFeedItem[] => [
  ...reports.map((report) => ({
    id: `report-${report.id}`,
    actor: report.reporterName,
    action: `Submitted maintenance report ${report.ticketNumber}`,
    actionAr: `تم تسجيل بلاغ الصيانة ${report.ticketNumber}`,
    detail: report.title,
    detailAr: report.title,
    timeAgo: report.createdAt,
    type: 'maintenance' as const,
    icon: 'assignment_turned_in'
  })),
  ...items.map((item) => ({
    id: `item-${item.id}`,
    actor: item.reportedByName,
    action: `Reported ${item.type} item ${item.tagNumber}`,
    actionAr: `تم الإبلاغ عن ${item.type === 'lost' ? 'مفقود' : 'معثور عليه'} ${item.tagNumber}`,
    detail: item.title,
    detailAr: item.titleAr || item.title,
    timeAgo: item.reportedAt,
    type: 'lost_found' as const,
    icon: item.type === 'lost' ? 'search_off' : 'inventory'
  }))
].sort((a, b) => Date.parse(b.timeAgo) - Date.parse(a.timeAgo)).slice(0, 10);

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [reportsState, setReportsState] = useState<ResourceState>(initialState);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [lostFoundState, setLostFoundState] = useState<ResourceState>(initialState);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [claimsState, setClaimsState] = useState<ResourceState>(initialState);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsState, setNotificationsState] = useState<ResourceState>(initialState);

  const refreshReports = useCallback(async () => {
    setReportsState({ status: 'loading' });
    if (!isSupabaseConfigured || !supabase) {
      setReportsState({ status: 'error', error: configurationError });
      return;
    }
    try {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (error) {
        setReportsState({ status: 'error', error: error.message });
        return;
      }
      setReports((data || []).map((row) => mapReport(row as ReportRow)));
      setReportsState({ status: 'success' });
    } catch (error) {
      setReportsState({ status: 'error', error: errorMessage(error) });
    }
  }, []);

  const refreshLostFound = useCallback(async () => {
    setLostFoundState({ status: 'loading' });
    if (!isSupabaseConfigured || !supabase) {
      setLostFoundState({ status: 'error', error: configurationError });
      return;
    }
    try {
      const { data, error } = await supabase.from('lost_found_items').select('*').order('created_at', { ascending: false });
      if (error) {
        setLostFoundState({ status: 'error', error: error.message });
        return;
      }
      setLostFoundItems((data || []).map((row) => mapLostFoundItem(row as LostFoundRow)));
      setLostFoundState({ status: 'success' });
    } catch (error) {
      setLostFoundState({ status: 'error', error: errorMessage(error) });
    }
  }, []);

  const refreshClaims = useCallback(async () => {
    setClaimsState({ status: 'loading' });
    if (!isSupabaseConfigured || !supabase) {
      setClaimsState({ status: 'error', error: configurationError });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('claim_requests')
        .select('*, item:lost_found_items(title,title_ar,image_url)')
        .order('submitted_at', { ascending: false });
      if (error) {
        setClaimsState({ status: 'error', error: error.message });
        return;
      }
      setClaims((data || []).map((row) => mapClaim(row as ClaimRow)));
      setClaimsState({ status: 'success' });
    } catch (error) {
      setClaimsState({ status: 'error', error: errorMessage(error) });
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    setNotificationsState({ status: 'loading' });
    if (!isSupabaseConfigured || !supabase) {
      setNotificationsState({ status: 'error', error: configurationError });
      return;
    }
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (error) {
        setNotificationsState({ status: 'error', error: error.message });
        return;
      }
      setNotifications((data || []).map((row) => mapNotification(row as NotificationRow)));
      setNotificationsState({ status: 'success' });
    } catch (error) {
      setNotificationsState({ status: 'error', error: errorMessage(error) });
    }
  }, []);

  useEffect(() => {
    void refreshReports();
    void refreshLostFound();
    void refreshClaims();
    void refreshNotifications();
  }, [refreshClaims, refreshLostFound, refreshNotifications, refreshReports]);

  const activityFeed = useMemo(() => createActivityFeed(reports, lostFoundItems), [reports, lostFoundItems]);

  const addReport: DataContextType['addReport'] = async (data) => {
    if (!supabase || !isSupabaseConfigured) {
      setReportsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();
    const { data: inserted, error } = await supabase.from('reports').insert({
      ticket_number: `#CF-${suffix}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      building: data.building,
      floor: data.floor,
      room: data.room,
      asset_barcode: data.assetBarcode || null,
      image_url: data.imageUrl?.startsWith('http') ? data.imageUrl : null,
      status: 'pending',
      progress_percent: reportProgress.pending,
      reporter_id: isUuid(data.reporterId) ? data.reporterId : null,
      reporter_name: data.reporterName,
      reporter_role: data.reporterRole
    }).select('*').single();
    if (error) {
      setReportsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    if (!inserted) {
      const message = 'Supabase did not return the inserted maintenance report.';
      setReportsState({ status: 'error', error: message });
      throw new Error(message);
    }
    const created = mapReport(inserted as ReportRow);
    setReports((previous) => [created, ...previous]);
    setReportsState({ status: 'success' });
    return created;
  };

  const updateReportStatus: DataContextType['updateReportStatus'] = async (id, status, techNote, progress) => {
    if (!supabase || !isSupabaseConfigured) {
      setReportsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const { data, error } = await supabase.from('reports').update({
      status,
      progress_percent: progress ?? reportProgress[status],
      technician_note: techNote,
      updated_at: new Date().toISOString()
    }).eq('id', id).select('*').single();
    if (error) {
      setReportsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    const updated = mapReport(data as ReportRow);
    setReports((previous) => previous.map((report) => report.id === id ? updated : report));
    setReportsState({ status: 'success' });
  };

  const assignTechnician: DataContextType['assignTechnician'] = async (reportId, technicianName) => {
    if (!supabase || !isSupabaseConfigured) {
      setReportsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const report = reports.find((entry) => entry.id === reportId);
    const status = report?.status === 'pending' ? 'dispatched' : report?.status || 'pending';
    const { data, error } = await supabase.from('reports').update({
      technician_name: technicianName,
      technician_status: 'Dispatched to location',
      status,
      progress_percent: reportProgress[status],
      updated_at: new Date().toISOString()
    }).eq('id', reportId).select('*').single();
    if (error) {
      setReportsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    const updated = mapReport(data as ReportRow);
    setReports((previous) => previous.map((entry) => entry.id === reportId ? updated : entry));
    setReportsState({ status: 'success' });
  };

  const addLostFoundItem: DataContextType['addLostFoundItem'] = async (data) => {
    if (!supabase || !isSupabaseConfigured) {
      setLostFoundState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();
    const { data: inserted, error } = await supabase.from('lost_found_items').insert({
      tag_number: `#LF-${suffix}`,
      title: data.title,
      title_ar: data.titleAr || null,
      description: data.description,
      description_ar: data.descriptionAr || null,
      type: data.type,
      category: data.category,
      location: data.location,
      location_ar: data.locationAr || null,
      image_url: data.imageUrl || null,
      status: data.status,
      reported_by: isUuid(data.reportedBy) ? data.reportedBy : null,
      reported_by_name: data.reportedByName,
      holding_location: data.holdingLocation || null,
      private_notes: data.privateNotes || null
    }).select('*').single();
    if (error) {
      setLostFoundState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    if (!inserted) {
      const message = 'Supabase did not return the inserted lost and found item.';
      setLostFoundState({ status: 'error', error: message });
      throw new Error(message);
    }
    const created = mapLostFoundItem(inserted as LostFoundRow);
    setLostFoundItems((previous) => [created, ...previous]);
    setLostFoundState({ status: 'success' });
    return created;
  };

  const submitClaim: DataContextType['submitClaim'] = async (data) => {
    if (!supabase || !isSupabaseConfigured) {
      setClaimsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const item = lostFoundItems.find((entry) => entry.id === data.itemId);
    if (!item || !isUuid(item.id)) {
      const message = 'The selected lost and found item is not available in Supabase.';
      setClaimsState({ status: 'error', error: message });
      throw new Error(message);
    }
    const { error } = await supabase.from('claim_requests').insert({
      item_id: item.id,
      item_title: item.title,
      item_tag: item.tagNumber,
      claimant_id: isUuid(data.claimantId) ? data.claimantId : null,
      claimant_name: data.claimantName,
      claimant_student_id: data.claimantStudentId,
      claimant_department: data.claimantDepartment,
      claimant_phone: data.claimantPhone,
      private_description: data.privateDescription,
      proof_document_url: data.proofDocumentUrl || null,
      pickup_method: data.pickupMethod,
      status: 'pending_review'
    });
    if (error) {
      setClaimsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    await refreshClaims();
  };

  const reviewClaim: DataContextType['reviewClaim'] = async (claimId, status, adminNote) => {
    if (!supabase || !isSupabaseConfigured) {
      setClaimsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const claim = claims.find((entry) => entry.id === claimId);
    const { error } = await supabase.from('claim_requests').update({
      status,
      admin_verification_note: adminNote || null,
      reviewed_at: new Date().toISOString()
    }).eq('id', claimId);
    if (error) {
      setClaimsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    if (status === 'approved' && claim?.itemId) {
      const { error: itemError } = await supabase.from('lost_found_items').update({ status: 'returned' }).eq('id', claim.itemId);
      if (itemError) {
        setClaimsState({ status: 'error', error: itemError.message });
        await refreshClaims();
        await refreshLostFound();
        throw new Error(itemError.message);
      }
      await refreshLostFound();
    }
    await refreshClaims();
  };

  const markNotificationRead: DataContextType['markNotificationRead'] = async (id) => {
    if (!supabase || !isSupabaseConfigured) {
      setNotificationsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) {
      setNotificationsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    setNotifications((previous) => previous.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllNotificationsRead: DataContextType['markAllNotificationsRead'] = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setNotificationsState({ status: 'error', error: configurationError });
      throw new Error(configurationError);
    }
    const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
    if (error) {
      setNotificationsState({ status: 'error', error: error.message });
      throw new Error(error.message);
    }
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })));
  };

  return (
    <DataContext.Provider value={{
      reports,
      reportsState,
      lostFoundItems,
      lostFoundState,
      claims,
      claimsState,
      notifications,
      notificationsState,
      activityFeed,
      refreshReports,
      refreshLostFound,
      refreshClaims,
      refreshNotifications,
      addReport,
      updateReportStatus,
      assignTechnician,
      addLostFoundItem,
      submitClaim,
      reviewClaim,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
