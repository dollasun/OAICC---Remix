import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  LogOut, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Globe,
  Trash2
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';

export default function StudentProfile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeAccordion, setActiveAccordion] = useState<string | null>('personal');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState('https://picsum.photos/seed/student/200/200');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    forum: true,
    mentor: true
  });

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    showToast(`Two-Factor Authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification preferences updated');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] object-cover border-4 border-slate-50 shadow-lg group-hover:opacity-90 transition-all"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/40 backdrop-blur-sm p-3 rounded-2xl text-white">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Bolu Ahmed</h1>
            <p className="text-lg font-bold text-brand mb-4">Student @ Lagos City College</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-500">
                <Mail className="w-4 h-4" /> bolu.ahmed@example.com
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-500">
                <MapPin className="w-4 h-4" /> Lagos, Nigeria
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Accordion */}
      <div className="space-y-4">
        {/* Personal Information */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleAccordion('personal')}
            className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                <User className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-sm font-medium text-slate-500">Update your name, email, and location</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${activeAccordion === 'personal' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {activeAccordion === 'personal' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-slate-50"
              >
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input type="text" defaultValue="Bolu Ahmed" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input type="email" defaultValue="bolu.ahmed@example.com" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <input type="tel" defaultValue="+234 801 234 5678" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                      <input type="text" defaultValue="Lagos, Nigeria" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => showToast('Profile updated successfully!')}
                      className="px-8 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security & Password */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <button 
            onClick={() => toggleAccordion('security')}
            className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900">Security & Password</h3>
                <p className="text-sm font-medium text-slate-500">Manage your password and account security</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${activeAccordion === 'security' ? 'rotate-180' : ''}`} />
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
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px]">
                    <div>
                      <h4 className="font-bold text-slate-900">Account Password</h4>
                      <p className="text-sm font-medium text-slate-500">Last changed 3 months ago</p>
                    </div>
                    <button 
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:border-brand hover:text-brand transition-all"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px]">
                    <div>
                      <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-sm font-medium text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      onClick={handleToggle2FA}
                      className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${is2FAEnabled ? 'bg-brand' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${is2FAEnabled ? 'right-1' : 'left-1'}`}></div>
                    </button>
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
            className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                <p className="text-sm font-medium text-slate-500">Control how you receive updates and alerts</p>
              </div>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${activeAccordion === 'notifications' ? 'rotate-180' : ''}`} />
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
                    { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { id: 'push', label: 'Push Notifications', desc: 'Receive alerts on your device' },
                    { id: 'forum', label: 'Forum Mentions', desc: 'Alert when someone mentions you in forum' },
                    { id: 'mentor', label: 'Mentor Messages', desc: 'Alert for new messages from mentors' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.label}</h4>
                        <p className="text-sm font-medium text-slate-500">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleToggleNotification(item.id as keyof typeof notifications)}
                        className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${notifications[item.id as keyof typeof notifications] ? 'bg-brand' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.id as keyof typeof notifications] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => setIsSignOutOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
          <Trash2 className="w-5 h-5" /> Delete Account
        </button>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChangePasswordOpen(false)}
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
                  <button onClick={() => setIsChangePasswordOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsChangePasswordOpen(false);
                        showToast('Password updated successfully!');
                      }}
                      className="py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all"
                    >
                      Update Password
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
        {isSignOutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignOutOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                  <LogOut className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign Out?</h2>
                <p className="text-slate-500 font-medium mb-8">Are you sure you want to sign out of your account?</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsSignOutOpen(false)}
                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
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
