'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  Upload,
  X,
  Compass,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Info,
  Camera,
  HeartPulse
} from 'lucide-react';
import Call112Modal from '@/components/Call112Modal';

export default function AccidentReportPage() {
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [incidentType, setIncidentType] = useState('Two-Wheeler Collision / Skid');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [hasInjuries, setHasInjuries] = useState(true);
  const [urgency, setUrgency] = useState<'high' | 'critical'>('critical');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Confirmation before submit
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const accidentTypes = [
    'Two-Wheeler Collision / Skid',
    'Pedestrian Hit & Run',
    'Multi-Vehicle Car Crash',
    'Heavy Vehicle / Bus / Truck Accident',
    'Vehicle Overturn / Ditch Fall',
    'Animal-Vehicle Collision'
  ];

  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!address) {
          setAddress(`Near Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
        }
      },
      () => alert('Could not get GPS. Please enter street or highway name manually.')
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setPhotos(prev => [...prev, data.url]);
      } else {
        setUploadError(data.error || 'Failed to upload photo.');
      }
    } catch {
      setUploadError('Network error uploading photograph.');
    } finally {
      setUploading(false);
    }
  };

  const handlePreSubmitValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!description.trim() || description.trim().length < 8) {
      setErrorMessage('Please describe the witnessed incident.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Accident location is required.');
      return;
    }
    setShowConfirmModal(true);
  };

  const executeSubmission = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      const payload = {
        type: 'accident',
        category: incidentType,
        title: title.trim() || `${incidentType} at ${address}`,
        description: `${description.trim()}${hasInjuries ? ' [URGENT: Injuries Reported]' : ''}`,
        location: {
          address: address.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          state: 'Rajasthan'
        },
        urgency: hasInjuries ? 'critical' : urgency,
        photos,
        reporterName: reporterName.trim() || 'Bystander Witness',
        reporterPhone: reporterPhone.trim() || undefined
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.data?.id) {
        setSubmittedId(data.data.id);
      } else {
        setErrorMessage(data.error || 'Failed to submit accident report.');
      }
    } catch {
      setErrorMessage('Network error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Emergency Warning Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-red-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">
                ⚠️ Critical Safety Instruction
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">
                Accident Reporting &amp; Bystander Witness Flow
              </h1>
              <p className="text-xs sm:text-sm text-red-100 max-w-xl">
                <strong>Never put yourself in danger to take photographs.</strong> Do not approach fuel spills, burning vehicles, or active highway traffic lanes. If anyone is injured, call 112 immediately.
              </p>
            </div>

            <button
              onClick={() => setCallModalOpen(true)}
              className="w-full md:w-auto shrink-0 bg-white hover:bg-slate-100 text-red-700 font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-5 h-5 fill-red-700" />
              <span>Dial 112 (Police &amp; Trauma)</span>
            </button>
          </div>
        </div>

        {/* Success View */}
        {submittedId ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-emerald-500 shadow-2xl text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Truthful Submission Receipt
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Incident Report ID: <span className="text-red-500">{submittedId}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                Evidence securely archived on RAKSHAK.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Legal &amp; Good Samaritan Notice:
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Under Section 134A of the Motor Vehicles (Amendment) Act, a Good Samaritan who aids an accident victim cannot be subjected to civil or criminal liability.
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                <strong>Dispatch Disclosure:</strong> Storing this report does not guarantee arrival of private tow trucks or ambulances unless you have dialed 112 directly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/track?id=${submittedId}`}
                className="w-full sm:w-auto bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-bold py-3 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
              >
                <FileCheck className="w-4 h-4" />
                <span>Track Incident Record</span>
              </Link>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setDescription('');
                  setPhotos([]);
                  setAddress('');
                }}
                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-5 rounded-xl text-xs"
              >
                File Another Incident
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePreSubmitValidation} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Injury Trigger Banner */}
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <HeartPulse className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs text-red-900 dark:text-red-200 block">
                    Are people visibly injured or trapped?
                  </strong>
                  <p className="text-[11px] text-red-700 dark:text-red-300">
                    If yes, dial 112 immediately. You can complete the report afterwards.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setHasInjuries(true); setUrgency('critical'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${hasInjuries ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  Yes, Injuries Present
                </button>
                <button
                  type="button"
                  onClick={() => { setHasInjuries(false); setUrgency('high'); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${!hasInjuries ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  No Injuries
                </button>
              </div>
            </div>

            {/* Incident Type & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Type of Accident *
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none"
                >
                  {accidentTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Severity Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as 'high' | 'critical')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none"
                >
                  <option value="critical">Critical (Injuries, unconscious victims, blocked highway)</option>
                  <option value="high">High (Vehicle damaged, minor abrasion, traffic hazard)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Witness Description &amp; Details *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you witness? Mention number of vehicles involved, visible registration plates if safe to note, victim condition, and road direction..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none"
              ></textarea>
            </div>

            {/* Location & GPS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Accident Location *
                </label>
                <button
                  type="button"
                  onClick={handleFetchGps}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Auto-detect GPS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Highway / Flyover / Road junction (e.g. Durgapura Flyover Slip Road)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                />
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Pillar No., Toll Plaza, or Shop (e.g. Near Pillar 44)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            {/* Photo Evidence (Optional) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Photographs of Scene (Optional — only if safe to take)
              </label>

              {uploadError && <p className="text-xs text-red-500 font-semibold">{uploadError}</p>}

              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                  {photos.map((u, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="Accident evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer border border-slate-300 dark:border-slate-700 transition">
                  <Camera className="w-4 h-4 text-red-500" />
                  <span>{uploading ? 'Uploading...' : 'Attach Scene Photo (Safe distance only)'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">
                  Reports without photos are fully accepted.
                </span>
              </div>
            </div>

            {/* Reporter Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your Name (Witness / Bystander)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none"
              />
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="Your Phone Number"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none"
              />
            </div>

            {/* Review Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition transform active:scale-98"
            >
              <FileCheck className="w-5 h-5" />
              <span>Review &amp; Confirm Accident Submission</span>
            </button>
          </form>
        )}

        {/* Confirmation Modal before sending (User requirement 8) */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border-2 border-red-500 rounded-2xl p-6 max-w-lg w-full space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  Confirm Accident Report Submission
                </h3>
                <button onClick={() => setShowConfirmModal(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <p><strong>Incident:</strong> {incidentType}</p>
                <p><strong>Location:</strong> {address} {landmark ? `(${landmark})` : ''}</p>
                <p><strong>Photographs:</strong> {photos.length} attached</p>
                <p><strong>Injuries Indicated:</strong> {hasInjuries ? 'YES' : 'No'}</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <p className="font-semibold">⚠️ Data Privacy &amp; Police Forwarding Notice:</p>
                <p className="mt-0.5">
                  This report will be securely archived in RAKSHAK’s incident registry. Photos will not be made publicly accessible without privacy shielding.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={executeSubmission}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Confirm &amp; Record Accident Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="py-3 px-4 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Call112Modal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </div>
  );
}
