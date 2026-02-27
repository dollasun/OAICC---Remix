import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Edit2, 
  MessageSquare, 
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Link as LinkIcon,
  Camera
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mentorsStorage, eventsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

const initialMentors = [
  { id: 1, name: 'Mason Elpi', email: 'elpi@example.com', role: 'Design', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m1/100/100' },
  { id: 2, name: 'Amanda Lance', email: 'lance@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m2/100/100' },
  { id: 3, name: 'Bolu Ahmed', email: 'bolu@example.com', role: 'Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m3/100/100' },
  { id: 4, name: 'Lilian Okoh', email: 'lilian@example.com', role: 'Real Estate', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m4/100/100' },
  { id: 5, name: 'John Chidiebere', email: 'john@example.com', role: 'Software Engineering', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m5/100/100' },
  { id: 6, name: 'Adeola Bisoye', email: 'adeola@example.com', role: 'Medicine', date: 'Jan 6, 2022 4:26 PM', avatar: 'https://picsum.photos/seed/m6/100/100' },
  { id: 7, name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Marketing', date: 'Feb 12, 2023 10:15 AM', avatar: 'https://picsum.photos/seed/m7/100/100' },
  { id: 8, name: 'Michael Chen', email: 'michael@example.com', role: 'Finance', date: 'Mar 5, 2023 2:30 PM', avatar: 'https://picsum.photos/seed/m8/100/100' },
  { id: 9, name: 'Elena Rodriguez', email: 'elena@example.com', role: 'Law', date: 'Apr 20, 2023 9:45 AM', avatar: 'https://picsum.photos/seed/m9/100/100' },
  { id: 10, name: 'David Smith', email: 'david@example.com', role: 'Architecture', date: 'May 15, 2023 11:20 AM', avatar: 'https://picsum.photos/seed/m10/100/100' },
  { id: 11, name: 'Priya Sharma', email: 'priya@example.com', role: 'Data Science', date: 'Jun 8, 2023 3:10 PM', avatar: 'https://picsum.photos/seed/m11/100/100' },
  { id: 12, name: 'James Wilson', email: 'james@example.com', role: 'Psychology', date: 'Jul 22, 2023 1:55 PM', avatar: 'https://picsum.photos/seed/m12/100/100' },
  { id: 13, name: 'Isabella Garcia', email: 'isabella@example.com', role: 'Education', date: 'Aug 14, 2023 10:05 AM', avatar: 'https://picsum.photos/seed/m13/100/100' },
  { id: 14, name: 'Robert Taylor', email: 'robert@example.com', role: 'Business', date: 'Sep 30, 2023 4:40 PM', avatar: 'https://picsum.photos/seed/m14/100/100' },
  { id: 15, name: 'Sophie Martin', email: 'sophie@example.com', role: 'Journalism', date: 'Oct 18, 2023 12:25 PM', avatar: 'https://picsum.photos/seed/m15/100/100' },
  { id: 16, name: 'William Brown', email: 'william@example.com', role: 'Agriculture', date: 'Nov 5, 2023 8:50 AM', avatar: 'https://picsum.photos/seed/m16/100/100' },
  { id: 17, name: 'Olivia White', email: 'olivia@example.com', role: 'Hospitality', date: 'Dec 12, 2023 2:15 PM', avatar: 'https://picsum.photos/seed/m17/100/100' },
  { id: 18, name: 'Lucas Moore', email: 'lucas@example.com', role: 'Sports Management', date: 'Jan 25, 2024 11:30 AM', avatar: 'https://picsum.photos/seed/m18/100/100' },
  { id: 19, name: 'Noah Garcia', email: 'noah@example.com', role: 'Civil Engineering', date: 'Feb 10, 2024 9:00 AM', avatar: 'https://picsum.photos/seed/m19/100/100' },
  { id: 20, name: 'Mia Martinez', email: 'mia@example.com', role: 'Pharmacy', date: 'Feb 15, 2024 2:30 PM', avatar: 'https://picsum.photos/seed/m20/100/100' },
  { id: 21, name: 'Ethan Robinson', email: 'ethan@example.com', role: 'Cybersecurity', date: 'Feb 20, 2024 11:45 AM', avatar: 'https://picsum.photos/seed/m21/100/100' },
  { id: 22, name: 'Ava Clark', email: 'ava@example.com', role: 'Human Resources', date: 'Mar 1, 2024 10:20 AM', avatar: 'https://picsum.photos/seed/m22/100/100' },
  { id: 23, name: 'Liam Rodriguez', email: 'liam@example.com', role: 'Mechanical Engineering', date: 'Mar 5, 2024 3:15 PM', avatar: 'https://picsum.photos/seed/m23/100/100' },
  { id: 24, name: 'Charlotte Lewis', email: 'charlotte@example.com', role: 'Public Relations', date: 'Mar 10, 2024 1:00 PM', avatar: 'https://picsum.photos/seed/m24/100/100' },
  { id: 25, name: 'Benjamin Lee', email: 'benjamin@example.com', role: 'Artificial Intelligence', date: 'Mar 15, 2024 9:30 AM', avatar: 'https://picsum.photos/seed/m25/100/100' },
  { id: 26, name: 'Amelia Walker', email: 'amelia@example.com', role: 'Environmental Science', date: 'Mar 20, 2024 4:45 PM', avatar: 'https://picsum.photos/seed/m26/100/100' },
  { id: 27, name: 'James Hall', email: 'james.h@example.com', role: 'Real Estate Development', date: 'Mar 25, 2024 11:00 AM', avatar: 'https://picsum.photos/seed/m27/100/100' },
  { id: 28, name: 'Harper Young', email: 'harper@example.com', role: 'Veterinary Medicine', date: 'Apr 1, 2024 2:15 PM', avatar: 'https://picsum.photos/seed/m28/100/100' },
  { id: 29, name: 'Alexander King', email: 'alex@example.com', role: 'Aerospace Engineering', date: 'Apr 5, 2024 10:30 AM', avatar: 'https://picsum.photos/seed/m29/100/100' },
  { id: 30, name: 'Evelyn Wright', email: 'evelyn@example.com', role: 'Interior Design', date: 'Apr 10, 2024 3:50 PM', avatar: 'https://picsum.photos/seed/m30/100/100' },
];

export default function AdminMentorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const [mentor, setMentor] = useState<any>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', career: '', date: '', time: '', meetingLink: '' });

  useEffect(() => {
    const mentors = mentorsStorage.get(initialMentors);
    const found = mentors.find((m: any) => m.id.toString() === id);
    if (found) {
      setMentor(found);
    }
  }, [id]);

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      showToast('Please fill in all required fields');
      return;
    }

    const events = eventsStorage.get([]);
    const event = {
      id: Date.now(),
      title: newEvent.title,
      career: newEvent.career || mentor.role,
      mentor: mentor.name,
      date: newEvent.date,
      time: newEvent.time,
      meetingLink: newEvent.meetingLink,
      image: bgImage || 'https://picsum.photos/seed/event/800/400'
    };

    const updated = [...events, event];
    eventsStorage.save(updated);
    
    setIsEventModalOpen(false);
    setNewEvent({ title: '', career: '', date: '', time: '', meetingLink: '' });
    setBgImage(null);
    showToast('Event created successfully!');
  };

  if (!mentor) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button 
        onClick={() => navigate('/admin/mentors')}
        className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Mentors
      </button>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
              <img src={mentor.avatar} className="w-full aspect-square rounded-[40px] object-cover shadow-xl mb-6" alt={mentor.name} />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">{mentor.name}</h2>
                <p className="text-brand font-bold uppercase tracking-widest text-xs">{mentor.role} • Professional Mentor</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => navigate(`/admin/mentors/edit/${mentor.id}`)}
                    className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-5 h-5" /> Edit Profile
                  </button>
                  <button 
                    onClick={() => setIsEventModalOpen(true)}
                    className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3 space-y-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">About</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {mentor.bio || `${mentor.name} is an accomplished professional with extensive experience in ${mentor.role}. They have been committed to mentoring students and sharing their expertise to help the next generation of professionals succeed in their careers.`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="font-bold text-slate-700">{mentor.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="font-bold text-slate-700">{mentor.phone || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Upcoming Mentorship Event</h3>
                <div className="space-y-4">
                  {[
                    { date: '25 Nov', title: `${mentor.role} Workshop`, time: '13:00' },
                    { date: '28 Nov', title: 'Career Guidance Session', time: '13:00' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{event.date.split(' ')[1]}</span>
                          <span className="text-sm font-bold text-slate-900">{event.date.split(' ')[0]}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{event.title}</p>
                          <p className="text-xs font-medium text-slate-500">Session with {mentor.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{event.time}</p>
                        <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEventModalOpen(false)}
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
                    <h2 className="text-2xl font-bold text-slate-900">Create an Event</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Facilitated by {mentor.name}</p>
                  </div>
                  <button onClick={() => setIsEventModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
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
                      placeholder="e.g. Why Medicine is for you" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Event Career</label>
                    <input 
                      type="text" 
                      value={newEvent.career}
                      onChange={(e) => setNewEvent({ ...newEvent, career: e.target.value })}
                      placeholder={mentor.role} 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                    />
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
                          placeholder="June 15, 2023" 
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
                          placeholder="3:00 PM" 
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Meeting Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={newEvent.meetingLink}
                        onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                        placeholder="Add a Meeting Link" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button onClick={() => setIsEventModalOpen(false)} className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                    <button onClick={handleCreateEvent} className="py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
                      Create Event
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
