'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Ambulance,
  PhoneCall,
  Search,
  MapPin,
  HeartPulse,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import { verifiedHospitals, VerifiedHospital } from '@/lib/emergency-data';
import Call112Modal from '@/components/Call112Modal';

export default function MedicalHelpPage() {
  const [searchCity, setSearchCity] = useState('All');
  const [query, setQuery] = useState('');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const cities = ['All', 'Jaipur', 'New Delhi', 'Mumbai', 'Bengaluru'];

  const filteredHospitals = verifiedHospitals.filter((h) => {
    const matchesCity = searchCity === 'All' || h.city.toLowerCase() === searchCity.toLowerCase();
    const matchesQ =
      !query ||
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.address.toLowerCase().includes(query.toLowerCase()) ||
      h.city.toLowerCase().includes(query.toLowerCase());
    return matchesCity && matchesQ;
  });

  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation(`Current GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        // If near Jaipur, pre-select Jaipur
        if (Math.abs(pos.coords.latitude - 26.9) < 0.8) {
          setSearchCity('Jaipur');
        } else if (Math.abs(pos.coords.latitude - 28.6) < 0.8) {
          setSearchCity('New Delhi');
        }
      },
      () => alert('Unable to get GPS location. Select city manually.')
    );
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                <Ambulance className="w-4 h-4" />
                Verified Hospital &amp; Emergency Ambulance Finder
              </span>
              <h1 className="text-2xl sm:text-4xl font-black">
                Ambulance &amp; Emergency Medical Help
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct verified contact numbers for National Ambulance 108/102 and Government Apex Trauma Centers with 24x7 emergency and blood bank facilities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setCallModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition transform hover:scale-105"
              >
                <PhoneCall className="w-4 h-4 fill-white" />
                <span>Call 112 / 108 Medical</span>
              </button>
            </div>
          </div>
        </div>

        {/* National Ambulance Helplines Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Primary Emergency Dispatch
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                National Ambulance 108
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Free 24x7 emergency medical response for critical trauma, heart attacks, severe road accidents, and strokes across India.
              </p>
            </div>
            <a
              href="tel:108"
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial 108 Now</span>
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Maternal &amp; Infant Transport
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                Janani Shishu Ambulance 102
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Dedicated non-emergency and obstetric transport for pregnant women, new mothers, and sick infants to government hospitals.
              </p>
            </div>
            <a
              href="tel:102"
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial 102 Now</span>
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Mental Health Crisis Support
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1">
                Tele-MANAS 14416
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                National 24x7 toll-free mental health helpline operated by NIMHANS and MoHFW with confidential counseling in 20+ languages.
              </p>
            </div>
            <a
              href="tel:14416"
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dial 14416</span>
            </a>
          </div>
        </div>

        {/* Hospital Directory Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hospital by name, trauma center, or address..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFetchGps}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>Nearby with GPS</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-slate-500">Select City:</span>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setSearchCity(c)}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  searchCity === c
                    ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {userLocation && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ {userLocation}
            </p>
          )}
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
                    {hosp.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {hosp.city}, {hosp.state}
                  </span>
                </div>

                <h3 className="font-black text-base text-slate-900 dark:text-white mt-2 leading-tight">
                  {hosp.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>{hosp.address}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>24x7 Emergency Trauma Unit Active</span>
                  </div>
                  {hosp.bloodBankAvailable && (
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Licensed Blood Bank On Campus</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`tel:${hosp.emergencyPhone}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Emergency Desk ({hosp.emergencyPhone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Truthful Dispatch Disclosure (User requirement 4) */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
              Accurate Data &amp; Live Dispatch Disclosure:
            </strong>
            RAKSHAK does not fabricate real-time ambulance GPS locations, fake arrival countdown timers, or simulated hospital bed meters. All telephone lines connect directly to official hospital emergency casualty desks or the 108/112 state dispatch control rooms.
          </div>
        </div>
      </div>

      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
