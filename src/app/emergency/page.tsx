'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  ShieldAlert,
  Ambulance,
  Flame,
  Car,
  Shield,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import Call112Modal from '@/components/Call112Modal';

type EmergencyType = 'medical' | 'fire' | 'accident' | 'crime' | 'women' | 'disaster';

export default function EmergencyPage() {
  const [selectedType, setSelectedType] = useState<EmergencyType>('medical');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [isVictimConscious, setIsVictimConscious] = useState<string>('yes');
  const [isInSafePlace, setIsInSafePlace] = useState<string>('yes');

  const emergencyGuides: Record<
    EmergencyType,
    {
      title: string;
      primaryNumber: string;
      primaryLabel: string;
      tag: string;
      immediateSteps: string[];
      firstAidTip: string;
      criticalWarning: string;
    }
  > = {
    medical: {
      title: 'Medical & Cardiac Emergency',
      primaryNumber: '112',
      primaryLabel: 'Call 112 / 108 Medical Dispatch',
      tag: 'Critical Medical',
      immediateSteps: [
        'Call 112 or 108 immediately if the patient is unresponsive, having chest pressure, or difficulty breathing.',
        'If unconscious and not breathing normally: Begin CPR immediately (push hard and fast in the center of the chest at 100-120 beats per minute).',
        'Do not give water or food to an unconscious patient.',
        'Keep the patient warm and loosen tight clothing around the neck and waist.'
      ],
      firstAidTip: 'CPR: Place both hands centered on the breastbone. Depress 2 inches deep, allowing full recoil between compressions.',
      criticalWarning: 'Never wait to see if chest pain or stroke symptoms improve on their own. Every minute is vital.'
    },
    accident: {
      title: 'Severe Road Accident & Collision',
      primaryNumber: '112',
      primaryLabel: 'Call 112 Road Emergency',
      tag: 'Trauma & Police',
      immediateSteps: [
        'Ensure your own safety first before approaching the vehicle. Turn on your vehicle hazards.',
        'Call 112 immediately to notify Police and Trauma Ambulance.',
        'Do not move an injured victim unless there is imminent danger of fire or explosion (risk of spinal damage).',
        'If severe bleeding is present: Apply firm, continuous pressure with a clean cloth or garment directly over the wound.'
      ],
      firstAidTip: 'Bleeding Control: Firm, unbroken pressure for 10 uninterrupted minutes stops most arterial and venous bleeds.',
      criticalWarning: 'Under Indian Good Samaritan Law (Motor Vehicles Act), bystanders who assist accident victims are legally protected from police harassment.'
    },
    fire: {
      title: 'Fire Outbreak & Gas Leakage',
      primaryNumber: '101',
      primaryLabel: 'Call 101 / 112 Fire Brigade',
      tag: 'Fire & Rescue',
      immediateSteps: [
        'Evacuate the building immediately. Never use elevators during a fire.',
        'Crawl low under smoke: Clean, breathable air is near the floor.',
        'If clothes catch fire: STOP, DROP, and ROLL to extinguish flames.',
        'For LPG gas leakage: Do not switch any electrical appliances on or off. Open all doors and windows, and isolate the cylinder regulator.'
      ],
      firstAidTip: 'Burn Treatment: Hold burned skin under cool running tap water for 10-20 minutes. Do NOT apply ice, butter, or toothpaste.',
      criticalWarning: 'Do not re-enter a burning structure under any circumstance to retrieve belongings.'
    },
    crime: {
      title: 'Active Crime, Assault or Threat',
      primaryNumber: '112',
      primaryLabel: 'Call 112 Police Emergency',
      tag: 'Police Protection',
      immediateSteps: [
        'Move to a well-lit, populated area or lock yourself in a secure room immediately.',
        'Call 112. Speak in a low, clear whisper if you are in hiding.',
        'Observe details safely: perpetrator height, clothing, vehicle registration number, and direction of travel.',
        'Do not confront armed or violent individuals.'
      ],
      firstAidTip: 'Personal Safety: Trust your instincts. Create noise or shout for help if trapped in a public corridor.',
      criticalWarning: 'If speaking is dangerous, you can keep the 112 line open; emergency dispatchers will attempt geolocation ping.'
    },
    women: {
      title: 'Women in Distress / Immediate Safety',
      primaryNumber: '1091',
      primaryLabel: 'Call 1091 / 112 Women Helpline',
      tag: '24x7 Dedicated',
      immediateSteps: [
        'Dial 1091 or 112 immediately. These lines are monitored by specialized PCR vans.',
        'If inside a taxi or auto-rickshaw feeling threatened, share your live GPS location with family immediately and instruct driver to stop near a PCR booth or petrol pump.',
        'The 181 Women in Distress Helpline is also available 24x7 for counselling and legal intervention.'
      ],
      firstAidTip: 'Safe Haven: Petrol pumps, metro station gates, and 24x7 pharmacy counters are safe public points to seek immediate sanctuary.',
      criticalWarning: 'RAKSHAK does not store your location without permission. In emergency, call 112 directly for real-time PCR van response.'
    },
    disaster: {
      title: 'Disaster, Structural Collapse & Flood',
      primaryNumber: '1078',
      primaryLabel: 'Call 1078 / 112 NDRF Helpline',
      tag: 'NDRF & Relief',
      immediateSteps: [
        'During earthquake: DROP, COVER, and HOLD ON under a sturdy table. Stay away from glass windows and power poles.',
        'During urban flooding: Move to highest accessible floor. Disconnect main power breaker to prevent water electrocution.',
        'Call 1078 (NDRF Operations Center) or 1070 (State Relief Cell).'
      ],
      firstAidTip: 'Water Safety: Never attempt to drive or walk through moving floodwater. Just 6 inches of rapid water can sweep away adults.',
      criticalWarning: 'Stay tuned to official All India Radio / NDMA broadcasts for evacuation routes.'
    }
  };

  const currentGuide = emergencyGuides[selectedType];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Sticky Urgent Emergency Action Strip */}
        <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-red-500">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              🚨 Immediate Life Danger?
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Never Delay an Emergency Call
            </h1>
            <p className="text-xs sm:text-sm text-red-100 max-w-xl">
              Do not spend time filling out forms or answering non-essential questions if someone is hurt, unresponsive, or in immediate peril.
            </p>
          </div>

          <button
            onClick={() => setCallModalOpen(true)}
            className="w-full md:w-auto shrink-0 bg-white hover:bg-slate-100 text-red-700 font-black text-base py-4 px-8 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition transform hover:scale-105 active:scale-95"
          >
            <PhoneCall className="w-5 h-5 fill-red-700" />
            <span>Dial 112 Now (Free)</span>
          </button>
        </div>

        {/* Guided Triage Navigator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step 1: Identify Nature of Emergency
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              What situation are you experiencing?
            </h2>
          </div>

          {/* Emergency type selector buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: 'medical', label: 'Medical / Cardiac', icon: Ambulance, color: 'text-red-500' },
              { id: 'accident', label: 'Road Accident', icon: Car, color: 'text-amber-500' },
              { id: 'fire', label: 'Fire & Gas Leak', icon: Flame, color: 'text-orange-500' },
              { id: 'crime', label: 'Crime / Threat', icon: Shield, color: 'text-indigo-500' },
              { id: 'women', label: 'Women Safety', icon: HeartHandshake, color: 'text-pink-500' },
              { id: 'disaster', label: 'Flood / Disaster', icon: AlertTriangle, color: 'text-cyan-500' },
            ].map((btn) => {
              const Icon = btn.icon;
              const isSelected = selectedType === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setSelectedType(btn.id as EmergencyType)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 transition ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-800 border-red-500 shadow-md ring-2 ring-red-500/30'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${btn.color}`} />
                  <span className="text-xs font-bold">{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Rapid Triage Questions (Short & Non-Delaying) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Step 2: Rapid Scene Assessment
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Are you in a safe location right now?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsInSafePlace('yes')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold ${isInSafePlace === 'yes' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Yes, Safe Distance
                  </button>
                  <button
                    onClick={() => setIsInSafePlace('no')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold ${isInSafePlace === 'no' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    No, In Danger
                  </button>
                </div>
                {isInSafePlace === 'no' && (
                  <p className="text-[11px] text-red-500 font-bold mt-2">
                    ⚠️ Move away from traffic, active fire, or violent individuals immediately.
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Is the victim / person conscious and responding?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsVictimConscious('yes')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold ${isVictimConscious === 'yes' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    Yes, Conscious
                  </button>
                  <button
                    onClick={() => setIsVictimConscious('no')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold ${isVictimConscious === 'no' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    No, Unconscious
                  </button>
                </div>
                {isVictimConscious === 'no' && (
                  <p className="text-[11px] text-red-500 font-bold mt-2">
                    🚨 Check for breathing immediately. If not breathing normally, begin chest compressions.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Guide Details for Selected Type */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/80 px-2 py-0.5 rounded text-white">
                  {currentGuide.tag}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {currentGuide.title}
                </h3>
              </div>

              <a
                href={`tel:${currentGuide.primaryNumber}`}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition transform hover:scale-105"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{currentGuide.primaryLabel}</span>
              </a>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Immediate Action Checklist:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentGuide.immediateSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-emerald-300">
              <strong className="text-white block mb-0.5">🩹 Critical First-Aid Protocol:</strong>
              {currentGuide.firstAidTip}
            </div>

            <div className="p-3.5 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-200">
              <strong className="text-white block mb-0.5">⚠️ Mandatory Safety Rule:</strong>
              {currentGuide.criticalWarning}
            </div>
          </div>

          {/* Honest Dispatch Disclaimer (as mandated by user request 3) */}
          <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                Official Dispatch Disclosure:
              </strong>
              RAKSHAK does not simulate or claim that emergency dispatchers are en route. Only dialling 112 or official helplines connects you directly to government PCR controllers and ambulance dispatchers.
            </div>
          </div>
        </div>
      </div>

      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
