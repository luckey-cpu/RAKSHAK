'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  PhoneCall,
  Menu,
  X,
  Languages,
  Eye,
  Type,
  MapPin,
  FileText,
  Search,
  WifiOff,
  UserCheck
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import Call112Modal from './Call112Modal';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, accessibility, setContrast, setFontSize, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/emergency', label: t('navEmergency') },
    { href: '/directory', label: t('navDirectory') },
    { href: '/civic-report', label: t('navCivic') },
    { href: '/accident-report', label: t('navAccident') },
    { href: '/medical', label: t('navMedical') },
    { href: '/community-map', label: t('navCommunityMap') },
    { href: '/track', label: t('navTrack') },
    { href: '/offline', label: t('navOffline') },
  ];

  return (
    <>
      {/* Topmost National Emergency Bar */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-1.5 px-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>🚨 <strong>National Emergency Helpline:</strong> Police, Fire, Ambulance &amp; Disaster Relief</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCallModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 font-bold px-3 py-1 rounded-full shadow-sm text-xs transition transform hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-red-700" />
              <span>{t('call112Short')}</span>
            </button>

            {/* Accessibility Controls */}
            <div className="hidden md:flex items-center gap-2 border-l border-red-500/60 pl-3">
              {/* Contrast */}
              <button
                onClick={() => setContrast(accessibility.contrast === 'normal' ? 'high' : 'normal')}
                title="Toggle High Contrast"
                className="p-1 hover:bg-red-800/60 rounded text-xs flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px]">{accessibility.contrast === 'high' ? 'Normal' : 'High Contrast'}</span>
              </button>

              {/* Font Size */}
              <div className="flex items-center gap-0.5 bg-red-800/60 rounded px-1.5 py-0.5">
                <Type className="w-3 h-3 text-red-200" />
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-1 text-[11px] font-semibold ${accessibility.fontSize === 'normal' ? 'underline font-bold text-amber-300' : 'text-red-200'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-1 text-[12px] font-semibold ${accessibility.fontSize === 'large' ? 'underline font-bold text-amber-300' : 'text-red-200'}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-1 text-[13px] font-semibold ${accessibility.fontSize === 'xlarge' ? 'underline font-bold text-amber-300' : 'text-red-200'}`}
                >
                  A++
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-red-900/60 rounded-full px-2 py-0.5 text-[11px]">
                <Languages className="w-3 h-3" />
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-1 rounded ${language === 'en' ? 'bg-white text-red-800 font-bold' : 'text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-1 rounded ${language === 'hi' ? 'bg-white text-red-800 font-bold' : 'text-white'}`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('hinglish')}
                  className={`px-1 rounded ${language === 'hinglish' ? 'bg-white text-red-800 font-bold' : 'text-white'}`}
                >
                  Hinglish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-7 z-30 shadow-md">
        {/* Tricolor hairline accent */}
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white flex items-center gap-1">
                  RAKSHAK
                  <span className="text-[10px] bg-red-600/80 px-1.5 py-0.5 rounded text-white font-medium ml-1">
                    INDIA
                  </span>
                </span>
                <span className="text-[10px] block text-slate-400 font-medium tracking-tight">
                  {t('brandTagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-800 text-amber-400 border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side CTA & Admin */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/admin"
                className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('navAdmin')}</span>
              </Link>

              <button
                onClick={() => setCallModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 pulse-emergency transition transform hover:scale-105"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 112</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setCallModalOpen(true)}
                className="bg-red-600 text-white p-2 rounded-lg"
                aria-label="Call 112"
              >
                <PhoneCall className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2">
            {/* Mobile Accessibility Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Language:</span>
              <div className="flex gap-1">
                {(['en', 'hi', 'hinglish'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2 py-0.5 rounded text-xs ${language === l ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
                  >
                    {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'Hinglish'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 pt-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                      isActive ? 'bg-red-600 text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-400 bg-slate-800/80 border border-slate-700 flex items-center justify-between mt-2"
              >
                <span>{t('navAdmin')}</span>
                <UserCheck className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Emergency 112 Confirmation Modal */}
      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </>
  );
}
