import fs from 'fs';
import path from 'path';
import {
  IncidentReport,
  CommunityIssue,
  AuditLogEntry,
  AdminUser,
  ReportUrgency,
  ReportStatus,
  OfficialGovStatus
} from './types';

interface DatabaseSchema {
  reports: IncidentReport[];
  communityIssues: CommunityIssue[];
  auditLogs: AuditLogEntry[];
  adminUsers: AdminUser[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'rakshak_store.json');

// Calculate rule-based priority score (0 - 100) for Smart Priority Queue USP
export function calculatePriorityScore(
  category: string,
  urgency: ReportUrgency,
  hasInjuriesOrVulnerable: boolean
): number {
  let score = 20;

  // Urgency weight
  if (urgency === 'critical') score += 45;
  else if (urgency === 'high') score += 30;
  else if (urgency === 'medium') score += 15;
  else score += 5;

  // Category weight
  const catLower = category.toLowerCase();
  if (
    catLower.includes('accident') ||
    catLower.includes('electric') ||
    catLower.includes('manhole') ||
    catLower.includes('gas') ||
    catLower.includes('fire')
  ) {
    score += 25;
  } else if (catLower.includes('pothole') || catLower.includes('water') || catLower.includes('drain')) {
    score += 15;
  } else if (catLower.includes('light') || catLower.includes('garbage')) {
    score += 10;
  }

  if (hasInjuriesOrVulnerable) {
    score += 10;
  }

  return Math.min(100, Math.max(10, score));
}

export function generateReferenceId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `RAK-2026-${randomNum}`;
}

const initialSeedData: DatabaseSchema = {
  adminUsers: [
    {
      id: 'usr-admin-1',
      name: 'Rajesh Sharma (Nodal Officer)',
      email: 'admin@rakshak.gov.in',
      role: 'superadmin'
    },
    {
      id: 'usr-officer-2',
      name: 'Pooja Verma (Civic Dispatcher)',
      email: 'pooja.verma@rakshak.gov.in',
      role: 'dispatcher'
    }
  ],
  reports: [
    {
      id: 'RAK-2026-84920',
      type: 'civic',
      category: 'Potholes & Damaged Roads',
      title: 'Deep hazardous pothole near Madhyam Marg intersection',
      description: 'Approximately 2.5 feet wide, 8 inches deep pothole right on the active lane causing severe two-wheeler skids.',
      location: {
        address: 'Near Madhyam Marg, Sector 3, Mansarovar',
        landmark: 'Opposite City Park Gate 2',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302020',
        lat: 26.8528,
        lng: 75.7681
      },
      urgency: 'high',
      priorityScore: 78,
      status: 'Resolved',
      officialGovStatus: 'Resolved by Civic Body',
      photos: ['/sample-pothole-before.svg'],
      resolutionNote: 'Ward 42 repair team inspected the road on 14 Oct. Asphalt patch work and leveling completed. Inspected by JDA junior engineer.',
      resolutionPhotos: ['/sample-pothole-after.svg'],
      resolvedAt: '2026-10-14T16:30:00Z',
      reporterName: 'Sunil Mathur',
      reporterPhone: '+91-9829012345',
      upvotes: 14,
      assignedDepartment: 'Jaipur Development Authority (JDA) - Road Engineering Wing',
      assignedOfficer: 'Er. R. K. Meena',
      createdAt: '2026-10-12T09:15:00Z',
      updatedAt: '2026-10-14T16:30:00Z',
      history: [
        {
          status: 'Submitted',
          timestamp: '2026-10-12T09:15:00Z',
          note: 'Complaint registered by citizen with GPS location and photo.',
          updatedBy: 'System'
        },
        {
          status: 'Under Review',
          timestamp: '2026-10-12T11:45:00Z',
          note: 'Verified road location under JDA Mansarovar Division jurisdiction.',
          updatedBy: 'Pooja Verma (Dispatcher)'
        },
        {
          status: 'Assigned',
          timestamp: '2026-10-12T14:20:00Z',
          note: 'Assigned to Er. R. K. Meena (Road Maintenance Ward 42).',
          updatedBy: 'Rajesh Sharma (Admin)'
        },
        {
          status: 'In Progress',
          timestamp: '2026-10-13T10:00:00Z',
          note: 'Materials dispatched; asphalt patch work scheduled for morning shift.',
          updatedBy: 'Er. R. K. Meena'
        },
        {
          status: 'Resolved',
          timestamp: '2026-10-14T16:30:00Z',
          note: 'Pothole filled and rolled. After-photo uploaded to RAKSHAK for public verification.',
          updatedBy: 'Er. R. K. Meena'
        }
      ]
    },
    {
      id: 'RAK-2026-91042',
      type: 'civic',
      category: 'Electricity Faults & Dangling Wires',
      title: 'Sparking low-hanging transformer wire over pedestrian sidewalk',
      description: 'A 440V distribution cable snapped during high winds and is dangling 4 feet above the walking path near the community school.',
      location: {
        address: 'Near Govt Senior Secondary School, C-Scheme',
        landmark: 'Subhash Marg Junction',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        lat: 26.9084,
        lng: 75.8015
      },
      urgency: 'critical',
      priorityScore: 95,
      status: 'In Progress',
      officialGovStatus: 'Forwarded to Local Civic Authority',
      photos: [],
      reporterName: 'Anil Gupta',
      reporterPhone: '+91-9414098765',
      upvotes: 21,
      assignedDepartment: 'Jaipur Vidyut Vitran Nigam Ltd (JVVNL) Emergency Cell',
      assignedOfficer: 'Lineman Ashok Kumar',
      createdAt: '2026-10-15T07:20:00Z',
      updatedAt: '2026-10-15T08:10:00Z',
      history: [
        {
          status: 'Submitted',
          timestamp: '2026-10-15T07:20:00Z',
          note: 'Critical electricity hazard flagged. Dispatched immediate SMS alert.',
          updatedBy: 'System'
        },
        {
          status: 'Assigned',
          timestamp: '2026-10-15T07:35:00Z',
          note: 'Escalated to 1912 Emergency feeder substation C-Scheme.',
          updatedBy: 'Rajesh Sharma (Admin)'
        },
        {
          status: 'In Progress',
          timestamp: '2026-10-15T08:10:00Z',
          note: 'Substation isolated feeder line. Repair crew en route with ladder truck.',
          updatedBy: 'Lineman Ashok Kumar'
        }
      ]
    },
    {
      id: 'RAK-2026-38104',
      type: 'accident',
      category: 'Road Accident (Two-Wheeler / Pedestrian)',
      title: 'Two-wheeler collision at Ring Road slip road',
      description: 'Motorbike slipped on loose gravel near intersection. Rider received arm abrasion. 112 was called by bystander.',
      location: {
        address: 'Ring Road Bypass near Durgapura Flyover',
        landmark: 'Pillar No. 44',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302018',
        lat: 26.8488,
        lng: 75.7925
      },
      urgency: 'high',
      priorityScore: 82,
      status: 'Under Review',
      officialGovStatus: 'Ready for Dispatch / Verification',
      photos: [],
      reporterName: 'Vikas Choudhary',
      reporterPhone: '+91-9828011223',
      upvotes: 4,
      assignedDepartment: 'Traffic Police North Zone & Emergency Response Unit',
      createdAt: '2026-10-15T08:45:00Z',
      updatedAt: '2026-10-15T09:00:00Z',
      history: [
        {
          status: 'Submitted',
          timestamp: '2026-10-15T08:45:00Z',
          note: 'Accident reported with bystander testimony. Emergency 112 guidance shown to user.',
          updatedBy: 'System'
        },
        {
          status: 'Under Review',
          timestamp: '2026-10-15T09:00:00Z',
          note: 'Ambulance 108 dispatched from SMS Trauma base; traffic control notified for gravel clearance.',
          updatedBy: 'Pooja Verma (Dispatcher)'
        }
      ]
    },
    {
      id: 'RAK-2026-11940',
      type: 'civic',
      category: 'Open Manholes & Infrastructure Risks',
      title: 'Missing iron manhole cover on unlit street',
      description: 'Stormwater manhole lid broken and missing for 3 days. Extremely dangerous at night for pedestrians and cyclists.',
      location: {
        address: 'Plot 12, Malviya Nagar Sector 4',
        landmark: 'Near Calgiri Hospital turn',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017',
        lat: 26.8535,
        lng: 75.8231
      },
      urgency: 'critical',
      priorityScore: 92,
      status: 'Submitted',
      officialGovStatus: 'Stored on RAKSHAK (Citizen Record)',
      photos: [],
      reporterName: 'Meenakshi Jain',
      reporterPhone: '+91-9783055443',
      reportedFor: {
        isReportingForSomeoneElse: true,
        beneficiaryName: 'Babulal Jain (Elderly Father)',
        relationship: 'Daughter',
        contactNumber: '+91-9783055443',
        specialNeeds: 'Senior citizen walks daily on this street; cannot see uncovered ditch.'
      },
      upvotes: 18,
      createdAt: '2026-10-15T09:10:00Z',
      updatedAt: '2026-10-15T09:10:00Z',
      history: [
        {
          status: 'Submitted',
          timestamp: '2026-10-15T09:10:00Z',
          note: 'Complaint filed on behalf of elderly resident with Family Assist.',
          updatedBy: 'System'
        }
      ]
    }
  ],
  communityIssues: [
    {
      id: 'com-jpr-1',
      title: 'Deep crater pothole causing accidents',
      category: 'Potholes & Damaged Roads',
      address: 'Madhyam Marg, Mansarovar',
      city: 'Jaipur',
      lat: 26.8528,
      lng: 75.7681,
      reportCount: 6,
      status: 'Resolved',
      urgency: 'high',
      reportsIncluded: ['RAK-2026-84920'],
      upvotedCount: 34
    },
    {
      id: 'com-jpr-2',
      title: 'Sparking exposed high-voltage cable',
      category: 'Electricity Faults & Dangling Wires',
      address: 'Subhash Marg, C-Scheme',
      city: 'Jaipur',
      lat: 26.9084,
      lng: 75.8015,
      reportCount: 4,
      status: 'In Progress',
      urgency: 'critical',
      reportsIncluded: ['RAK-2026-91042'],
      upvotedCount: 47
    },
    {
      id: 'com-jpr-3',
      title: 'Dangerous uncovered manhole on school route',
      category: 'Open Manholes & Infrastructure Risks',
      address: 'Calgiri Marg, Malviya Nagar',
      city: 'Jaipur',
      lat: 26.8535,
      lng: 75.8231,
      reportCount: 3,
      status: 'Submitted',
      urgency: 'critical',
      reportsIncluded: ['RAK-2026-11940'],
      upvotedCount: 29
    },
    {
      id: 'com-del-1',
      title: 'Broken streetlight row causing dark stretch',
      category: 'Broken Streetlights',
      address: 'Outer Circle, Connaught Place',
      city: 'New Delhi',
      lat: 28.6315,
      lng: 77.2167,
      reportCount: 5,
      status: 'Assigned',
      urgency: 'medium',
      reportsIncluded: [],
      upvotedCount: 19
    },
    {
      id: 'com-mum-1',
      title: 'Major water pipeline leakage flooding road',
      category: 'Water Leakage & Supply Issues',
      address: 'Near Linking Road, Bandra West',
      city: 'Mumbai',
      lat: 19.0600,
      lng: 72.8362,
      reportCount: 8,
      status: 'In Progress',
      urgency: 'high',
      reportsIncluded: [],
      upvotedCount: 52
    }
  ],
  auditLogs: [
    {
      id: 'aud-1',
      timestamp: '2026-10-12T14:20:00Z',
      action: 'ASSIGN_REPORT',
      actor: 'Rajesh Sharma (Admin)',
      targetReportId: 'RAK-2026-84920',
      details: 'Assigned pothole report to JDA Road Maintenance Ward 42'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-14T16:30:00Z',
      action: 'RESOLVE_REPORT',
      actor: 'Er. R. K. Meena',
      targetReportId: 'RAK-2026-84920',
      details: 'Attached proof of resolution photo and marked status Resolved.'
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-15T07:35:00Z',
      action: 'ESCALATE_CRITICAL',
      actor: 'Rajesh Sharma (Admin)',
      targetReportId: 'RAK-2026-91042',
      details: 'Critical electrical cable issue dispatched to 1912 Substation team.'
    }
  ]
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2), 'utf-8');
      return initialSeedData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading database file, using fallback in-memory seed:', err);
    return initialSeedData;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing to database:', err);
  }
}

// Queries & Mutations
export function getAllReports(filter?: { type?: string; status?: string; category?: string }): IncidentReport[] {
  const db = readDb();
  let result = db.reports;
  if (filter?.type) {
    result = result.filter(r => r.type === filter.type);
  }
  if (filter?.status) {
    result = result.filter(r => r.status.toLowerCase() === filter.status?.toLowerCase());
  }
  if (filter?.category) {
    result = result.filter(r => r.category.toLowerCase().includes(filter.category!.toLowerCase()));
  }
  // Sort by priorityScore descending, then date
  return result.sort((a, b) => b.priorityScore - a.priorityScore || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReportById(id: string): IncidentReport | null {
  const db = readDb();
  const report = db.reports.find(r => r.id.toLowerCase() === id.trim().toLowerCase());
  return report || null;
}

export function createIncidentReport(reportInput: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'priorityScore' | 'status' | 'officialGovStatus' | 'upvotes'>): IncidentReport {
  const db = readDb();
  const id = generateReferenceId();
  const now = new Date().toISOString();

  const isVulnerable = !!(reportInput.reportedFor?.isReportingForSomeoneElse || reportInput.type === 'accident');
  const priorityScore = calculatePriorityScore(reportInput.category, reportInput.urgency, isVulnerable);

  const newReport: IncidentReport = {
    ...reportInput,
    id,
    priorityScore,
    status: 'Submitted',
    officialGovStatus: 'Stored on RAKSHAK (Citizen Record)',
    upvotes: 1,
    createdAt: now,
    updatedAt: now,
    history: [
      {
        status: 'Submitted',
        timestamp: now,
        note: 'Report created successfully on RAKSHAK secure repository.',
        updatedBy: reportInput.reporterName || 'Citizen'
      }
    ]
  };

  db.reports.unshift(newReport);

  // Also log audit entry
  db.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    timestamp: now,
    action: 'CREATE_REPORT',
    actor: reportInput.reporterName || 'Citizen',
    targetReportId: id,
    details: `Filed ${newReport.type} report: ${newReport.category} at ${newReport.location.address}`
  });

  // Check if a community issue should be created or updated for this location
  const matchingIssue = db.communityIssues.find(
    ci => ci.city.toLowerCase() === newReport.location.city.toLowerCase() &&
          ci.category.toLowerCase() === newReport.category.toLowerCase()
  );

  if (matchingIssue) {
    matchingIssue.reportCount += 1;
    matchingIssue.upvotedCount += 1;
    if (!matchingIssue.reportsIncluded.includes(id)) {
      matchingIssue.reportsIncluded.push(id);
    }
  } else if (newReport.location.lat && newReport.location.lng) {
    db.communityIssues.push({
      id: `com-${Date.now()}`,
      title: newReport.title,
      category: newReport.category,
      address: newReport.location.address,
      city: newReport.location.city,
      lat: newReport.location.lat,
      lng: newReport.location.lng,
      reportCount: 1,
      status: 'Submitted',
      urgency: newReport.urgency,
      reportsIncluded: [id],
      upvotedCount: 1
    });
  }

  writeDb(db);
  return newReport;
}

export function updateReportStatus(
  id: string,
  updates: {
    status?: ReportStatus;
    officialGovStatus?: OfficialGovStatus;
    assignedDepartment?: string;
    assignedOfficer?: string;
    resolutionNote?: string;
    resolutionPhotos?: string[];
  },
  actor: string
): IncidentReport | null {
  const db = readDb();
  const index = db.reports.findIndex(r => r.id.toLowerCase() === id.trim().toLowerCase());
  if (index === -1) return null;

  const now = new Date().toISOString();
  const target = db.reports[index];

  if (updates.status) target.status = updates.status;
  if (updates.officialGovStatus) target.officialGovStatus = updates.officialGovStatus;
  if (updates.assignedDepartment) target.assignedDepartment = updates.assignedDepartment;
  if (updates.assignedOfficer) target.assignedOfficer = updates.assignedOfficer;
  if (updates.resolutionNote) target.resolutionNote = updates.resolutionNote;
  if (updates.resolutionPhotos) target.resolutionPhotos = updates.resolutionPhotos;

  if (updates.status === 'Resolved' && !target.resolvedAt) {
    target.resolvedAt = now;
  }

  target.updatedAt = now;
  target.history.push({
    status: target.status,
    timestamp: now,
    note: updates.resolutionNote || `Status updated to ${target.status} by ${actor}`,
    updatedBy: actor
  });

  // Audit log
  db.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    timestamp: now,
    action: 'STATUS_UPDATE',
    actor,
    targetReportId: id,
    details: `Updated report ${id} to ${target.status}. ${updates.resolutionNote || ''}`
  });

  // Update community issue if linked
  const linkedIssue = db.communityIssues.find(ci => ci.reportsIncluded.includes(id));
  if (linkedIssue && updates.status) {
    linkedIssue.status = updates.status;
  }

  writeDb(db);
  return target;
}

export function getCommunityIssues(): CommunityIssue[] {
  const db = readDb();
  return db.communityIssues;
}

export function upvoteCommunityIssue(issueId: string): CommunityIssue | null {
  const db = readDb();
  const issue = db.communityIssues.find(i => i.id === issueId);
  if (!issue) return null;

  issue.upvotedCount += 1;
  writeDb(db);
  return issue;
}

export function getAuditLogs(): AuditLogEntry[] {
  const db = readDb();
  return db.auditLogs.slice(0, 50);
}
