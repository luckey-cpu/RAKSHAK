'use client';

import React, { useState } from 'react';
import {
  Building2,
  ExternalLink,
  Search,
  ShieldCheck,
  Globe,
  Info,
  CheckCircle,
  FileText
} from 'lucide-react';
import { verifiedPublicServices, PublicServicePortal } from '@/lib/emergency-data';

export default function PublicServicesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Citizen Grievance', 'Transport & Highway', 'Healthcare', 'Sanitation', 'Digital Identity'];

  const filtered = verifiedPublicServices.filter((srv) => {
    const matchesCat = category === 'All' || srv.category === category;
    const matchesQ =
      !query ||
      srv.name.toLowerCase().includes(query.toLowerCase()) ||
      srv.description.toLowerCase().includes(query.toLowerCase()) ||
      srv.category.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            Official Government Portals Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-1">
            Verified Public Service &amp; Grievance Portals
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Direct authenticated links to official central and state government citizen services, grievance redressal platforms (CPGRAMS, Swachhata), healthcare registries, and digital identity portals.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search portal name (e.g. CPGRAMS, Swachhata, Parivahan)..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-slate-500">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  category === c
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((portal) => (
            <div
              key={portal.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full">
                    {portal.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {portal.jurisdiction}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 leading-tight">
                  {portal.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {portal.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <strong className="block text-slate-700 dark:text-slate-300 mb-0.5">Disclaimer:</strong>
                  {portal.officialDisclaimer}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Non-Issuance Disclaimer (User requirement 12) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
              Government Document &amp; Records Disclaimer:
            </strong>
            RAKSHAK does not issue government identity cards, approve driver’s licenses, or access official municipal databases without authenticated user consent. All external portal links direct to verified .gov.in or .nic.in official web platforms.
          </div>
        </div>
      </div>
    </div>
  );
}
