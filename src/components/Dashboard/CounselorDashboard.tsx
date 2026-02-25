import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  Search,
  UserCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Logo from '../Logo';

// Import Counselor Pages
import CounselorOverview from './Counselor/Overview';
import CounselorStudentDetails from './Counselor/StudentDetails';
import CounselorProfile from './Counselor/CounselorProfile';
import Sessions from './Counselor/Sessions';
import Messages from './Counselor/Messages';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/counselor/dashboard' },
  { icon: Users, label: 'Students', path: '/counselor/students' },
  { icon: Calendar, label: 'Sessions', path: '/counselor/sessions' },
  { icon: MessageSquare, label: 'Messages', path: '/counselor/messages', badge: 2 },
  { icon: Settings, label: 'Settings', path: '/counselor/settings' },
];

export default function CounselorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isCounselor = localStorage.getItem('counselor_auth') === 'true';
    if (!isCounselor) {
      navigate('/counselor/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('counselor_auth');
    localStorage.removeItem('user_role');
    navigate('/counselor/signin');
  };

  const activeItem = navItems.find(item => location.pathname.startsWith(item.path)) || navItems[0];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-100 z-50 transition-all duration-300 hidden lg:block ${
          isSidebarOpen ? 'w-72' : 'w-24'
        }`}
      >
        <div className="p-8 flex items-center justify-between">
          <Logo size={isSidebarOpen ? 'md' : 'sm'} hideText={!isSidebarOpen} />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          <p className={`px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'Counselor Menu' : 'Menu'}
          </p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group ${
                location.pathname.startsWith(item.path)
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon className={`w-6 h-6 shrink-0 ${location.pathname.startsWith(item.path) ? 'text-white' : 'group-hover:text-brand'}`} />
              {isSidebarOpen && <span>{item.label}</span>}
              {item.badge && (
                <span className={`ml-auto w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  location.pathname.startsWith(item.path) ? 'bg-white text-brand' : 'bg-brand text-white'
                }`}>
                  {item.badge}
                </span>
              )}
              {isSidebarOpen && !item.badge && location.pathname.startsWith(item.path) && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-4">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-6 h-6 shrink-0 group-hover:text-red-500" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-[70] lg:hidden shadow-2xl"
            >
              <div className="p-8 flex items-center justify-between">
                <Logo size="md" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <nav className="px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                      location.pathname.startsWith(item.path)
                        ? 'bg-brand text-white shadow-lg shadow-brand/20'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <item.icon className="w-6 h-6 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
        {/* Top Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-8 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 hover:bg-slate-50 rounded-xl lg:hidden text-slate-400"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <span className="text-sm font-bold uppercase tracking-widest">Counselor Portal</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-bold text-slate-900">{activeItem.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 w-64 font-medium text-sm"
                />
              </div>
              <NotificationDropdown role="counselor" />
              <Link to="/counselor/settings" className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Mr. Alfred Funmbi</p>
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Counselor</p>
                </div>
                <img 
                  src="https://picsum.photos/seed/counselor/100/100" 
                  alt="Counselor" 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-slate-50 shadow-sm"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="dashboard" element={<CounselorOverview />} />
            <Route path="students" element={<CounselorOverview />} />
            <Route path="students/:id" element={<CounselorStudentDetails />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<CounselorProfile />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
