import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Users, 
  UserCircle, 
  Activity, 
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  Bookmark,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import Logo from '../Logo';

// Import sub-components (to be created)
import StudentHome from './Student/StudentHome';
import CareerLibrary from './Student/CareerLibrary';
import CareerDetails from './Student/CareerDetails';
import Forum from './Student/Forum';
import ForumThread from './Student/ForumThread';
import Mentors from './Student/Mentors';
import MentorDetails from './Student/MentorDetails';
import Counselors from './Student/Counselors';
import CounselorDetails from './Student/CounselorDetails';
import ActivityTracker from './Student/ActivityTracker';
import StudentProfile from './Student/StudentProfile';
import SavedContent from './Student/SavedContent';
import Events from './Student/Events';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import NotificationPage from '../Notifications/NotificationPage';

export default function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/student/dashboard' },
    { icon: BookOpen, label: 'Career library', path: '/student/careers' },
    { icon: MessageSquare, label: 'Forum', path: '/student/forum' },
    { icon: Users, label: 'Mentors', path: '/student/mentors' },
    { icon: Bell, label: 'Events', path: '/student/events' },
    { icon: UserCircle, label: 'Counselors', path: '/student/counselors' },
    { icon: Activity, label: 'Activity', path: '/student/activity' },
    { icon: Settings, label: 'Settings', path: '/student/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/student/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive(item.path)
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
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
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <button onClick={toggleSidebar} className="p-2 lg:hidden text-slate-500">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationDropdown role="student" />

            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 sm:p-2 rounded-2xl transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Bolu Ahmed</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Student</p>
                </div>
                <img 
                  src="https://picsum.photos/seed/student/100/100" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand/20"
                />
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                    >
                      <button 
                        onClick={() => { navigate('/student/settings'); setIsProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4" /> My profile
                      </button>
                      <button 
                        onClick={() => { navigate('/student/saved'); setIsProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Bookmark className="w-4 h-4" /> Saved
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
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<StudentHome />} />
            <Route path="careers" element={<CareerLibrary />} />
            <Route path="careers/:id" element={<CareerDetails />} />
            <Route path="forum" element={<Forum />} />
            <Route path="forum/:id" element={<ForumThread />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="mentors/:id" element={<MentorDetails />} />
            <Route path="events" element={<Events />} />
            <Route path="counselors" element={<Counselors />} />
            <Route path="counselors/:id" element={<CounselorDetails />} />
            <Route path="activity" element={<ActivityTracker />} />
            <Route path="settings" element={<StudentProfile />} />
            <Route path="saved" element={<SavedContent />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

