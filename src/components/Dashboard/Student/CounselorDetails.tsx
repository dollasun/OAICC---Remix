import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Shield,
  BookOpen,
  Award,
  Users,
  Info,
  Video
} from 'lucide-react';
import { counselingSessionsStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

export default function CounselorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'activity'>('about');
  const [bookingData, setBookingData] = useState({ date: '', time: '09:00 AM', reason: '' });

  // Mock data for a single counselor
  const counselor = {
    id: Number(id) || 1,
    name: 'Mrs. Adebayo Funke',
    role: 'Senior Academic Counselor',
    school: 'Lagos City College',
    image: 'https://picsum.photos/seed/counselor1/600/600',
    location: 'Lagos, Nigeria',
    rating: 4.9,
    reviews: 86,
    isVerified: true,
    expertise: ['University Admissions', 'Scholarships', 'Subject Selection', 'Career Mapping', 'Study Abroad'],
    bio: 'With over 15 years of experience in academic counseling, I have helped thousands of students navigate their educational paths. My expertise lies in university admissions processes, both locally and internationally, and I am dedicated to helping students find the right scholarships to fund their dreams.',
    experience: [
      { role: 'Senior Academic Counselor', school: 'Lagos City College', period: '2015 - Present' },
      { role: 'Guidance Counselor', school: 'Queens College', period: '2008 - 2015' }
    ],
    education: [
      { degree: 'M.Ed. in Guidance and Counseling', school: 'University of Lagos', year: '2007' },
      { degree: 'B.A. in Education', school: 'Obafemi Awolowo University', year: '2004' }
    ],
    availability: 'Mon - Fri, 9:00 AM - 4:00 PM',
    services: [
      { name: 'University Application Review', price: 'Free for students' },
      { name: 'Scholarship Guidance', price: 'Free for students' },
      { name: 'Subject Selection Consultation', price: 'Free for students' }
    ],
    activityTree: [
      { id: 1, title: 'Initial Consultation', date: 'Oct 01, 2024', status: 'Completed', type: 'session' },
      { id: 2, title: 'Career Interest Quiz Review', date: 'Oct 10, 2024', status: 'Completed', type: 'quiz' },
      { id: 3, title: 'University Selection', date: 'Oct 25, 2024', status: 'Upcoming', type: 'session' },
    ]
  };

  const sessions = counselingSessionsStorage.get([]).filter((s: any) => s.counselorId === counselor.id);

  const handleConfirmBooking = () => {
    if (!bookingData.date) {
      showToast('Please select a date');
      return;
    }
    const newSession = {
      id: Date.now(),
      counselorId: counselor.id,
      counselorName: counselor.name,
      studentName: 'Osayuki Yuki', // Mocked current student
      studentImage: 'https://picsum.photos/seed/student/100/100',
      title: bookingData.reason || 'General Consultation',
      date: bookingData.date,
      time: bookingData.time,
      type: 'Virtual',
      status: 'Upcoming'
    };
    const allSessions = counselingSessionsStorage.get([]);
    counselingSessionsStorage.save([...allSessions, newSession]);
    setIsBooking(false);
    setBookingData({ date: '', time: '09:00 AM', reason: '' });
    showToast('Session booked successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Counselors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative">
                  <img 
                    src={counselor.image} 
                    alt={counselor.name} 
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] object-cover border-4 border-slate-50 shadow-lg"
                  />
                  {counselor.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-brand text-white p-2 rounded-xl border-4 border-white shadow-lg">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-slate-900">{counselor.name}</h1>
                    <p className="text-lg font-bold text-brand">{counselor.role}</p>
                    <p className="text-sm font-bold text-slate-500 mt-1">{counselor.school}</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {counselor.location}</span>
                    <span className="flex items-center gap-2"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {counselor.rating} ({counselor.reviews} reviews)</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {counselor.availability}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-12 border-b border-slate-100">
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'about' ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  About Counselor
                  {activeTab === 'about' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
                </button>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'activity' ? 'text-brand' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Activity Tree
                  {activeTab === 'activity' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
                </button>
              </div>

              <div className="mt-8">
                {activeTab === 'about' ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">About Me</h3>
                      <p className="text-slate-600 font-medium leading-relaxed text-lg">
                        {counselor.bio}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6">Expertise</h3>
                      <div className="flex flex-wrap gap-3">
                        {counselor.expertise.map((exp) => (
                          <span key={exp} className="px-5 py-2.5 bg-brand/5 border border-brand/10 rounded-2xl text-sm font-bold text-brand">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                      {counselor.activityTree.map((activity) => (
                        <div key={activity.id} className="relative">
                          <div className={`absolute left-[-36px] top-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                            activity.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-brand text-white'
                          }`}>
                            {activity.type === 'session' ? <Calendar className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                          </div>
                          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.date}</span>
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                                activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand/10 text-brand'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{activity.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {activeTab === 'about' && (
            <>
              {/* Services */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand" /> Counseling Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {counselor.services.map((service, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand/20 transition-all group">
                      <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{service.name}</h4>
                      <p className="text-xs font-bold text-emerald-500 mt-2 uppercase tracking-wider">{service.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-brand" /> Education
                  </h3>
                  <div className="space-y-6">
                    {counselor.education.map((edu, i) => (
                      <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 last:before:hidden">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand"></div>
                        <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                        <p className="text-sm font-bold text-slate-500">{edu.school}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand" /> Professional History
                  </h3>
                  <div className="space-y-6">
                    {counselor.experience.map((exp, i) => (
                      <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 last:before:hidden">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand"></div>
                        <h4 className="font-bold text-slate-900">{exp.role}</h4>
                        <p className="text-sm font-bold text-slate-500">{exp.school}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">{exp.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {sessions.length > 0 && (
            <div className="bg-emerald-500 p-8 rounded-[32px] text-white shadow-xl shadow-emerald-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Scheduled Session
              </h3>
              <div className="space-y-4">
                {sessions.map((session: any) => (
                  <div key={session.id} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="font-bold">{session.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm font-medium text-white/80">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {session.time}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {session.date}</span>
                    </div>
                    <button className="w-full mt-4 py-2 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all text-sm">
                      Join Meeting
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 sticky top-28">
            <div className="text-center pb-6 border-b border-slate-50">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Appointment</p>
              <h3 className="text-2xl font-bold text-slate-900">Book a Session</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <Calendar className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Virtual Meeting</p>
                  <p className="text-xs font-medium text-slate-500">Video call session via Zoom or Google Meet.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">In-Person</p>
                  <p className="text-xs font-medium text-slate-500">Visit the counselor at their school office.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsBooking(true)}
              className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Schedule Appointment
            </button>
            
            <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-blue-700">
                Counseling sessions are free for all registered students of {counselor.school}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBooking(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Book a Session</h2>
                <p className="text-slate-500 font-medium mb-8">Select a date and time for your session with {counselor.name}.</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                      <input 
                        type="date" 
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
                      <select 
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700"
                      >
                        <option>09:00 AM</option>
                        <option>10:30 AM</option>
                        <option>01:00 PM</option>
                        <option>02:30 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Visit</label>
                    <textarea 
                      rows={3}
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      placeholder="I need help with my university application..."
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setIsBooking(false)}
                      className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleConfirmBooking}
                      className="py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
                    >
                      Confirm Booking
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
