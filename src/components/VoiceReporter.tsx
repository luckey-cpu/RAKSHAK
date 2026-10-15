'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ParsedVoiceData {
  category: string;
  location: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface VoiceReporterProps {
  onParsedResult: (data: ParsedVoiceData) => void;
  className?: string;
}

export default function VoiceReporter({ onParsedResult, className = '' }: VoiceReporterProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionInstance, setRecognitionInstance] = useState<unknown>(null);
  const [parsedPreview, setParsedPreview] = useState<ParsedVoiceData | null>(null);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');

  useEffect(() => {
    // Check SpeechRecognition support in browser
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const parseVoiceInput = (text: string): ParsedVoiceData => {
    const lower = text.toLowerCase();
    let category = 'Civic Problem (General)';
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let location = '';

    // Category & Urgency heuristics
    if (lower.includes('gaddha') || lower.includes('pothole') || lower.includes('sadak') || lower.includes('road')) {
      category = 'Potholes & Damaged Roads';
      urgency = 'high';
    } else if (lower.includes('bijli') || lower.includes('wire') || lower.includes('tar') || lower.includes('spark') || lower.includes('transformer')) {
      category = 'Electricity Faults & Dangling Wires';
      urgency = 'critical';
    } else if (lower.includes('manhole') || lower.includes('dhakkan') || lower.includes('open drain')) {
      category = 'Open Manholes & Infrastructure Risks';
      urgency = 'critical';
    } else if (lower.includes('kachra') || lower.includes('garbage') || lower.includes('dustbin') || lower.includes('safai')) {
      category = 'Garbage Accumulation & Waste Management';
      urgency = 'medium';
    } else if (lower.includes('light') || lower.includes('batti') || lower.includes('andhera') || lower.includes('street light')) {
      category = 'Broken Streetlights';
      urgency = 'medium';
    } else if (lower.includes('paani') || lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
      category = 'Water Leakage & Supply Issues';
      urgency = 'high';
    } else if (lower.includes('naali') || lower.includes('drain') || lower.includes('sewer') || lower.includes('overflow')) {
      category = 'Blocked Drains & Sewerage Problems';
      urgency = 'high';
    } else if (lower.includes('accident') || lower.includes('takkar') || lower.includes('ghayal')) {
      category = 'Road Accident & Collision';
      urgency = 'critical';
    }

    // Location extraction heuristic
    // Check for common patterns: "... mein ...", "near ...", "... ke paas ..."
    const commonAreas = [
      'Mansarovar', 'C-Scheme', 'Malviya Nagar', 'Raja Park', 'Vaishali Nagar', 'Tonk Road', 'MI Road', 'JLN Marg',
      'Connaught Place', 'Karol Bagh', 'Rohini', 'Dwarka', 'Lajpat Nagar', 'Janakpuri',
      'Bandra', 'Andheri', 'Dadar', 'Borivali', 'Parel', 'Colaba',
      'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'HSR Layout'
    ];

    for (const area of commonAreas) {
      if (lower.includes(area.toLowerCase())) {
        location = area;
        break;
      }
    }

    if (!location) {
      const matchMein = text.match(/([a-zA-Z\u0900-\u097F\s]{3,20})\s+(mein|me|में)/i);
      const matchNear = text.match(/(near|paas|ke paas|के पास)\s+([a-zA-Z\u0900-\u097F\s]{3,25})/i);
      if (matchMein && matchMein[1]) {
        location = matchMein[1].trim();
      } else if (matchNear && matchNear[2]) {
        location = matchNear[2].trim();
      }
    }

    return {
      category,
      location: location || 'Location to be specified by citizen',
      title: `${category} reported via Bolkar Batao`,
      description: text,
      urgency
    };
  };

  const startListening = () => {
    if (!speechSupported) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedVoiceLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        const parsed = parseVoiceInput(currentTranscript);
        setParsedPreview(parsed);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setRecognitionInstance(recognition);
      setIsListening(true);
    } catch (e) {
      console.error('Speech recognition failed to start:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionInstance as any).stop();
    }
    setIsListening(false);
  };

  const handleManualTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTranscript(val);
    if (val.trim().length > 3) {
      const parsed = parseVoiceInput(val);
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  const handleApply = () => {
    if (parsedPreview) {
      onParsedResult(parsedPreview);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-indigo-800/40 shadow-xl ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              Bolkar Batao (बोलकर बताओ)
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                Voice First USP
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Hindi, English ya Hinglish mein bolein. Hum description se category aur location auto-fill kar denge.
            </p>
          </div>
        </div>

        {/* Language selector for speech */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setSelectedVoiceLang('hi-IN')}
            className={`px-2 py-1 rounded text-xs font-semibold ${selectedVoiceLang === 'hi-IN' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'}`}
          >
            हिंदी / Hinglish
          </button>
          <button
            type="button"
            onClick={() => setSelectedVoiceLang('en-IN')}
            className={`px-2 py-1 rounded text-xs font-semibold ${selectedVoiceLang === 'en-IN' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'}`}
          >
            English
          </button>
        </div>
      </div>

      {/* Voice Recording Control */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900/70 rounded-xl border border-slate-800">
        {speechSupported ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative p-5 rounded-full shadow-2xl transition transform active:scale-95 ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                  </span>
                </>
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <span className="text-xs font-semibold text-slate-200">
              {isListening ? (
                <span className="text-red-400 font-bold animate-pulse">
                  Listening... Aap boliye (e.g., &ldquo;Mansarovar mein road par bada gaddha hai&rdquo;)
                </span>
              ) : (
                'Mic button dabayein aur apni samasya bolein'
              )}
            </span>
          </div>
        ) : (
          <div className="text-xs text-amber-300 flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Voice input is not directly supported by this browser. Type your voice description below:</span>
          </div>
        )}

        {/* Text input / transcript display */}
        <div className="w-full mt-4">
          <input
            type="text"
            value={transcript}
            onChange={handleManualTextChange}
            placeholder='Try typing: "Mansarovar mein road par bada gaddha hai" or "C-Scheme streetlight band hai"'
            className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Extracted preview */}
      {parsedPreview && (
        <div className="mt-4 p-4 bg-slate-800/80 border border-emerald-500/40 rounded-xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              AI Extracted Draft Information:
            </span>
            <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-[11px]">
              Urgency: {parsedPreview.urgency.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Identified Category:</span>
              <strong className="text-amber-300">{parsedPreview.category}</strong>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Detected Location:</span>
              <strong className="text-white">{parsedPreview.location}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-700/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Apply This Extracted Data to Complaint Form
          </button>
        </div>
      )}
    </div>
  );
}
