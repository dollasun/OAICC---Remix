import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  ChevronRight,
  LayoutDashboard,
  User,
  Home,
  ChevronDown,
  LayoutGrid,
  Calendar
} from 'lucide-react';
import Logo from '../Logo';
import StudentList from './Teacher/StudentList';
import StudentDetails from './Teacher/StudentDetails';
import TeacherProfile from './Teacher/TeacherProfile';
import TeacherEvents from './Teacher/TeacherEvents';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import NotificationPage from '../Notifications/NotificationPage';

const classes = [
  { id: 'sss2a', name: 'SSS 2 A' },
  { id: 'sss3b', name: 'SSS 3 B' },
];

export default function TeacherDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClassExpanded, setIsClassExpanded] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isClassActive = (id: string) => {
    // For demo, we just use the first class as the main dashboard
    if (id === 'sss2a' && location.pathname === '/teacher/dashboard') return true;
    return location.pathname === `/teacher/class/${id}`;
  };

  const isClassSectionActive = () => {
    return location.pathname === '/teacher/dashboard' || location.pathname.startsWith('/teacher/class/') || location.pathname.startsWith('/teacher/student/');
  };

  const notifications = [
    { id: 1, text: 'Favour Aina mentor request has been approved', time: 'New' },
    { id: 2, text: 'Favour Aina took a career interest test', time: 'New' },
    { id: 3, text: 'Gbenga is added Medicine as a career interest', time: 'New' },
    { id: 4, text: 'You have 2 new unread articles in Software development', time: 'Older' },
    { id: 5, text: 'Gbenga Aina mentor request was declined', time: 'Older' },
    { id: 6, text: 'Your password was reset successfully', time: 'Older' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 hidden lg:flex">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* Class Section with Submenu */}
          <div className="space-y-1">
            <button
              onClick={() => setIsClassExpanded(!isClassExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                isClassSectionActive() && !isActive('/teacher/settings')
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5" />
                Class
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isClassExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isClassExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-1 pl-12"
                >
                  {classes.map((cls) => (
                    <Link
                      key={cls.id}
                      to={cls.id === 'sss2a' ? '/teacher/dashboard' : `/teacher/class/${cls.id}`}
                      className={`block py-2 text-sm font-bold transition-all ${
                        isClassActive(cls.id)
                          ? 'text-brand'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {cls.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events Link */}
          <Link
            to="/teacher/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive('/teacher/events') 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Events
          </Link>

          {/* Settings Link */}
          <Link
            to="/teacher/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive('/teacher/settings') 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <button 
            onClick={() => navigate('/teacher/settings')}
            className="w-full flex items-center gap-3 p-3 mb-4 hover:bg-slate-50 rounded-2xl transition-all text-left"
          >
            <img 
              src="https://picsum.photos/seed/teacher/100/100" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Mr. Uzo Kelechi</p>
              <p className="text-xs text-slate-500 truncate">Teacher</p>
            </div>
          </button>
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
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="relative w-full max-w-xs sm:max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-brand/10 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationDropdown role="teacher" />

            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="relative group">
              <button 
                onClick={() => navigate('/teacher/settings')}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Mr. Uzo Kelechi</p>
                  <p className="text-xs text-slate-500">Teacher</p>
                </div>
                <img 
                  src="https://picsum.photos/seed/teacher/100/100" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand/20"
                />
              </button>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button 
                  onClick={() => navigate('/teacher/settings')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4" /> My profile
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/class/:id" element={<StudentList />} />
            <Route path="/student/:id" element={<StudentDetails />} />
            <Route path="/events" element={<TeacherEvents />} />
            <Route path="/settings" element={<TeacherProfile />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
