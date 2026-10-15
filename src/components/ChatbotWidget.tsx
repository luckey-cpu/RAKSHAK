'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  PhoneCall,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Bot,
  User,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'call112' | 'navigate' | 'prefill';
    label: string;
    url?: string;
  };
}

export default function ChatbotWidget() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScriptedDemo, setIsScriptedDemo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं रक्षक एआई सहायक हूँ। आपातकालीन सहायता (Call 112), गड्ढे या बिजली की शिकायत दर्ज करने, दुर्घटना रिपोर्ट करने या स्टेटस ट्रैक करने में मैं आपकी मदद कर सकता हूँ।'
          : language === 'hinglish'
          ? 'Namaste! Main RAKSHAK AI Assistant hoon. Emergency help (112), sadak par gaddha, accident report ya complaint status track karne mein aapki kya help kar sakta hoon?'
          : 'Namaste! I am the RAKSHAK AI Assistant. I can guide you through 112 emergency calls, filing civic complaints with auto-categorization, accident reports, or tracking your issue. How can I help you today?',
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    'Mere area mein bada pothole hai',
    'I saw a road accident',
    'Ambulance kaise contact karun?',
    'Fire brigade ka number chahiye',
    'Traffic signal kaam nahi kar raha',
    'Meri complaint ka status kya hai?',
    'Mujhe nearest hospital dhoondhna hai'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language })
      });

      const data = await res.json();

      if (data.success) {
        setIsScriptedDemo(!!data.isScriptedDemo);
        const botMessage: ChatMessageItem = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          suggestedAction: data.suggestedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const fallbackMessage: ChatMessageItem = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'Maaf kijiye, temporary issue hai. Kisi bhi emergency ke liye turant 112 dial karein.',
          suggestedAction: {
            type: 'call112',
            label: 'Call 112',
            url: 'tel:112'
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      const errMessage: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'Network error. Urgent emergency ke liye please 112 dial karein.',
        suggestedAction: {
          type: 'call112',
          label: 'Call 112',
          url: 'tel:112'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border-2 border-amber-400 hover:border-amber-300 transition transform hover:scale-105 active:scale-95"
          aria-label="Ask RAKSHAK AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide">
            Ask RAKSHAK AI
          </span>
          <span className="hidden sm:inline text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
            Assist
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-indigo-700/50 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 px-4 py-3 border-b border-indigo-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  RAKSHAK AI
                  <span className="text-[10px] bg-red-600 px-1.5 py-0.2 rounded font-semibold text-white">
                    Live
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isScriptedDemo ? 'Intelligent Multi-lingual Mode' : 'Connected to Gemini AI'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:112"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
                title="Immediate 112 Emergency Call"
              >
                <PhoneCall className="w-3 h-3" />
                <span>112</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/90 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-900 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Suggested Action Button */}
                  {m.suggestedAction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60">
                      {m.suggestedAction.type === 'call112' ? (
                        <a
                          href="tel:112"
                          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          {m.suggestedAction.label}
                        </a>
                      ) : m.suggestedAction.url ? (
                        <Link
                          href={m.suggestedAction.url}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition"
                        >
                          <span>{m.suggestedAction.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-400 pl-9">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-300"></div>
                <span>RAKSHAK AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask in Hindi, English or Hinglish..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3.5 py-2 text-xs outline-none transition"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 transition font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-500 text-center mt-1.5">
              Urgent emergency mein Call 112 button use karein. RAKSHAK never delays dispatch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
