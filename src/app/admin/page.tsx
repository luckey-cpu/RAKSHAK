'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  Upload,
  ArrowUpDown,
  FileCheck,
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';
import { IncidentReport, ReportStatus, OfficialGovStatus, AuditLogEntry } from '@/lib/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState('admin@rakshak.gov.in');
  const [password, setPassword] = useState('RakshakAdmin@2026!');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);

  // Admin Data
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Active Report Modal
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [editStatus, setEditStatus] = useState<ReportStatus>('In Progress');
  const [editGovStatus, setEditGovStatus] = useState<OfficialGovStatus>('Forwarded to Local Civic Authority');
  const [editDept, setEditDept] = useState('');
  const [editOfficer, setEditOfficer] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Filters & Priority Sorting (USP #6: Smart Priority Queue)
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('priority');

  // Verify auth session
  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        loadAdminData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [repRes, statsRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/admin/stats')
      ]);
      const repData = await repRes.json();
      const statsData = await statsRes.json();

      if (repData.success && repData.data) {
        setReports(repData.data);
      }
      if (statsData.success) {
        setStats(statsData.stats);
        setAuditLogs(statsData.auditLogs || []);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        loadAdminData();
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch {
      setLoginError('Network error logging in');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Open edit drawer
  const openEditModal = (rep: IncidentReport) => {
    setSelectedReport(rep);
    setEditStatus(rep.status);
    setEditGovStatus(rep.officialGovStatus);
    setEditDept(rep.assignedDepartment || '');
    setEditOfficer(rep.assignedOfficer || '');
    setResolutionNote(rep.resolutionNote || '');
    setResolutionPhotoUrl(rep.resolutionPhotos?.[0] || '');
  };

  // Handle Photo Upload for Proof of Resolution (USP #7)
  const handleResolutionPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setResolutionPhotoUrl(data.url);
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch {
      alert('Upload error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Save changes
  const handleSaveReportUpdates = async () => {
    if (!selectedReport) return;
    setUpdating(true);

    try {
      const updates: any = {
        status: editStatus,
        officialGovStatus: editGovStatus,
        assignedDepartment: editDept.trim() || undefined,
        assignedOfficer: editOfficer.trim() || undefined,
        resolutionNote: resolutionNote.trim() || undefined,
        actor: currentUser?.name || 'Authorized Admin'
      };

      if (resolutionPhotoUrl) {
        updates.resolutionPhotos = [resolutionPhotoUrl];
      }

      const res = await fetch(`/api/reports/${selectedReport.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      if (data.success && data.data) {
        // Refresh local report list
        setReports((prev) =>
          prev.map((r) => (r.id === selectedReport.id ? data.data : r))
        );
        setSelectedReport(null);
        loadAdminData();
      } else {
        alert(data.error || 'Update failed');
      }
    } catch {
      alert('Network error while saving updates');
    } finally {
      setUpdating(false);
    }
  };

  // Filtered & Sorted reports
  const displayReports = reports
    .filter((r) => {
      if (filterType === 'all') return true;
      if (filterType === 'critical') return r.urgency === 'critical';
      if (filterType === 'civic') return r.type === 'civic';
      if (filterType === 'accident') return r.type === 'accident';
      if (filterType === 'pending') return ['Submitted', 'Under Review', 'Assigned'].includes(r.status);
      if (filterType === 'resolved') return r.status === 'Resolved';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (authChecking) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Verifying administrative session...</span>
      </div>
    );
  }

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              RAKSHAK Staff Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authorized municipal officer &amp; incident dispatcher login.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold">Default Demo Credentials:</p>
            <p className="mt-0.5">Email: <code className="font-mono font-bold">admin@rakshak.gov.in</code></p>
            <p>Password: <code className="font-mono font-bold">RakshakAdmin@2026!</code></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Staff Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
            >
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              <span>Authenticate Staff Session</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Operational Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-full">
                ● Secure Operator Session Active
              </span>
              <span className="text-xs text-slate-400">
                User: {currentUser?.name} ({currentUser?.role})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              RAKSHAK Citizen Operations &amp; Dispatch Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Smart Priority Queue • Civic Grievances • Proof of Resolution Uploader
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              disabled={loadingData}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Reports</span>
              <strong className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</strong>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-red-300 dark:border-red-900/60 text-center">
              <span className="text-[10px] text-red-500 font-bold block uppercase">Critical Urgency</span>
              <strong className="text-2xl font-black text-red-600 dark:text-red-400">{stats.critical}</strong>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-amber-500 font-bold block uppercase">New Submitted</span>
              <strong className="text-2xl font-black text-amber-500">{stats.submitted}</strong>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-blue-500 font-bold block uppercase">In Progress</span>
              <strong className="text-2xl font-black text-blue-500">{stats.inProgress}</strong>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-300 dark:border-emerald-900/60 text-center">
              <span className="text-[10px] text-emerald-500 font-bold block uppercase">Resolved Proof</span>
              <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.resolved}</strong>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Accident Logs</span>
              <strong className="text-2xl font-black text-slate-700 dark:text-slate-300">{stats.accidents}</strong>
            </div>
          </div>
        )}

        {/* USP #6: SMART PRIORITY QUEUE CONTROLS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <ArrowUpDown className="w-4 h-4 text-amber-500" />
              USP #6: Smart Priority Queue Ranking
            </span>
            <p className="text-slate-500 text-[11px]">
              Automatically elevates live high-voltage hazards, severe collisions, and vulnerable citizens above routine streetlight complaints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'priority' ? 'date' : 'priority')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                sortBy === 'priority'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>Sorted by: {sortBy === 'priority' ? 'Smart Priority Score (High to Low)' : 'Chronological Date'}</span>
            </button>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {['all', 'critical', 'pending', 'resolved', 'accident'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold ${
                    filterType === f
                      ? 'bg-slate-900 text-white dark:bg-slate-700'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Priority / ID</th>
                  <th className="py-3 px-4">Category &amp; Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Team</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayReports.map((rep) => (
                  <tr
                    key={rep.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            rep.priorityScore >= 90
                              ? 'bg-red-600 text-white ring-2 ring-red-400/40'
                              : rep.priorityScore >= 70
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                          title={`Priority Score: ${rep.priorityScore}/100`}
                        >
                          {rep.priorityScore}
                        </span>
                        <div>
                          <strong className="text-slate-900 dark:text-white block">{rep.id}</strong>
                          <span className="text-[10px] text-slate-400 capitalize">{rep.urgency}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {rep.category}
                      </span>
                      <strong className="text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                        {rep.title}
                      </strong>
                      {rep.reportedFor?.isReportingForSomeoneElse && (
                        <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-semibold px-1.5 py-0.2 rounded">
                          Family Assist: {rep.reportedFor.beneficiaryName}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <span className="line-clamp-1">{rep.location.address}</span>
                      <span className="text-[10px] text-slate-500">{rep.location.city}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rep.status === 'Resolved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : rep.status === 'In Progress'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {rep.assignedDepartment || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => openEditModal(rep)}
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Administrative System Audit Trail (Immutable Logs)
          </h3>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-500">{log.action}</span>: {log.details}
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit / Resolution Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-500">{selectedReport.id}</span>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">
                    Manage Report &amp; Proof of Resolution
                  </h3>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Citizen Details View */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <p><strong>Title:</strong> {selectedReport.title}</p>
                <p><strong>Description:</strong> {selectedReport.description}</p>
                <p><strong>Location:</strong> {selectedReport.location.address}, {selectedReport.location.city}</p>
                {selectedReport.photos && selectedReport.photos.length > 0 && (
                  <div className="pt-2">
                    <strong className="block mb-1">Attached Citizen Photos:</strong>
                    <div className="flex gap-2">
                      {selectedReport.photos.map((p, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={p} alt="Citizen Photo" className="w-20 h-16 object-cover rounded-lg border" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Update Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Internal RAKSHAK Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ReportStatus)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Government Action Status
                  </label>
                  <select
                    value={editGovStatus}
                    onChange={(e) => setEditGovStatus(e.target.value as OfficialGovStatus)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Stored on RAKSHAK (Citizen Record)">Stored on RAKSHAK (Citizen Record)</option>
                    <option value="Ready for Dispatch / Verification">Ready for Dispatch / Verification</option>
                    <option value="Forwarded to Local Civic Authority">Forwarded to Local Civic Authority</option>
                    <option value="Action Initiated by Local Ward">Action Initiated by Local Ward</option>
                    <option value="Resolved by Civic Body">Resolved by Civic Body</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Municipal Department
                  </label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    placeholder="e.g. JDA Road Wing Ward 42"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Officer
                  </label>
                  <input
                    type="text"
                    value={editOfficer}
                    onChange={(e) => setEditOfficer(e.target.value)}
                    placeholder="e.g. Er. R. K. Meena"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* USP #7: PROOF OF RESOLUTION UPLOADER */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-200 block">
                      USP #7: Proof of Resolution (Before &amp; After Evidence)
                    </strong>
                    <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                      When marking as Resolved, upload the inspection photo showing the repaired road or fixed light.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Resolution Remark / Note
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Describe how the issue was fixed, materials used, and junior engineer inspection notes..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Upload &ldquo;AFTER&rdquo; Repair Photograph Evidence
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl cursor-pointer flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Choose After Photo'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleResolutionPhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                    {resolutionPhotoUrl && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ✓ Photo attached: {resolutionPhotoUrl.substring(0, 25)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReportUpdates}
                  disabled={updating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  {updating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save Status &amp; Publish Proof</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
