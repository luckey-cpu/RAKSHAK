'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ThumbsUp,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Compass,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';
import { CommunityIssue } from '@/lib/types';

export default function CommunityMapPage() {
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIssue, setActiveIssue] = useState<CommunityIssue | null>(null);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [upvoting, setUpvoting] = useState<string | null>(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      const data = await res.json();
      if (data.success && data.data) {
        setIssues(data.data);
        if (data.data.length > 0) {
          setActiveIssue(data.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load community issues:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // Load previously upvoted issues from local storage
    try {
      const saved = localStorage.getItem('rakshak_upvoted');
      if (saved) setUpvotedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const handleUpvote = async (issueId: string) => {
    if (upvotedIds.includes(issueId) || upvoting) return;

    setUpvoting(issueId);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIssues((prev) =>
          prev.map((i) => (i.id === issueId ? data.data : i))
        );
        if (activeIssue?.id === issueId) {
          setActiveIssue(data.data);
        }
        const updated = [...upvotedIds, issueId];
        setUpvotedIds(updated);
        try {
          localStorage.setItem('rakshak_upvoted', JSON.stringify(updated));
        } catch {}
      }
    } catch (e) {
      console.error('Upvote failed:', e);
    } finally {
      setUpvoting(null);
    }
  };

  const filteredIssues = issues.filter((i) => {
    const matchesCity = selectedCity === 'All' || i.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCat = selectedCategory === 'All' || i.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesCity && matchesCat;
  });

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              USP #4: Neighbourhood Problem Clustering
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">
              Community Issue Map &amp; Citizen Upvotes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When multiple citizens report the same pothole, damaged streetlight, or open drain in an area, RAKSHAK groups them into one issue. Citizens can add a &ldquo;+1 Upvote&rdquo; to demonstrate collective urgency to local authorities.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/civic-report"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow"
            >
              <span>Report a Problem in Your Neighbourhood</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
              Demo Hotspots: Jaipur (Mansarovar, C-Scheme, Malviya Nagar), New Delhi CP, Mumbai Bandra
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Filter City:</span>
            {['All', 'Jaipur', 'New Delhi', 'Mumbai'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  selectedCity === c
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Category:</span>
            {['All', 'Pothole', 'Electric', 'Manhole', 'Streetlight', 'Water'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Layout & Side-by-side Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Viewer Panel (Visual Geo Simulator) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative min-h-[460px] overflow-hidden">
            {/* Map Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 z-10">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">
                  Active Issue Clusters: {filteredIssues.length} spots
                </span>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                Interactive Grid View
              </span>
            </div>

            {/* Stylized Visual City Map Canvas */}
            <div className="relative flex-1 my-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl border border-slate-800 p-4 flex flex-col justify-center overflow-hidden">
              {/* Grid Lines simulating city streets */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Pins placed across map */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredIssues.map((issue) => {
                  const isSelected = activeIssue?.id === issue.id;
                  return (
                    <div
                      key={issue.id}
                      onClick={() => setActiveIssue(issue)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition transform hover:scale-102 ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                          : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                              issue.urgency === 'critical'
                                ? 'bg-red-600 text-white'
                                : issue.urgency === 'high'
                                ? 'bg-orange-500 text-white'
                                : 'bg-amber-400 text-slate-950'
                            }`}
                          >
                            {issue.reportCount}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                              {issue.city} • {issue.category}
                            </span>
                            <h4 className="font-bold text-xs text-white leading-tight">
                              {issue.title}
                            </h4>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            issue.status === 'Resolved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-amber-300'
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {issue.address}
                        </span>
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {issue.upvotedCount} upvotes
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center">
              Click any cluster pin to inspect details, view linked complaints, or add your citizen upvote.
            </div>
          </div>

          {/* Active Issue Details Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            {activeIssue ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-800">
                    {activeIssue.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {activeIssue.city}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                  {activeIssue.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{activeIssue.address}, {activeIssue.city}</span>
                </p>

                {/* Citizen grouping metrics */}
                <div className="grid grid-cols-2 gap-3 py-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block">Citizens Reported</span>
                    <strong className="text-xl font-black text-amber-500">
                      {activeIssue.reportCount}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-500 block">Community Upvotes</span>
                    <strong className="text-xl font-black text-emerald-500">
                      {activeIssue.upvotedCount}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p><strong>Status:</strong> {activeIssue.status}</p>
                  <p><strong>Urgency:</strong> {activeIssue.urgency.toUpperCase()}</p>
                  {activeIssue.reportsIncluded.length > 0 && (
                    <div className="pt-2">
                      <strong className="block mb-1 text-[11px] text-slate-500">Linked Reference Reports:</strong>
                      <div className="flex flex-wrap gap-1">
                        {activeIssue.reportsIncluded.map((rid) => (
                          <Link
                            key={rid}
                            href={`/track?id=${rid}`}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700"
                          >
                            {rid} →
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upvote Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleUpvote(activeIssue.id)}
                    disabled={upvotedIds.includes(activeIssue.id) || upvoting === activeIssue.id}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow ${
                      upvotedIds.includes(activeIssue.id)
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>
                      {upvotedIds.includes(activeIssue.id)
                        ? '✓ You Upvoted This Issue'
                        : '+1 I Also Face This Issue'}
                    </span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    Upvoting helps municipal ward officers allocate asphalt and crews to the most critical spots first.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select an issue on the map to inspect details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
