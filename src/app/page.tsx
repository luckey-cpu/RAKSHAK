'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Car,
  Search,
  MapPin,
  Mic,
  WifiOff,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Ambulance,
  Flame,
  Shield,
  Zap,
  Droplet,
  Eye,
  FileCheck,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import Call112Modal from '@/components/Call112Modal';

export default function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [callModalOpen, setCallModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // If query looks like a reference ID (e.g. RAK-2026-XXXXX), redirect to track
    if (q.toUpperCase().startsWith('RAK-') || /^\d{5}$/.test(q)) {
      router.push(`/track?id=${encodeURIComponent(q)}`);
    } else {
      router.push(`/directory?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden py-12 md:py-20 border-b border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute -top-24 right-10 w-72 h-72 bg-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* National Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All-in-One Indian Emergency &amp; Citizen Assistance Portal</span>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              RAKSHAK <span className="text-red-500">रक्षक</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-amber-400 tracking-wide">
              &ldquo;{t('brandTagline')}&rdquo;
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              One unified platform for emergency calls, road accidents, civic grievances, public services discovery, and AI assistance across all States and UTs of India.
            </p>

            {/* Prominent Call 112 CTA & Emergency Assistant */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCallModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-lg py-4 px-8 rounded-2xl shadow-xl shadow-red-600/40 pulse-emergency transition transform hover:scale-105"
              >
                <PhoneCall className="w-6 h-6 fill-white" />
                <span>Call 112 (National Emergency)</span>
              </button>

              <Link
                href="/emergency"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base py-4 px-6 rounded-2xl border border-slate-700 transition"
              >
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Guided Emergency Triage</span>
              </Link>
            </div>

            {/* Universal Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-slate-950/80 border-2 border-slate-700 focus:border-amber-400 text-white rounded-2xl pl-12 pr-28 py-3.5 text-sm sm:text-base outline-none transition placeholder-slate-400 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow"
                >
                  Search
                </button>
              </form>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
                <span>Quick search:</span>
                <button onClick={() => setSearchQuery('Pothole')} className="hover:text-amber-400 underline">Potholes</button>
                <span>•</span>
                <button onClick={() => setSearchQuery('Hospital')} className="hover:text-amber-400 underline">Trauma Centers</button>
                <span>•</span>
                <button onClick={() => setSearchQuery('1091')} className="hover:text-amber-400 underline">Women Helpline</button>
                <span>•</span>
                <button onClick={() => setSearchQuery('RAK-2026-84920')} className="hover:text-amber-400 underline">Sample Complaint RAK-2026-84920</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EMERGENCY QUICK HELPLINE STRIP */}
      <section className="bg-slate-900 border-b border-slate-800 py-4 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-[700px]">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span>Direct Helplines:</span>
          </div>

          <div className="flex items-center gap-3">
            <a href="tel:112" className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-900/60 transition">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>112 Unified</span>
            </a>
            <a href="tel:108" className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">
              <Ambulance className="w-3.5 h-3.5 text-amber-400" />
              <span>108 Ambulance</span>
            </a>
            <a href="tel:101" className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>101 Fire</span>
            </a>
            <a href="tel:1091" className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">
              <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
              <span>1091 Women</span>
            </a>
            <a href="tel:1098" className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>1098 Childline</span>
            </a>
            <a href="tel:1912" className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>1912 Electricity</span>
            </a>
            <a href="tel:1033" className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-700 transition">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>1033 Highway</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICE ENTRY CARDS (Required by item 1) */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Direct Citizen Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Emergency &amp; Public Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Fast, intuitive access designed for stressful situations. Select an action below:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Emergency Services */}
            <Link
              href="/directory"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition flex items-center justify-between">
                <span>Emergency Services</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Directory of 14 verified categories: Police (112), Ambulance (108), Fire (101), Women Safety (1091), Child Protection (1098), and Disaster teams.
              </p>
              <span className="inline-block mt-4 text-[11px] font-bold text-red-600 dark:text-red-400">
                Browse Verified Helplines →
              </span>
            </Link>

            {/* Card 2: Report Civic Problem */}
            <Link
              href="/civic-report"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition flex items-center justify-between">
                <span>Report a Civic Problem</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Report potholes, broken streetlights, garbage dumps, water leaks, open manholes, and dangling electrical wires with photos and GPS.
              </p>
              <span className="inline-block mt-4 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                File Civic Grievance →
              </span>
            </Link>

            {/* Card 3: Report an Accident */}
            <Link
              href="/accident-report"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-600 rounded-2xl p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition flex items-center justify-between">
                <span>Report an Accident</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Dedicated fast reporting for bystanders. Upload scene photos, indicate injuries, and access immediate Call 112 dialing.
              </p>
              <span className="inline-block mt-4 text-[11px] font-bold text-red-600 dark:text-red-400">
                Submit Accident Report →
              </span>
            </Link>

            {/* Card 4: Find Hospitals & Ambulances */}
            <Link
              href="/medical"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition flex items-center justify-between">
                <span>Hospitals &amp; Ambulances</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Locate verified government trauma centers (AIIMS, Safdarjung, SMS Jaipur, KEM Mumbai) and emergency ambulance dispatches.
              </p>
              <span className="inline-block mt-4 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Locate Trauma Centers →
              </span>
            </Link>

            {/* Card 5: Track My Complaint */}
            <Link
              href="/track"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition flex items-center justify-between">
                <span>Track My Complaint</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Check status with reference ID (e.g. RAK-2026-84920). View official remarks and Before &amp; After resolution photographs.
              </p>
              <span className="inline-block mt-4 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                Track Live Status →
              </span>
            </Link>

            {/* Card 6: Community Issue Map */}
            <Link
              href="/community-map"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition flex items-center justify-between">
                <span>Community Issue Map</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                View neighbourhood problem clusters in Jaipur &amp; Metros. Upvote issues to demonstrate community urgency to municipal bodies.
              </p>
              <span className="inline-block mt-4 text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                Explore Community Map →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SEVEN UNIQUE SELLING PROPOSITIONS (USPs) SHOWCASE */}
      <section className="py-14 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Innovative Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              7 Distinctive Features Built for India
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Engineered for real ground conditions: voice reporting for non-typists, offline mode for low-network zones, community grouping, and verified proof of resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* USP 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">1. Bolkar Batao (Voice Reporting)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Users speak in Hindi, English, or Hinglish (&ldquo;Mansarovar mein road par bada gaddha hai&rdquo;). RAKSHAK automatically extracts the category, location, and problem.
              </p>
              <Link href="/civic-report?voice=true" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3 hover:underline">
                Try Voice Reporting <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* USP 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">2. Smart Complaint Assistant</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suggests correct municipal category in real time, checks if essential details (landmarks, photos) are missing, and previews summary before submission.
              </p>
              <Link href="/civic-report" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3 hover:underline">
                See Guided Assistant <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* USP 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl">
                  <WifiOff className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">3. Low-Network / Offline Mode</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Saves emergency numbers locally and lets citizens prepare draft reports that automatically sync when internet connectivity returns.
              </p>
              <Link href="/offline" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3 hover:underline">
                Open Offline Storage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* USP 4 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">4. Community Issue Map</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Groups duplicate reports in the same neighbourhood into a single issue. Citizens can click &ldquo;+1 Upvote&rdquo; to demonstrate widespread impact.
              </p>
              <Link href="/community-map" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3 hover:underline">
                View Jaipur Cluster Map <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* USP 5 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-pink-500/20 text-pink-400 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">5. Accessibility &amp; Family Assist</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                High contrast, large text modes, multi-lingual navigation, plus &ldquo;Report for someone else&rdquo; flow on behalf of elderly or vulnerable citizens.
              </p>
              <Link href="/civic-report" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3 hover:underline">
                File for Relative <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* USP 6 & 7 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white">6 &amp; 7. Smart Priority &amp; Proof of Resolution</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Admin dashboard dynamically ranks live electrical hazards above routine streetlights, and publishes authentic Before/After photos when marked Resolved.
              </p>
              <Link href="/track?id=RAK-2026-84920" className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-3 hover:underline">
                View Proof of Resolution Demo <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROOF OF RESOLUTION LIVE SPOTLIGHT */}
      <section className="py-12 bg-white dark:bg-slate-950 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                ✓ Public Trust Showcase
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                Proof of Resolution: Mansarovar Madhyam Marg Road
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Complaint Reference: <code className="text-amber-400 font-mono font-bold">RAK-2026-84920</code> • Resolved by JDA Road Maintenance Ward 42
              </p>
            </div>
            <Link
              href="/track?id=RAK-2026-84920"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <span>View Full Audit Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Before & After comparison grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-950 p-3 rounded-2xl border border-red-500/40">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sample-pothole-before.svg"
                  alt="Damaged Pothole Before Repair"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-red-400">BEFORE (Reported 12 Oct)</span>
                <span className="text-[11px] text-slate-400">Citizen Photo Attached</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sample-pothole-after.svg"
                  alt="Repaired Road After Patching"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">AFTER (Resolved 14 Oct)</span>
                <span className="text-[11px] text-slate-400">Inspected by JDA Engineer</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <strong className="text-white block mb-1">Official Resolution Officer Note:</strong>
            &ldquo;Ward 42 repair team inspected the road on 14 Oct. Asphalt patch work and leveling completed. Inspected by JDA junior engineer.&rdquo;
          </div>
        </div>
      </section>

      {/* Emergency Call Modal */}
      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
