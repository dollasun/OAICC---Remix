import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  ChevronRight, 
  MoreVertical,
  Download,
  Filter,
  Trash2,
  X,
  User,
  ChevronDown,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import Logo from '../Logo';
import SchoolOverview from './School/SchoolOverview';
import SchoolClasses from './School/SchoolClasses';
import SchoolClassDetails from './School/SchoolClassDetails';
import SchoolProfile from './School/SchoolProfile';
import SchoolStudentDetails from './School/SchoolStudentDetails';
import SchoolEvents from './School/SchoolEvents';
import SchoolMessages from './School/SchoolMessages';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import NotificationPage from '../Notifications/NotificationPage';
import ThemeToggle from '../ThemeToggle';
import { useCrossPortalMessaging } from '../../utils/crossPortalMessaging';

export default function SchoolDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { totalUnread } = useCrossPortalMessaging('admin-1', 'admin');
  
  const isActive = (path: string) => {
    if (path === '/school/dashboard' && location.pathname === '/school/dashboard') return true;
    if (path !== '/school/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link
            to="/school/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/school/dashboard') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/school/classes"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/school/classes') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Classes
          </Link>

          <Link
            to="/school/messages"
            className={`flex items-center justify-between px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/school/messages') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              Messages
            </div>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-brand text-white rounded-full">
                {totalUnread}
              </span>
            )}
          </Link>

          <Link
            to="/school/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/school/events') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Events
          </Link>

          <Link
            to="/school/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/school/settings') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-4 focus:ring-brand/10 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationDropdown role="school" />

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Caleb schools</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">School Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold border-2 border-brand/20">
                  CS
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 py-2 z-50 overflow-hidden"
                    >
                      <button 
                        onClick={() => { navigate('/school/settings'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4" /> My profile
                      </button>
                      <button 
                        onClick={() => { setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <ShieldCheck className="w-4 h-4" /> Upgrade to pro
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                      <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <Routes>
            <Route path="dashboard" element={<SchoolOverview />} />
            <Route path="classes" element={<SchoolClasses />} />
            <Route path="classes/:id" element={<SchoolClassDetails />} />
            <Route path="student/:id" element={<SchoolStudentDetails />} />
            <Route path="events" element={<SchoolEvents />} />
            <Route path="messages" element={<SchoolMessages />} />
            <Route path="settings" element={<SchoolProfile />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

