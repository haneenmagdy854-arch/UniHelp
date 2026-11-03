export type UserRole = 'student' | 'doctor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  building: string;
  studentId?: string;
  employeeId?: string;
  phone?: string;
}

export type MaintenanceCategory =
  | 'electricity'
  | 'ac'
  | 'network'
  | 'furniture'
  | 'cleaning'
  | 'lab'
  | 'other';

export type MaintenanceStatus =
  | 'pending'
  | 'dispatched'
  | 'in_progress'
  | 'awaiting_parts'
  | 'resolved';

export type PriorityLevel = 'low' | 'moderate' | 'high' | 'urgent';

export interface TimelineStep {
  title: string;
  titleAr: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
  detail?: string;
  detailAr?: string;
}

export interface MaintenanceReport {
  id: string;
  ticketNumber: string; // e.g. #CF-8492
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
  status: MaintenanceStatus;
  progressPercent: number; // e.g. 65
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  technicianName?: string;
  technicianStatus?: string;
  technicianAvatar?: string;
  technicianNote?: string;
  technicianNoteAr?: string;
  estimatedResolution?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineStep[];
}

export type LostFoundType = 'lost' | 'found';

export type LostFoundStatus = 'reported_lost' | 'safe_with_security' | 'claim_pending' | 'returned';

export interface LostFoundItem {
  id: string;
  tagNumber: string; // e.g. #LF-992
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  type: LostFoundType;
  category: string;
  location: string;
  locationAr?: string;
  imageUrl: string;
  status: LostFoundStatus;
  reportedBy: string;
  reportedByName: string;
  reportedAt: string;
  holdingLocation?: string;
  privateNotes?: string;
}

export type ClaimStatus = 'pending_review' | 'approved' | 'rejected' | 'additional_proof_requested';

export interface ClaimRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemTag: string;
  itemImageUrl: string;
  claimantId: string;
  claimantName: string;
  claimantStudentId: string;
  claimantDepartment: string;
  claimantPhone: string;
  privateDescription: string;
  proofDocumentUrl?: string;
  pickupMethod: 'central' | 'department';
  status: ClaimStatus;
  adminVerificationNote?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timeAgo: string;
  category: 'maintenance' | 'lost_found' | 'system' | 'broadcast';
  read: boolean;
  link?: string;
  avatarIcon?: string;
}

export interface ActivityFeedItem {
  id: string;
  actor: string;
  action: string;
  actionAr: string;
  detail: string;
  detailAr: string;
  timeAgo: string;
  type: 'maintenance' | 'lost_found';
  icon: string;
}
