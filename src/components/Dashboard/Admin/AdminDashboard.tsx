import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Users, 
  UserSquare2, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Logo from '../../Logo';

// Import Admin Pages
import AdminOverview from './Overview';
import AdminCareers from './Careers';
import AdminCreateCareer from './CreateCareer';
import AdminEditCareer from './EditCareer';
import AdminForums from './Forums';
import AdminMentors from './Mentors';
import AdminCounselors from './Counselors';
import AdminUsers from './AdminUsers';
import AdminEvents from './Events';
import AdminSettings from './Settings';
import AdminForumDetails from './ForumDetails';
import AdminDiscussionDetails from './DiscussionDetails';
import AdminStudentView from './StudentView';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Briefcase, label: 'Career', path: '/admin/careers' },
  { icon: MessageSquare, label: 'Forum', path: '/admin/forums' },
  { icon: Users, label: 'Mentor', path: '/admin/mentors' },
  { icon: UserSquare2, label: 'Counselor', path: '/admin/counselors' },
  { icon: Calendar, label: 'Events', path: '/admin/events' },
  { icon: ShieldCheck, label: 'Admin Users', path: '/admin/users' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_auth') === 'true';
    if (!isAdmin) {
      navigate('/admin/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('user_role');
    navigate('/admin/signin');
  };

  const activeItem = menuItems.find(item => location.pathname.startsWith(item.path)) || menuItems[0];

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
            {isSidebarOpen ? 'Admin Dashboard' : 'Admin'}
          </p>
          {menuItems.map((item) => (
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
              {isSidebarOpen && location.pathname.startsWith(item.path) && (
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
                {menuItems.map((item) => (
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
                <span className="text-sm font-bold uppercase tracking-widest">Admin Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-bold text-slate-900">{activeItem.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 w-64 font-medium text-sm"
                />
              </div>
              <button className="relative p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Bolu Ahmed</p>
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Super Admin</p>
                </div>
                <img 
                  src="https://picsum.photos/seed/admin/100/100" 
                  alt="Admin" 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-slate-50 shadow-sm"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="careers/create" element={<AdminCreateCareer />} />
            <Route path="careers/edit/:id" element={<AdminEditCareer />} />
            <Route path="forums" element={<AdminForums />} />
            <Route path="forums/:id" element={<AdminForumDetails />} />
            <Route path="forums/:id/discussion/:discussionId" element={<AdminDiscussionDetails />} />
            <Route path="mentors" element={<AdminMentors />} />
            <Route path="counselors" element={<AdminCounselors />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="students/:id" element={<AdminStudentView />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
