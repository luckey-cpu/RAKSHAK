'use client';

import React from 'react';
import { PhoneCall, ShieldAlert, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface Call112ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Call112Modal({ isOpen, onClose }: Call112ModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-emergency-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-red-600 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Top Emergency Indicator */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>

        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-xl">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 id="modal-emergency-title" className="text-xl font-bold text-slate-900 dark:text-white">
              {t('call112ConfirmTitle')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {t('call112ConfirmText')}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3.5 mb-6 text-xs text-amber-900 dark:text-amber-200">
          <p className="font-semibold mb-1">⚠️ Important Emergency Protocol:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Keep your current location, landmark, and number of people involved ready.</li>
            <li>Stay calm and speak clearly in your native language.</li>
            <li>Do not disconnect until the emergency operator advises you to do so.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:112"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 active:scale-98 transition shadow-lg shadow-red-600/30 text-base"
          >
            <PhoneCall className="w-5 h-5" />
            {t('proceedCall')}
          </a>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
