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
  Calendar
} from 'lucide-react';
import Logo from '../Logo';
import SchoolOverview from './School/SchoolOverview';
import SchoolClasses from './School/SchoolClasses';
import SchoolClassDetails from './School/SchoolClassDetails';
import SchoolProfile from './School/SchoolProfile';
import SchoolStudentDetails from './School/SchoolStudentDetails';
import SchoolEvents from './School/SchoolEvents';

export default function SchoolDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === '/school/dashboard' && location.pathname === '/school/dashboard') return true;
    if (path !== '/school/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const notifications = [
    { id: 1, text: 'New teacher request from John Obi', time: '2 mins ago' },
    { id: 2, text: 'Class SSS3 has been updated', time: '1 hour ago' },
    { id: 3, text: 'Student enrollment report is ready', time: '5 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/school/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive('/school/dashboard') 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            to="/school/classes"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive('/school/classes') 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Classes
          </Link>

          <Link
            to="/school/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive('/school/events') 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Events
          </Link>

          <Link
            to="/school/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive('/school/settings') 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl relative"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 z-50 overflow-hidden"
                    >
                      <div className="px-6 py-2 border-b border-slate-50 mb-2">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="px-6 py-3 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-none">
                            <p className="text-sm text-slate-700 font-medium leading-tight">{notif.text}</p>
                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Caleb schools</p>
                  <p className="text-xs text-slate-500">School Admin</p>
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
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                    >
                      <button 
                        onClick={() => { navigate('/school/settings'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4" /> My profile
                      </button>
                      <button 
                        onClick={() => { setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Upgrade to pro
                      </button>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
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
            <Route path="settings" element={<SchoolProfile />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
