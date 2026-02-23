import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationsStorage } from '../../utils/storage';
import { Notification } from '../../types';

interface NotificationDropdownProps {
  role: string;
}

export default function NotificationDropdown({ role }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to OAICC!',
        body: 'We are excited to have you on board. Start exploring your career journey today.',
        timestamp: '2 hours ago',
        read: false
      },
      {
        id: '2',
        title: 'New Event Added',
        body: 'A new workshop "Introduction to AI" has been added to your schedule.',
        timestamp: '5 hours ago',
        read: true
      }
    ];
    setNotifications(notificationsStorage.get(initialNotifications));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    notificationsStorage.save(updated);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate(`/${role}/notifications`);
  };

  return (
    <div className="relative">
      <button 
        onMouseEnter={() => setIsOpen(true)}
        className="relative p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onMouseEnter={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onMouseEnter={() => setIsOpen(true)}
              className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <span className="px-2 py-1 bg-brand/10 text-brand text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  {unreadCount} New
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notification.read ? 'bg-brand/5' : ''}`}
                        onClick={() => navigate(`/${role}/notifications`)}
                      >
                        {!notification.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand"></div>
                        )}
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <button 
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="text-brand hover:text-brand-dark"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2 font-medium">
                          {notification.body}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> {notification.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">No notifications yet</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleViewAll}
                className="w-full py-4 bg-slate-50 text-brand font-bold text-sm hover:bg-slate-100 transition-colors border-t border-slate-100"
              >
                View all notifications
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
