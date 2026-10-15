import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';

export const metadata: Metadata = {
  title: 'RAKSHAK | Indian Public Assistance & Emergency Support Platform',
  description:
    'Har Mushkil Mein, Aapke Saath. Unified emergency response (Call 112), civic complaints, accident reporting, verified public directories, and AI assistance across India.',
  keywords: [
    'RAKSHAK',
    'Emergency India 112',
    'Ambulance 108',
    'Civic complaints',
    'Pothole report',
    'Accident reporting',
    'Jaipur Nagar Nigam',
    'Delhi MCD',
    'Police helpline'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ChatbotWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
