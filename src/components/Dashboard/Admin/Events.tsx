import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  X, 
  CheckCircle2,
  Camera,
  Link as LinkIcon,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import { eventsStorage } from '../../../utils/storage';

const initialEvents = [
  { id: 1, title: 'Why Medicine is for you', career: 'Medicine', mentor: 'Amanda Lance', date: 'June 15, 2023', time: '3:00 PM', image: 'https://picsum.photos/seed/e1/800/400' },
  { id: 2, title: 'Understanding Design fundamentals', career: 'Product Design', mentor: 'Mason Elpi', date: 'June 15, 2023', time: '3:00 PM', image: 'https://picsum.photos/seed/e2/800/400' },
  { id: 3, title: 'Pattern and Colors', career: 'Product Design', mentor: 'Mason Elpi', date: 'June 15, 2023', time: '3:00 PM', image: 'https://picsum.photos/seed/e3/800/400' },
  { id: 4, title: 'Data Structure', career: 'Software Engineering', mentor: 'John Chidiebere', date: 'June 15, 2023', time: '3:00 PM', image: 'https://picsum.photos/seed/e4/800/400' },
  { id: 5, title: 'Architecture Fundamental', career: 'Architecture', mentor: 'Adeola Bisoye', date: 'June 15, 2023', time: '3:00 PM', image: 'https://picsum.photos/seed/e5/800/400' },
  { id: 6, title: 'Engineering Fundamental', career: 'Engineering', mentor: 'Bolu Ahmed', date: 'June 15, 2023', time: '3:00 PM', image: 'https://picsum.photos/seed/e6/800/400' },
];

export default function AdminEvents() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', career: '', mentor: '', date: '', time: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    setEvents(eventsStorage.get(initialEvents));
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.career.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.mentor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEvent = () => {
    if (!newEvent.title) return;
    if (selectedEvent && isAddModalOpen) {
      const updated = events.map(e => e.id === selectedEvent.id ? { ...selectedEvent, ...newEvent, image: bgImage || selectedEvent.image } : e);
      setEvents(updated);
      eventsStorage.save(updated);
    } else {
      const event = {
        id: Date.now(),
        ...newEvent,
        image: bgImage || 'https://picsum.photos/seed/event/800/400'
      };
      const updated = [...events, event];
      setEvents(updated);
      eventsStorage.save(updated);
    }
    setIsAddModalOpen(false);
    setSelectedEvent(null);
    setNewEvent({ title: '', career: '', mentor: '', date: '', time: '' });
    setBgImage(null);
  };

  const handleEditEvent = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setNewEvent({ title: event.title, career: event.career, mentor: event.mentor, date: event.date, time: event.time });
    setBgImage(event.image);
    setIsAddModalOpen(true);
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter(e => e.id !== id);
      setEvents(updated);
      eventsStorage.save(updated);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-500 font-medium mt-1">Create and manage upcoming workshops, webinars, and fairs.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Create Event
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm w-fit">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'upcoming' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-12 py-3 rounded-2xl font-bold text-sm transition-all ${
            activeTab === 'past' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Past Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  {event.career}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleEditEvent(event, e)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-brand transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-600 rounded-lg hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1">{event.title}</h3>
              <div className="flex items-center gap-3 mb-6">
                <img src={`https://picsum.photos/seed/${event.mentor}/100/100`} className="w-8 h-8 rounded-full object-cover" alt={event.mentor} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest Mentor</p>
                  <p className="text-xs font-bold text-slate-700">{event.mentor}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                </div>
                <button 
                  onClick={() => handleViewEvent(event)}
                  className="text-brand font-bold text-xs hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 sm:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedEvent ? 'Edit Event' : 'Create an Event'}</h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">Fill in the details.</p>
                    </div>
                    <button onClick={() => { setIsAddModalOpen(false); setSelectedEvent(null); setNewEvent({ title: '', career: '', mentor: '', date: '', time: '' }); setBgImage(null); }} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Event Title</label>
                    <input 
                      type="text" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Why Medicine is for you" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Event Career</label>
                      <select 
                        value={newEvent.career}
                        onChange={(e) => setNewEvent({ ...newEvent, career: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Select the Event Career</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Product Design">Product Design</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Guest Mentor <span className="text-slate-400 text-xs font-medium">(Optional)</span></label>
                      <select 
                        value={newEvent.mentor}
                        onChange={(e) => setNewEvent({ ...newEvent, mentor: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-bold text-slate-700 appearance-none"
                      >
                        <option value="">Select the mentor</option>
                        <option value="Amanda Lance">Amanda Lance</option>
                        <option value="Mason Elpi">Mason Elpi</option>
                        <option value="John Chidiebere">John Chidiebere</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Background Image</label>
                    <div 
                      className="relative h-40 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand/50 transition-all group overflow-hidden"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => {
                              setBgImage(re.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      {bgImage ? (
                        <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" alt="Event" />
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A good background photo for the event</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          placeholder="Select a Preferred Date" 
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          placeholder="Select a Preferred Time" 
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Meeting Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" placeholder="Add a Meeting Link" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={() => { setIsAddModalOpen(false); setSelectedEvent(null); setNewEvent({ title: '', career: '', mentor: '', date: '', time: '' }); setBgImage(null); }} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleAddEvent} className="py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
                      {selectedEvent ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Event Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="relative h-64">
                <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/40 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-brand/10 text-brand rounded-xl text-xs font-bold uppercase tracking-widest">
                    {selectedEvent.career}
                  </span>
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {selectedEvent.date}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{selectedEvent.title}</h2>
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[32px] mb-8">
                  <img src={`https://picsum.photos/seed/${selectedEvent.mentor}/100/100`} className="w-14 h-14 rounded-2xl object-cover" alt={selectedEvent.mentor} />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Guest Mentor</p>
                    <p className="text-lg font-bold text-slate-900">{selectedEvent.mentor}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsViewModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Close</button>
                  <button className="flex-1 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    Join Event <Video className="w-5 h-5" />
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
