'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  PhoneCall,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import Call112Modal from '@/components/Call112Modal';

export default function FireRescuePage() {
  const [callModalOpen, setCallModalOpen] = useState(false);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-orange-700 via-red-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">
                🔥 Active Fire or Gas Leak?
              </span>
              <h1 className="text-2xl sm:text-4xl font-black">
                Fire Brigade &amp; Rescue Operations
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-xl">
                Immediately move yourself and others to a safe distance out in the open. Dial 101 or 112 without delay.
              </p>
            </div>

            <button
              onClick={() => setCallModalOpen(true)}
              className="w-full md:w-auto shrink-0 bg-white hover:bg-slate-100 text-red-700 font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-5 h-5 fill-red-700" />
              <span>Dial 101 / 112 Fire Rescue</span>
            </button>
          </div>
        </div>

        {/* Safety & Evacuation Protocols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Building Fire Survival Steps
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Never use elevators</strong> during a fire. Always use designated fire exit stairs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Crawl low under smoke:</strong> Smoke and toxic carbon monoxide gases rise. Clean air is 1-2 feet above floor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Check doors before opening:</strong> Feel the doorknob with the back of your hand. If hot, do not open.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Stop, Drop, and Roll:</strong> If clothing catches fire, drop immediately and roll back and forth to smother flames.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Domestic LPG Cylinder Gas Leak Protocol
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Do NOT operate any electrical switches:</strong> Turning lights or fans ON or OFF can create an electrical spark that ignites gas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Open all windows &amp; doors</strong> immediately to dissipate propane/butane vapor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Put the safety cap on the cylinder regulator if accessible without inhaling dense gas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Evacuate premises and call Fire 101 or LPG Emergency 1906.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Official Non-Dispatch Disclaimer (User requirement 5) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
              Fire Dispatch Disclosure:
            </strong>
            RAKSHAK provides safety guidance and verified emergency telephone routing. Never assume a fire crew or water tender has been dispatched until you speak directly with a 101 or 112 emergency control officer and state your exact street and building coordinates.
          </div>
        </div>
      </div>

      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
