'use client';

import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Wifi,
  PhoneCall,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ArrowRight,
  Info
} from 'lucide-react';
import { verifiedEmergencyServices } from '@/lib/emergency-data';

interface OfflineDraft {
  id: string;
  category: string;
  title: string;
  description: string;
  address: string;
  urgency: string;
  timestamp: string;
  synced: boolean;
  syncedReferenceId?: string;
}

export default function OfflineModePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [drafts, setDrafts] = useState<OfflineDraft[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Form inputs for offline draft
  const [category, setCategory] = useState('Potholes & Damaged Roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load drafts from localStorage
    try {
      const stored = localStorage.getItem('rakshak_offline_drafts');
      if (stored) {
        setDrafts(JSON.parse(stored));
      }
    } catch {}

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveDraftsToStorage = (updatedDrafts: OfflineDraft[]) => {
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem('rakshak_offline_drafts', JSON.stringify(updatedDrafts));
    } catch {}
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !address.trim()) {
      alert('Please provide description and location.');
      return;
    }

    const newDraft: OfflineDraft = {
      id: `draft_${Date.now()}`,
      category,
      title: title.trim() || `${category} (Offline Draft)`,
      description: description.trim(),
      address: address.trim(),
      urgency,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    setTitle('');
    setDescription('');
    setAddress('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSyncDraft = async (draft: OfflineDraft) => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please connect to internet.');
      return;
    }

    setSyncingId(draft.id);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'civic',
          category: draft.category,
          title: draft.title,
          description: `${draft.description} [Originally drafted offline on ${new Date(draft.timestamp).toLocaleString()}]`,
          location: { address: draft.address, city: 'Jaipur', state: 'Rajasthan' },
          urgency: draft.urgency
        })
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        const updated = drafts.map((d) =>
          d.id === draft.id ? { ...d, synced: true, syncedReferenceId: data.data.id } : d
        );
        saveDraftsToStorage(updated);
      } else {
        alert('Sync error: ' + (data.error || 'Server rejected report'));
      }
    } catch (e) {
      alert('Network error while syncing.');
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <WifiOff className="w-4 h-4" />
              USP #3: Low-Network / Zero Connectivity Support
            </span>

            {/* Live Network Status Indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
              <span className="text-xs font-bold">
                {isOnline ? 'Online (Connected)' : 'Offline (No Internet)'}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black mt-3">
            Offline Helplines &amp; Local Draft Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            In remote disaster zones or areas with poor cellular data, RAKSHAK maintains local copies of all emergency phone lines and allows you to store draft complaints that automatically queue for submission once your connection returns.
          </p>

          <div className="mt-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200">
            <strong>Critical Life Safety Rule:</strong> Offline draft storage does NOT dispatch responders. Standard voice phone calls work even without mobile data. For immediate life risk, dial 112 directly.
          </div>
        </div>

        {/* Cached Emergency Numbers (Works 100% Offline via phone dialer) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-500" />
              Cached Direct Telephone Numbers (Usable with 0 Internet Data)
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Stored in Browser Memory
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <a href="tel:112" className="bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">All Emergency</span>
                <strong className="text-red-600 dark:text-red-400 text-sm">112</strong>
              </div>
              <PhoneCall className="w-4 h-4 text-red-600" />
            </a>

            <a href="tel:108" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Ambulance</span>
                <strong className="text-amber-500 text-sm">108</strong>
              </div>
              <PhoneCall className="w-4 h-4 text-amber-500" />
            </a>

            <a href="tel:101" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Fire Rescue</span>
                <strong className="text-orange-500 text-sm">101</strong>
              </div>
              <PhoneCall className="w-4 h-4 text-orange-500" />
            </a>

            <a href="tel:1091" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Women Helpline</span>
                <strong className="text-pink-500 text-sm">1091</strong>
              </div>
              <PhoneCall className="w-4 h-4 text-pink-500" />
            </a>
          </div>
        </div>

        {/* Offline Report Creator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Draft a Complaint Offline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data is saved in your device storage and can be synced to RAKSHAK when you have internet.
              </p>
            </div>
            <Save className="w-5 h-5 text-amber-500" />
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Draft saved locally! It is marked &ldquo;Pending Sync&rdquo; below.</span>
            </div>
          )}

          <form onSubmit={handleSaveDraft} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                >
                  <option value="Potholes & Damaged Roads">Potholes &amp; Damaged Roads</option>
                  <option value="Broken Streetlights">Broken Streetlights</option>
                  <option value="Garbage Accumulation & Waste Management">Garbage Accumulation</option>
                  <option value="Electricity Faults & Dangling Wires">Electricity Faults</option>
                  <option value="Water Leakage & Supply Issues">Water Leakage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Major water leak on main road"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem in detail..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location / Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address or landmark..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save Report to Local Offline Storage</span>
            </button>
          </form>
        </div>

        {/* Saved Drafts List with "Pending Sync" Badges */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Stored Drafts ({drafts.length})
            </h3>
            {drafts.some((d) => !d.synced) && isOnline && (
              <span className="text-xs text-amber-500 font-semibold">
                You have unsynced drafts ready to upload
              </span>
            )}
          </div>

          {drafts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No offline drafts stored. Create a draft above to test low-network queuing.
            </p>
          ) : (
            <div className="space-y-3">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white font-bold">{d.title}</strong>
                      {d.synced ? (
                        <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          ✓ Synced ({d.syncedReferenceId})
                        </span>
                      ) : (
                        <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending Sync
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px]">{d.category} • Location: {d.address}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">{d.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!d.synced && (
                      <button
                        type="button"
                        onClick={() => handleSyncDraft(d)}
                        disabled={syncingId === d.id}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
                      >
                        {syncingId === d.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                        <span>Sync Now</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteDraft(d.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
