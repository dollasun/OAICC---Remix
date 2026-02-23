import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle2, Clock, Trash2, Search, Filter } from 'lucide-react';
import { notificationsStorage } from '../../utils/storage';
import { Notification } from '../../types';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
      },
      {
        id: '3',
        title: 'Mentor Request Accepted',
        body: 'Dr. John Obi has accepted your mentor request. You can now message him.',
        timestamp: '1 day ago',
        read: false
      },
      {
        id: '4',
        title: 'Profile Update',
        body: 'Your profile has been successfully updated.',
        timestamp: '2 days ago',
        read: true
      }
    ];
    setNotifications(notificationsStorage.get(initialNotifications));
  }, []);

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    notificationsStorage.save(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    notificationsStorage.save(updated);
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    notificationsStorage.save(updated);
  };

  const filteredNotifications = notifications.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 font-medium mt-1">Stay updated with your latest activities and alerts.</p>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-brand hover:text-brand transition-all"
        >
          <CheckCircle2 className="w-5 h-5" /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-8 flex items-start gap-6 hover:bg-slate-50/50 transition-colors group relative ${!notification.read ? 'bg-brand/5' : ''}`}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand"></div>
                )}
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${!notification.read ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold truncate ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-xl transition-all"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium mb-4 leading-relaxed">
                    {notification.body}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="w-4 h-4" /> {notification.timestamp}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No notifications found</h3>
              <p className="text-slate-500 font-medium mt-2">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
