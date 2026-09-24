import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Cookie, 
  Search, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Mail, 
  ExternalLink,
  Sliders,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock
} from 'lucide-react';
import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import { useCookies } from '../../context/CookieContext';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  readTime: string;
  activeTab: 'terms' | 'privacy' | 'data-privacy' | 'cookies';
  tableOfContents?: { id: string; label: string }[];
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  readTime,
  activeTab,
  tableOfContents = [],
  children,
  searchQuery = '',
  onSearchChange,
}: LegalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal: openCookieModal } = useCookies();
  const [activeTocId, setActiveTocId] = useState<string>('');

  const navTabs = [
    { id: 'terms', label: 'Terms & Conditions', path: '/terms', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Policy', path: '/privacy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'data-privacy', label: 'Data Privacy & Rights', path: '/data-privacy', icon: <Lock className="w-4 h-4" /> },
    { id: 'cookies', label: 'Cookie Policy', path: '/cookies', icon: <Cookie className="w-4 h-4" /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveTocId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo size="md" />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span>Legal Center</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{activeTab.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onSearchChange && (
              <div className="relative hidden md:block w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clauses or terms..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand rounded-lg outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                />
              </div>
            )}
            
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print document"
              aria-label="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <ThemeToggle />

            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand transition-colors px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-1 sm:space-x-2 py-2">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand text-white shadow-sm shadow-brand/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-brand/5 via-slate-50 to-slate-50 dark:from-brand/10 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand" /> Last updated: {lastUpdated}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand" /> {readTime} read
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Effective v2.4
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 font-display">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column / Table of Contents & Quick Badges */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-36 print:hidden">
            {/* Table of Contents Card */}
            {tableOfContents.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <BookOpen className="w-4 h-4 text-brand" /> Table of Contents
                </div>
                <nav className="space-y-1 text-xs sm:text-sm">
                  {tableOfContents.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-start gap-2 ${
                        activeTocId === item.id
                          ? 'bg-brand/10 text-brand font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono mt-0.5">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="leading-snug">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Student Privacy & Trust Commitments */}
            <div className="bg-gradient-to-br from-brand/5 to-emerald-500/5 dark:from-brand/10 dark:to-emerald-500/10 rounded-2xl border border-brand/20 dark:border-brand/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Our Educational Privacy Pledge
                </h4>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>We never sell or commercialize student data or quiz answers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Strict FERPA, COPPA, and GDPR compliance safeguards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Granular role isolation between students, parents, and counselors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>256-bit AES encryption at rest and TLS 1.3 transit security.</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Self-Service Controls
              </h4>
              <button
                onClick={openCookieModal}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand" /> Manage Cookie Preferences
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link
                to="/data-privacy"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand" /> Data Rights & Export Portal
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Legal Support Contact */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-brand" /> Questions or DPO Inquiries?
              </div>
              <p>
                Reach our Data Protection Office directly at{' '}
                <a href="mailto:privacy@oaicc.org" className="text-brand font-bold hover:underline">
                  privacy@oaicc.org
                </a>
              </p>
            </div>
          </aside>

          {/* Right Column / Legal Content Document */}
          <main className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm overflow-hidden prose dark:prose-invert max-w-none">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} OAICC Career Counseling & Assessment Platform. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <Link to="/terms" className="hover:text-brand transition-colors">Terms of Service</Link>
              <span aria-hidden="true">·</span>
              <Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
              <span aria-hidden="true">·</span>
              <Link to="/data-privacy" className="hover:text-brand transition-colors">Data Privacy & Rights</Link>
              <span aria-hidden="true">·</span>
              <Link to="/cookies" className="hover:text-brand transition-colors">Cookie Policy</Link>
              <span aria-hidden="true">·</span>
              <button onClick={openCookieModal} className="hover:text-brand transition-colors underline">
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
