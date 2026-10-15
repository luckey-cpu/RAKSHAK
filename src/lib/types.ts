export type Language = 'en' | 'hi' | 'hinglish';

export type ReportType = 'civic' | 'accident';

export type ReportUrgency = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type OfficialGovStatus =
  | 'Stored on RAKSHAK (Citizen Record)'
  | 'Ready for Dispatch / Verification'
  | 'Forwarded to Local Civic Authority'
  | 'Action Initiated by Local Ward'
  | 'Resolved by Civic Body';

export interface LocationData {
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode?: string;
  lat?: number;
  lng?: number;
}

export interface FamilyAssistData {
  isReportingForSomeoneElse: boolean;
  beneficiaryName?: string;
  relationship?: string;
  contactNumber?: string;
  specialNeeds?: string; // e.g. "Senior citizen, wheelchair user, non-verbal"
}

export interface ReportHistoryItem {
  status: ReportStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface IncidentReport {
  id: string; // e.g., RAK-2026-94812
  type: ReportType;
  category: string;
  title: string;
  description: string;
  location: LocationData;
  urgency: ReportUrgency;
  priorityScore: number; // calculated for Smart Priority Queue USP
  status: ReportStatus;
  officialGovStatus: OfficialGovStatus;
  photos: string[]; // paths or base64
  reporterName?: string;
  reporterPhone?: string;
  reporterEmail?: string;
  reportedFor?: FamilyAssistData;
  assignedDepartment?: string;
  assignedOfficer?: string;
  resolutionNote?: string;
  resolutionPhotos?: string[]; // Before/After proof
  resolvedAt?: string;
  upvotes: number; // for community map grouping
  createdAt: string;
  updatedAt: string;
  history: ReportHistoryItem[];
}

export interface EmergencyServiceItem {
  id: string;
  category:
    | 'Police'
    | 'Ambulance & Medical'
    | 'Fire & Rescue'
    | 'Traffic Police'
    | 'Women Safety'
    | 'Child Protection'
    | 'Disaster Management'
    | 'Roadside Assistance'
    | 'Electricity Faults'
    | 'Water & Sanitation'
    | 'Municipal & Civic'
    | 'Animal Rescue'
    | 'Mental Health'
    | 'Public Essential';
  name: string;
  number: string;
  altNumber?: string;
  availability: string; // e.g. "24/7 National Emergency"
  area: string; // "Pan-India" or "Delhi NCR", "Rajasthan (Jaipur)", etc.
  source: string; // "Ministry of Home Affairs", "NDMA", "MoHFW"
  verified: boolean;
  priorityCall112: boolean;
  description: string;
  iconName: string;
}

export interface CommunityIssue {
  id: string;
  title: string;
  category: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  reportCount: number;
  status: ReportStatus;
  urgency: ReportUrgency;
  primaryPhoto?: string;
  reportsIncluded: string[]; // reference IDs
  upvotedCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetReportId?: string;
  details: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'officer' | 'dispatcher';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  suggestedAction?: {
    type: 'call112' | 'navigate' | 'prefill';
    label: string;
    url?: string;
    prefillData?: Partial<IncidentReport>;
  };
  timestamp: string;
}
