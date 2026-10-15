'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  PhoneCall,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Ambulance,
  Flame,
  TrafficCone,
  HeartHandshake,
  Baby,
  AlertTriangle,
  Car,
  Zap,
  Droplet,
  Building2,
  PawPrint,
  HeartPulse,
  Lock,
  Info
} from 'lucide-react';
import { verifiedEmergencyServices } from '@/lib/emergency-data';
import { EmergencyServiceItem } from '@/lib/types';
import Call112Modal from '@/components/Call112Modal';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [callModalOpen, setCallModalOpen] = useState(false);

  const categories = [
    'All',
    'Police',
    'Ambulance & Medical',
    'Fire & Rescue',
    'Traffic Police',
    'Women Safety',
    'Child Protection',
    'Disaster Management',
    'Roadside Assistance',
    'Electricity Faults',
    'Water & Sanitation',
    'Municipal & Civic',
    'Animal Rescue',
    'Mental Health',
    'Public Essential'
  ];

  const areas = ['All', 'Pan-India', 'Delhi NCR', 'Rajasthan', 'Maharashtra', 'Karnataka'];

  const filteredServices = useMemo(() => {
    return verifiedEmergencyServices.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      const matchesArea =
        selectedArea === 'All' ||
        service.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
        service.area.includes('Pan-India');
      const matchesQuery =
        !query ||
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.category.toLowerCase().includes(query.toLowerCase()) ||
        service.number.includes(query) ||
        service.description.toLowerCase().includes(query.toLowerCase());

      return matchesCategory && matchesArea && matchesQuery;
    });
  }, [query, selectedCategory, selectedArea]);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'TrafficCone': return <TrafficCone className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'PawPrint': return <PawPrint className="w-5 h-5" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'Lock': return <Lock className="w-5 h-5" />;
      default: return <ShieldAlert className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Official &amp; Verified Government Helplines
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">
              Emergency Service Directory of India
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verified emergency response and essential public contact numbers sourced directly from Ministry of Home Affairs, Ministry of Health, NDMA, and State Departments. Prioritize 112 for immediate emergencies.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCallModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 (National Emergency)</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 border border-amber-800/80 px-3.5 py-2 rounded-xl">
              <Info className="w-4 h-4 shrink-0" />
              <span>No telephone numbers are simulated or fabricated. All numbers are official Indian public contacts.</span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by service name, number (e.g. 108, 1091), or problem..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition"
              />
            </div>

            {/* Area Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Jurisdiction:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium outline-none"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-400">
                    {getServiceIcon(srv.iconName)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified Official
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {srv.availability}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {srv.category}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5 leading-snug">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {srv.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1 text-slate-500 dark:text-slate-400">
                  <p><strong>Coverage:</strong> {srv.area}</p>
                  <p><strong>Authority:</strong> {srv.source}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`tel:${srv.number}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {srv.number}</span>
                </a>
                {srv.altNumber && (
                  <a
                    href={`tel:${srv.altNumber}`}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-medium py-2.5 px-3 rounded-xl text-xs flex items-center gap-1 transition"
                    title={`Alternative: ${srv.altNumber}`}
                  >
                    <span>Alt: {srv.altNumber}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
              No matching verified service found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              For any urgent emergency, dial India&rsquo;s national unified number 112 immediately.
            </p>
            <button
              onClick={() => { setQuery(''); setSelectedCategory('All'); setSelectedArea('All'); }}
              className="mt-4 bg-slate-800 text-white text-xs px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading Directory...</div>}>
      <DirectoryContent />
    </React.Suspense>
  );
}
