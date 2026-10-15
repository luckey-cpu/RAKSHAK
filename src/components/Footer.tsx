'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, PhoneCall, ExternalLink, Heart, Globe, Lock } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 mt-auto">
      {/* Emergency Strip */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Official Emergency Helplines of India
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dial directly from any mobile or landline across all States and Union Territories.
              </p>
            </div>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-red-700/30 transition transform hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Emergency 112 (National Call)</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 text-xs">
            <a href="tel:112" className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 block transition">
              <span className="text-[10px] text-slate-400 block">All Emergency</span>
              <strong className="text-red-400 text-sm">112</strong>
            </a>
            <a href="tel:108" className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 block transition">
              <span className="text-[10px] text-slate-400 block">Ambulance</span>
              <strong className="text-amber-400 text-sm">108 / 102</strong>
            </a>
            <a href="tel:101" className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 block transition">
              <span className="text-[10px] text-slate-400 block">Fire Brigade</span>
              <strong className="text-orange-400 text-sm">101</strong>
            </a>
            <a href="tel:1091" className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 block transition">
              <span className="text-[10px] text-slate-400 block">Women Helpline</span>
              <strong className="text-pink-400 text-sm">1091 / 181</strong>
            </a>
            <a href="tel:1098" className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 block transition">
              <span className="text-[10px] text-slate-400 block">Child Protection</span>
              <strong className="text-blue-400 text-sm">1098</strong>
            </a>
            <a href="tel:1912" className="bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 block transition">
              <span className="text-[10px] text-slate-400 block">Electricity Fault</span>
              <strong className="text-yellow-400 text-sm">1912</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">RAKSHAK</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              &ldquo;Har Mushkil Mein, Aapke Saath.&rdquo; A unified Indian civic and emergency-assistance platform built for citizens across Bharat.
            </p>
            <div className="pt-2 text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Citizen Records &amp; Privacy Shield</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs text-amber-400">
              Emergency &amp; Reporting
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/emergency" className="hover:text-white transition">Emergency Guided Triage</Link>
              </li>
              <li>
                <Link href="/civic-report" className="hover:text-white transition">Report Civic Problem (Roads, Light, Drain)</Link>
              </li>
              <li>
                <Link href="/accident-report" className="hover:text-white transition">Accident Reporting with Photos</Link>
              </li>
              <li>
                <Link href="/medical" className="hover:text-white transition">Hospitals &amp; Ambulance Finder</Link>
              </li>
              <li>
                <Link href="/community-map" className="hover:text-white transition">Community Issue Map (Jaipur / Metros)</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition">Track Complaint &amp; Proof of Resolution</Link>
              </li>
            </ul>
          </div>

          {/* Directories & USPs */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-xs text-amber-400">
              Directories &amp; Features
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/directory" className="hover:text-white transition">Verified Helpline Directory (14 Categories)</Link>
              </li>
              <li>
                <Link href="/public-services" className="hover:text-white transition">Government Portals (CPGRAMS, Swachhata)</Link>
              </li>
              <li>
                <Link href="/offline" className="hover:text-white transition">Low-Network / Offline Mode</Link>
              </li>
              <li>
                <Link href="/civic-report?voice=true" className="hover:text-white transition">Bolkar Batao Voice Input</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">Admin Portal (Smart Priority Queue)</Link>
              </li>
            </ul>
          </div>

          {/* Official Disclaimers */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs text-red-400">Official Disclaimer</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              RAKSHAK is an independent public assistance platform. RAKSHAK facilitates structured reporting, issue tracking, and helpline discovery. It does not replace the official emergency dispatchers of Government of India or Municipal Corporations. For immediate life risk, call 112 directly.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 RAKSHAK. Built for public safety and citizen empowerment across India.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for India
            </span>
          </div>
        </div>
      </div>

      {/* Tricolor baseline */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>
    </footer>
  );
}
