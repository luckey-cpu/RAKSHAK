'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  FileCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { IncidentReport, ReportStatus } from '@/lib/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [report, setReport] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async (idToFetch: string) => {
    const trimmed = idToFetch.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.success && data.data) {
        setReport(data.data);
      } else {
        setReport(null);
        setError(data.error || `No report found with reference ID "${trimmed}".`);
      }
    } catch {
      setError('Network error while searching for report.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchReport(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport(searchId);
  };

  const statusSteps: ReportStatus[] = [
    'Submitted',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved'
  ];

  const getStepIndex = (status: ReportStatus) => {
    if (status === 'Rejected') return -1;
    return statusSteps.indexOf(status);
  };

  const currentStepIndex = report ? getStepIndex(report.status) : 0;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" />
            Citizen Audit &amp; Status Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Track My Complaint &amp; Proof of Resolution
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Enter your unique reference ID (e.g. RAK-2026-84920) to inspect real-time review progress, municipal ward assignment, and verified Before &amp; After proof photographs.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Reference ID (e.g. RAK-2026-84920)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black py-3 px-6 rounded-xl text-xs sm:text-sm transition"
            >
              {loading ? 'Searching...' : 'Track Report'}
            </button>
          </form>

          {/* Sample quick links */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
            <span>Demo Reference IDs:</span>
            <button
              onClick={() => { setSearchId('RAK-2026-84920'); fetchReport('RAK-2026-84920'); }}
              className="text-amber-400 underline font-mono"
            >
              RAK-2026-84920 (Resolved Pothole with Proof)
            </button>
            <span>•</span>
            <button
              onClick={() => { setSearchId('RAK-2026-91042'); fetchReport('RAK-2026-91042'); }}
              className="text-amber-400 underline font-mono"
            >
              RAK-2026-91042 (Critical Live Wire)
            </button>
            <span>•</span>
            <button
              onClick={() => { setSearchId('RAK-2026-11940'); fetchReport('RAK-2026-11940'); }}
              className="text-amber-400 underline font-mono"
            >
              RAK-2026-11940 (Family Assist)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {report && (
          <div className="space-y-6 animate-fade-in">
            {/* Report Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-500 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                      {report.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : report.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                    {report.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span>Filed: {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>Category: {report.category}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Priority Urgency
                  </span>
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg inline-block mt-0.5 ${
                      report.urgency === 'critical'
                        ? 'bg-red-600 text-white'
                        : report.urgency === 'high'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {report.urgency} Priority (Score {report.priorityScore}/100)
                  </span>
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="py-2">
                <span className="text-xs font-bold text-slate-500 block mb-4">
                  Resolution Progress Workflow:
                </span>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {statusSteps.map((step, idx) => {
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          } ${isCurrent ? 'ring-4 ring-emerald-500/30' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-semibold leading-tight ${
                            isCurrent
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : isDone
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Government vs Internal Status Distinction (Required by item 11) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block text-[11px]">
                    RAKSHAK Internal Citizen Status:
                  </span>
                  <strong className="text-slate-900 dark:text-white text-sm">
                    {report.status}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[11px]">
                    Official Authority Action Status:
                  </span>
                  <strong className="text-amber-600 dark:text-amber-400 text-sm">
                    {report.officialGovStatus}
                  </strong>
                </div>
              </div>

              {/* Description & Location */}
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p><strong>Description:</strong> {report.description}</p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span><strong>Location:</strong> {report.location.address} {report.location.landmark ? `(Landmark: ${report.location.landmark})` : ''}, {report.location.city}, {report.location.state}</span>
                </p>
                {report.assignedDepartment && (
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span><strong>Assigned Ward / Wing:</strong> {report.assignedDepartment}</span>
                  </p>
                )}
                {report.assignedOfficer && (
                  <p className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span><strong>Inspection Officer:</strong> {report.assignedOfficer}</span>
                  </p>
                )}
              </div>
            </div>

            {/* USP #7: PROOF OF RESOLUTION (When Resolved) */}
            {report.status === 'Resolved' && (
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                        Proof of Resolution
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                          Verified Audit
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Official visual evidence and inspector remarks uploaded upon case completion.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    Resolved on {report.resolvedAt ? new Date(report.resolvedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                {/* Before & After side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-red-500/30">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                      {report.photos && report.photos.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={report.photos[0]} alt="Before Repair" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-500">
                          Original report filed without initial photo
                        </div>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-red-400">BEFORE (Reported Condition)</span>
                      <span className="text-[11px] text-slate-500">Original Submission</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                      {report.resolutionPhotos && report.resolutionPhotos.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={report.resolutionPhotos[0]} alt="After Repair" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-slate-500">
                          Resolution confirmed on site by inspection officer
                        </div>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">AFTER (Repaired Road / Fixed)</span>
                      <span className="text-[11px] text-emerald-400 font-semibold">✓ Verified Resolved</span>
                    </div>
                  </div>
                </div>

                {report.resolutionNote && (
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                    <strong className="text-white block">Official Resolution Note:</strong>
                    <p className="text-slate-300 leading-relaxed">&ldquo;{report.resolutionNote}&rdquo;</p>
                  </div>
                )}
              </div>
            )}

            {/* Audit History Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Action Audit Log &amp; History
              </h3>

              <div className="space-y-4 pl-3 border-l-2 border-slate-200 dark:border-slate-800 text-xs">
                {report.history.map((h, idx) => (
                  <div key={idx} className="relative pl-5">
                    <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-900"></div>
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800 dark:text-slate-200">{h.status}</strong>
                      <span className="text-[10px] text-slate-400">
                        {new Date(h.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">{h.note}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">By: {h.updatedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading Complaint Tracker...</div>}>
      <TrackContent />
    </React.Suspense>
  );
}
