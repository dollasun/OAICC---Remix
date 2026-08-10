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
  Calendar
} from 'lucide-react';
import Logo from '../Logo';
import ChildrenList from './ChildrenList';
import ChildDetails from './ChildDetails';
import ProfileSettings from './ProfileSettings';
import ParentEvents from './Parent/ParentEvents';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import NotificationPage from '../Notifications/NotificationPage';
import ThemeToggle from '../ThemeToggle';

const children = [
  { id: '1', name: 'Favour Aina' },
  { id: '2', name: 'Gbenga Aina' },
];

export default function ParentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChildrenExpanded, setIsChildrenExpanded] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isChildActive = (id: string) => {
    return location.pathname === `/parent/child/${id}`;
  };

  const isChildrenSectionActive = () => {
    return location.pathname === '/parent/dashboard' || location.pathname.startsWith('/parent/child/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50 hidden lg:flex">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* Home/Dashboard Link */}
          <Link
            to="/parent/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/parent/dashboard') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>

          {/* Children Section with Submenu */}
          <div className="space-y-1">
            <button
              onClick={() => setIsChildrenExpanded(!isChildrenExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold transition-all ${
                isChildrenSectionActive() && !isActive('/parent/dashboard')
                  ? 'bg-brand text-white shadow-sm shadow-brand/5'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                Child
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isChildrenExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isChildrenExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-1 pl-12"
                >
                  {children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/parent/child/${child.id}`}
                      className={`block py-2 text-sm font-bold transition-all ${
                        isChildActive(child.id)
                          ? 'text-brand'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events Link */}
          <Link
            to="/parent/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/parent/events') 
                ? 'bg-brand text-white shadow-sm shadow-brand/5' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Events
          </Link>

          {/* Settings Link */}
          <Link
            to="/parent/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
              isActive('/parent/settings') 
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
            onClick={() => navigate('/parent/settings')}
            className="w-full flex items-center gap-3 p-3 mb-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-left"
          >
            <img 
              src="https://picsum.photos/seed/parent/100/100" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">Dr. Fadeyibi Aina</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Parent</p>
            </div>
          </button>
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
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-4 lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="relative w-full max-w-xs sm:max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-4 focus:ring-brand/10 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationDropdown role="parent" />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Dr. Fadeyibi Aina</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Parent</p>
                </div>
                <img 
                  src="https://picsum.photos/seed/parent/100/100" 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand/20"
                />
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
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
                        onClick={() => { navigate('/parent/settings'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4" /> My profile
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
            <Route path="/" element={<ChildrenList />} />
            <Route path="dashboard" element={<ChildrenList />} />
            <Route path="child/:id" element={<ChildDetails />} />
            <Route path="dashboard/child/:id" element={<ChildDetails />} />
            <Route path="events" element={<ParentEvents />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="notifications" element={<NotificationPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
