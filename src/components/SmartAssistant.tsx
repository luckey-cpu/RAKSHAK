'use client';

import React from 'react';
import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface SmartAssistantProps {
  description: string;
  category: string;
  address: string;
  landmark: string;
  photosCount: number;
  reporterPhone: string;
  onSelectSuggestedCategory?: (cat: string) => void;
}

export default function SmartAssistant({
  description,
  category,
  address,
  landmark,
  photosCount,
  reporterPhone,
  onSelectSuggestedCategory
}: SmartAssistantProps) {
  // Detect category suggestions based on description
  const detectCategory = (text: string) => {
    const l = text.toLowerCase();
    if (l.includes('gaddha') || l.includes('pothole') || l.includes('sadak')) return 'Potholes & Damaged Roads';
    if (l.includes('light') || l.includes('batti') || l.includes('dark')) return 'Broken Streetlights';
    if (l.includes('kachra') || l.includes('garbage') || l.includes('dustbin')) return 'Garbage Accumulation & Waste Management';
    if (l.includes('paani') || l.includes('water') || l.includes('pipe')) return 'Water Leakage & Supply Issues';
    if (l.includes('wire') || l.includes('tar') || l.includes('bijli') || l.includes('spark')) return 'Electricity Faults & Dangling Wires';
    if (l.includes('manhole') || l.includes('dhakkan')) return 'Open Manholes & Infrastructure Risks';
    if (l.includes('traffic') || l.includes('signal')) return 'Broken Traffic Lights & Road Hazards';
    return null;
  };

  const suggestedCategory = detectCategory(description);

  // Quality score & Missing details check
  const checks = [
    {
      label: 'Problem Description (min 15 characters)',
      passed: description.trim().length >= 15,
      hint: 'Add more details about size, depth, or specific danger.'
    },
    {
      label: 'Accurate Street Address or Area',
      passed: address.trim().length >= 5,
      hint: 'Specify colony, sector, or road name.'
    },
    {
      label: 'Nearby Landmark (Crucial for Field Officers)',
      passed: landmark.trim().length >= 3,
      hint: 'e.g., Near City Park Gate 2, Opposite Govt School'
    },
    {
      label: 'Supporting Photograph Evidence',
      passed: photosCount > 0,
      hint: 'Reports with photos are resolved 3x faster by municipal wards.'
    },
    {
      label: 'Citizen Contact Number',
      passed: reporterPhone.trim().length >= 10,
      hint: 'Helps inspection engineers verify location if needed.'
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const completenessPercentage = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              Smart Complaint Assistant
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                RAKSHAK Guidance
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Helps ensure your complaint is complete and actionable for civic engineers.
            </p>
          </div>
        </div>

        {/* Quality Score Gauge */}
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500 block">Report Quality</span>
          <span
            className={`text-sm font-extrabold ${
              completenessPercentage >= 80
                ? 'text-emerald-600 dark:text-emerald-400'
                : completenessPercentage >= 50
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {completenessPercentage}% Complete
          </span>
        </div>
      </div>

      {/* Category Suggestion Alert */}
      {suggestedCategory && suggestedCategory !== category && onSelectSuggestedCategory && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Suggested Category: &ldquo;{suggestedCategory}&rdquo;
              </p>
              <p className="text-amber-800 dark:text-amber-300 mt-0.5">
                Based on your description, this issue matches civic department: {suggestedCategory}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectSuggestedCategory(suggestedCategory)}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
          >
            Use This Category
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            completenessPercentage >= 80
              ? 'bg-emerald-500'
              : completenessPercentage >= 50
              ? 'bg-amber-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${completenessPercentage}%` }}
        ></div>
      </div>

      {/* Completeness Checklist */}
      <div className="space-y-2 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
          Completeness Checklist:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checks.map((c, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border flex items-start gap-2 ${
                c.passed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {c.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${c.passed ? 'font-bold' : ''}`}>{c.label}</p>
                {!c.passed && <p className="text-[10px] text-slate-500 mt-0.5">{c.hint}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
