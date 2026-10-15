'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  PhoneCall,
  TrafficCone,
  Car,
  AlertTriangle,
  Info,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import Call112Modal from '@/components/Call112Modal';

export default function PoliceTrafficPage() {
  const [callModalOpen, setCallModalOpen] = useState(false);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Law Enforcement &amp; Road Safety Channels
              </span>
              <h1 className="text-2xl sm:text-4xl font-black">
                Police &amp; Traffic Authority Assistance
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct verified contact channels for National Police Emergency 112, State Traffic Police 1095, Highway Patrol 1033, and Cyber Crime 1930.
              </p>
            </div>

            <button
              onClick={() => setCallModalOpen(true)}
              className="w-full md:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 112 (Police PCR)</span>
            </button>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Emergency Crime & PCR */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Active Threat / Crime Response
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                National Police Control Room (112 / 100)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Connects directly to the state ERSS (Emergency Response Support System) dispatch center for PCR vans, mobile patrol units, and station officers.
              </p>
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <p>• Robbery, physical violence, or assault in progress</p>
                <p>• Missing child or person under threat</p>
                <p>• Unattended suspicious luggage in public places</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href="tel:112"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 112 for Police</span>
              </a>
            </div>
          </div>

          {/* Card 2: Traffic Police & Road Hazards */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Road Safety &amp; Congestion
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                Traffic Police &amp; Highway Patrol (1095 / 1033)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Dedicated helplines for reporting dangerous traffic signals, overturned vehicles, severe gridlocks, and highway towing assistance.
              </p>
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <p>• Broken traffic lights causing high-speed junction hazards</p>
                <p>• Road blockages, fallen trees, or oil slicks</p>
                <p>• National Highway breakdown or towing on NHAI routes (1033)</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <a
                href="tel:1095"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <TrafficCone className="w-3.5 h-3.5" />
                <span>Traffic 1095</span>
              </a>
              <a
                href="tel:1033"
                className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Car className="w-3.5 h-3.5" />
                <span>NHAI 1033</span>
              </a>
            </div>
          </div>

          {/* Card 3: Women Police Helpline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                Specialized Police Desk
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                Women Helpline 1091 / 181
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Dedicated 24x7 desk staffed by female police officers and counsellors for immediate safety, stalker reports, and domestic distress.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href="tel:1091"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Women Desk 1091</span>
              </a>
            </div>
          </div>

          {/* Card 4: National Cyber Crime */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Financial Cyber Fraud
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                National Cyber Crime 1930
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Operated by Indian Cyber Crime Coordination Centre (I4C). Report unauthorized UPI or bank debits within the golden hour to freeze stolen funds.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href="tel:1930"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Call Cyber Helpline 1930</span>
              </a>
            </div>
          </div>
        </div>

        {/* Clear Platform Identity Disclosure (User requirement 6) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
              Platform Identity Disclaimer:
            </strong>
            RAKSHAK is an independent civic and emergency facilitation portal. It does not represent or act as the Police Department of any State or Union Territory. For reporting crimes requiring formal FIR registration or emergency PCR intervention, citizens must contact the official police stations or dial 112 directly.
          </div>
        </div>
      </div>

      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
