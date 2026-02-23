import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  ChevronRight, 
  Camera, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function AdminSettings() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('personal');

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your administrative profile and account security.</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-8">
        <div className="relative group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/admin/200/200" 
            alt="Profile" 
            className="w-32 h-32 rounded-[40px] object-cover border-4 border-slate-50 shadow-xl group-hover:opacity-80 transition-all"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl">
              <Camera className="w-6 h-6 text-brand" />
            </div>
          </div>
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-3xl font-bold text-slate-900">Bolu Ahmed</h2>
          <p className="text-slate-500 font-medium mt-1">Super Admin • boluahmed@oaicc.com</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
            <span className="px-4 py-1.5 bg-brand/10 text-brand rounded-xl text-xs font-bold uppercase tracking-widest">Full Access</span>
            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-100">Joined Jan 2022</span>
          </div>
        </div>
        <button 
          onClick={() => setIsSignOutModalOpen(true)}
          className="px-6 py-3 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>

      {/* Settings Accordion */}
      <div className="space-y-4">
        {/* Personal Information */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleAccordion('personal')}
            className="w-full p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                <p className="text-sm font-medium text-slate-400">Update your name, email and phone number</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${activeAccordion === 'personal' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {activeAccordion === 'personal' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-50"
              >
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                      <input type="text" defaultValue="Bolu" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                      <input type="text" defaultValue="Ahmed" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input type="email" defaultValue="boluahmed@oaicc.com" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <input type="tel" defaultValue="+234 812 345 6789" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-10 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all">Save Changes</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleAccordion('security')}
            className="w-full p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Security</h3>
                <p className="text-sm font-medium text-slate-400">Manage your password and account protection</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${activeAccordion === 'security' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {activeAccordion === 'security' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-50"
              >
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                    <div>
                      <h4 className="font-bold text-slate-900">Password</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Last changed 3 months ago</p>
                    </div>
                    <button 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 hover:border-brand hover:text-brand transition-all shadow-sm"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                    <div>
                      <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    {(() => {
                      const [is2FAEnabled, setIs2FAEnabled] = useState(false);
                      return (
                        <div 
                          onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                          className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${is2FAEnabled ? 'bg-brand' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${is2FAEnabled ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleAccordion('notifications')}
            className="w-full p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
                <p className="text-sm font-medium text-slate-400">Choose what you want to be notified about</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${activeAccordion === 'notifications' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {activeAccordion === 'notifications' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-50"
              >
                <div className="p-8 space-y-4">
                  {[
                    'New Forum Posts',
                    'New Mentor Applications',
                    'Event Registrations',
                    'System Updates',
                    'Security Alerts'
                  ].map((notif) => {
                    const [isEnabled, setIsEnabled] = useState(true);
                    return (
                      <div key={notif} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                        <span className="font-bold text-slate-700">{notif}</span>
                        <div 
                          onClick={() => setIsEnabled(!isEnabled)}
                          className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${isEnabled ? 'bg-brand' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isEnabled ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                    <div className="relative group">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                        placeholder="••••••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                    <input type={showPassword ? 'text' : 'password'} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" placeholder="••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                    <input type={showPassword ? 'text' : 'password'} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" placeholder="••••••••••••" />
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      onClick={() => setIsPasswordModalOpen(false)}
                      className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Update Password <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Out Modal */}
      <AnimatePresence>
        {isSignOutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignOutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <LogOut className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign Out</h2>
                <p className="text-slate-500 font-medium mb-10">Are you sure you want to sign out of your administrative account?</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsSignOutModalOpen(false)}
                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/signin'}
                    className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
