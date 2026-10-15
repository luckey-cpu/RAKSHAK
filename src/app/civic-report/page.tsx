'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Users,
  Compass,
  ArrowRight,
  Info,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import VoiceReporter from '@/components/VoiceReporter';
import SmartAssistant from '@/components/SmartAssistant';
import { useLanguage } from '@/components/LanguageContext';

function CivicReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [category, setCategory] = useState(
    searchParams.get('category') || 'Potholes & Damaged Roads'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(searchParams.get('description') || '');
  const [address, setAddress] = useState(searchParams.get('location') || '');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>(
    (searchParams.get('urgency') as 'low' | 'medium' | 'high' | 'critical') || 'medium'
  );
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  // Family Assist (USP #5)
  const [isReportingForSomeoneElse, setIsReportingForSomeoneElse] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<{
    id: string;
    category: string;
    title: string;
    referenceUrl: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const civicCategories = [
    'Potholes & Damaged Roads',
    'Broken Streetlights',
    'Garbage Accumulation & Waste Management',
    'Water Leakage & Supply Issues',
    'Blocked Drains & Sewerage Problems',
    'Open Manholes & Infrastructure Risks',
    'Broken Traffic Lights & Road Hazards',
    'Electricity Faults & Dangling Wires',
    'Public Property Damage & Encroachment',
    'Noise, Sanitation & Public Inconvenience'
  ];

  // Geolocation trigger
  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(5)));
        setLng(Number(pos.coords.longitude.toFixed(5)));
        if (!address) {
          setAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not retrieve GPS location. You can enter the street address manually.');
      },
      { timeout: 10000 }
    );
  };

  // Photo upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setPhotos((prev) => [...prev, data.url]);
      } else {
        setUploadError(data.error || 'Failed to upload photo.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Network error while uploading photo.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Voice parsed callback (Bolkar Batao USP #1)
  const handleVoiceData = (data: {
    category: string;
    location: string;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }) => {
    if (civicCategories.includes(data.category)) {
      setCategory(data.category);
    }
    if (data.location && !address) {
      setAddress(data.location);
    }
    if (data.description) {
      setDescription(data.description);
    }
    if (!title) {
      setTitle(data.title);
    }
    setUrgency(data.urgency);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a short title for this complaint.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Please provide a detailed description (at least 10 characters).');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Street address or location is required so the municipal team can find the problem.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        type: 'civic',
        category,
        title: title.trim(),
        description: description.trim(),
        location: {
          address: address.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim() || undefined,
          lat,
          lng
        },
        urgency,
        photos,
        reporterName: reporterName.trim() || undefined,
        reporterPhone: reporterPhone.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
        reportedFor: isReportingForSomeoneElse
          ? {
              isReportingForSomeoneElse: true,
              beneficiaryName: beneficiaryName.trim(),
              relationship: relationship.trim(),
              contactNumber: beneficiaryPhone.trim(),
              specialNeeds: specialNeeds.trim() || undefined
            }
          : undefined
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.data?.id) {
        setSubmittedReport({
          id: data.data.id,
          category: data.data.category,
          title: data.data.title,
          referenceUrl: `/track?id=${data.data.id}`
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit complaint.');
      }
    } catch (err) {
      console.error('Submit complaint error:', err);
      setErrorMessage('A network error occurred while submitting. Your data is preserved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Civic Grievance Redressal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Report a Civic Problem
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                File verified complaints for roads, lights, garbage, drains, and hazards. Stored securely on RAKSHAK and routed to municipal wards.
              </p>
            </div>
            <a
              href="tel:112"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Emergency 112</span>
            </a>
          </div>
        </div>

        {/* Success View */}
        {submittedReport ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-emerald-500 shadow-2xl text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Complaint Registered Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Reference ID: <span className="text-amber-500">{submittedReport.id}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                Save this reference number. You can track inspection updates, municipal officer notes, and Before/After proof of resolution photos at any time.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5">
              <p><strong className="text-slate-700 dark:text-slate-300">Category:</strong> {submittedReport.category}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Title:</strong> {submittedReport.title}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Internal Status:</strong> Submitted (Under Review)</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={submittedReport.referenceUrl}
                className="w-full sm:w-auto bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 font-bold py-3 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>Track This Complaint Now</span>
              </Link>
              <button
                onClick={() => {
                  setSubmittedReport(null);
                  setTitle('');
                  setDescription('');
                  setPhotos([]);
                  setLandmark('');
                }}
                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-5 rounded-xl text-xs transition"
              >
                File Another Complaint
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* USP 1: Bolkar Batao (Voice Reporting) */}
            <VoiceReporter onParsedResult={handleVoiceData} />

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Civic Problem Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-amber-500"
                  >
                    {civicCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-amber-500"
                  >
                    <option value="low">Low (Routine maintenance)</option>
                    <option value="medium">Medium (Causes public inconvenience)</option>
                    <option value="high">High (Accident hazard / active risk)</option>
                    <option value="critical">Critical (Immediate danger to life / live wire / uncovered manhole)</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole on Madhyam Marg near City Park Gate 2"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe dimensions, how long it has been broken, whether water is accumulating, and risks to two-wheelers or pedestrians..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Location Fields with GPS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Location &amp; Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleFetchGps}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Auto-detect My GPS Coordinates</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street name, Sector, or Colony (e.g. Madhyam Marg, Mansarovar)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Prominent Landmark (e.g. Opposite City Park Gate 2)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Jaipur)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State (e.g. Rajasthan)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode (optional)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                {lat && lng && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ GPS Lat/Lng tagged: {lat}, {lng}
                  </p>
                )}
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Attach Supporting Photographs (Recommended)
                </label>

                {uploadError && (
                  <p className="text-xs text-red-500 font-semibold">{uploadError}</p>
                )}

                {/* Uploaded Photos Preview Grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                    {photos.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition shadow"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer border border-slate-300 dark:border-slate-700 transition">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>{uploading ? 'Uploading...' : 'Upload Photo (JPG, PNG < 5MB)'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {photos.length} photo(s) attached
                  </span>
                </div>
              </div>

              {/* USP 5: Family Assist & Report For Someone Else */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-500" />
                    <div>
                      <strong className="text-xs text-slate-800 dark:text-slate-200 block">
                        Family &amp; Elder Assist (Report on Behalf of Someone Else)
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        Help elderly relatives, non-tech-savvy neighbors, or differently-abled persons.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="familyAssistCheck"
                    checked={isReportingForSomeoneElse}
                    onChange={(e) => setIsReportingForSomeoneElse(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
                  />
                </div>

                {isReportingForSomeoneElse && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-fade-in text-xs">
                    <input
                      type="text"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      placeholder="Beneficiary's Full Name (e.g. Babulal Sharma)"
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="Your Relationship (e.g. Son, Daughter, Neighbor)"
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={beneficiaryPhone}
                      onChange={(e) => setBeneficiaryPhone(e.target.value)}
                      placeholder="Beneficiary Contact Number (optional)"
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={specialNeeds}
                      onChange={(e) => setSpecialNeeds(e.target.value)}
                      placeholder="Special Notes (e.g. Senior citizen, wheelchair user)"
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Reporter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name (Citizen Reporter)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Sunil Mathur"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="e.g. +91-9829012345"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              {/* USP 2: Smart Complaint Assistant (Live Inspection) */}
              <SmartAssistant
                description={description}
                category={category}
                address={address}
                landmark={landmark}
                photosCount={photos.length}
                reporterPhone={reporterPhone}
                onSelectSuggestedCategory={(cat) => setCategory(cat)}
              />

              {/* Clear Transparency Disclosure */}
              <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-500 shrink-0" />
                  What happens when you submit this report?
                </p>
                <p>
                  1. Your report receives a unique tracking reference (RAK-2026-XXXXX) in the encrypted RAKSHAK database.
                </p>
                <p>
                  2. The issue appears on the Community Map for other citizens to support and upvote.
                </p>
                <p>
                  3. The internal status and municipal routing can be verified on the tracking page at any time.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition transform active:scale-98"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Reference ID &amp; Storing Report...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>Submit Civic Complaint to RAKSHAK</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function CivicReportPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading Report Form...</div>}>
      <CivicReportContent />
    </React.Suspense>
  );
}
