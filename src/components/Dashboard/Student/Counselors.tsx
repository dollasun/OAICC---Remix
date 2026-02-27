import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  UserCircle, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  ChevronRight,
  MapPin,
  CheckCircle2,
  Clock,
  BookOpen,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const counselors = [
  {
    id: 1,
    name: 'Mrs. Adebayo Funke',
    role: 'Senior Academic Counselor',
    school: 'Lagos City College',
    expertise: ['University Admissions', 'Scholarships', 'Subject Selection'],
    rating: 4.9,
    image: 'https://picsum.photos/seed/counselor1/400/400',
    location: 'Lagos, Nigeria',
    isVerified: true,
    description: 'Helping students achieve their academic goals and secure admissions to top universities worldwide.'
  },
  {
    id: 2,
    name: 'Mr. David Okafor',
    role: 'Career Guidance Counselor',
    school: 'Federal Government College',
    expertise: ['Career Mapping', 'Vocational Training', 'Skill Assessment'],
    rating: 4.8,
    image: 'https://picsum.photos/seed/counselor2/400/400',
    location: 'Abuja, Nigeria',
    isVerified: true,
    description: 'Dedicated to guiding students towards fulfilling career paths based on their unique strengths.'
  },
  {
    id: 3,
    name: 'Ms. Sarah Williams',
    role: 'Student Wellbeing Counselor',
    school: 'International School',
    expertise: ['Mental Health', 'Stress Management', 'Life Coaching'],
    rating: 5.0,
    image: 'https://picsum.photos/seed/counselor3/400/400',
    location: 'Ibadan, Nigeria',
    isVerified: true,
    description: 'Supporting students in maintaining a healthy balance between academics and personal wellbeing.'
  }
];

export default function Counselors() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select Counselor, 2: Form
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  const expertiseList = ['All', 'University Admissions', 'Scholarships', 'Career Mapping', 'Mental Health', 'Subject Selection'];

  const filteredCounselors = counselors.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         counselor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         counselor.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpertise = selectedExpertise === 'All' || counselor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const handleBookSession = () => {
    if (counselors.length === 1) {
      setSelectedCounselor(counselors[0]);
      setBookingStep(2);
    } else {
      setBookingStep(1);
    }
    setIsBookingModalOpen(true);
  };

  const handleSelectCounselor = (counselor: any) => {
    setSelectedCounselor(counselor);
    setBookingStep(2);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert(`Session booked with ${selectedCounselor.name} for ${bookingData.date} at ${bookingData.time}. Reason: ${bookingData.reason}`);
    setIsBookingModalOpen(false);
    setBookingStep(1);
    setSelectedCounselor(null);
    setBookingData({ date: '', time: '', reason: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academic Counselors</h1>
          <p className="text-slate-500 font-medium mt-1">Get professional guidance on your academic journey and university applications.</p>
        </div>
        <button 
          onClick={handleBookSession}
          className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-all"
        >
          <Calendar className="w-5 h-5" /> Book a Session
        </button>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {bookingStep === 1 ? 'Select a Counselor' : `Book Session with ${selectedCounselor?.name}`}
                  </h2>
                  <button onClick={() => setIsBookingModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {bookingStep === 1 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {counselors.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCounselor(c)}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand hover:bg-brand/5 transition-all text-left group"
                      >
                        <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors">{c.name}</h4>
                          <p className="text-xs font-bold text-slate-500">{c.role}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-brand" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleConfirmBooking} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                        <input 
                          type="date" 
                          required
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Time</label>
                        <input 
                          type="time" 
                          required
                          value={bookingData.time}
                          onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Reason for Appointment</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Briefly describe what you'd like to discuss..."
                        value={bookingData.reason}
                        onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      {counselors.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                        >
                          Back
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="flex-[2] py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-105 transition-all"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, school, or expertise..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {expertiseList.map(exp => (
            <button
              key={exp}
              onClick={() => setSelectedExpertise(exp)}
              className={`px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                selectedExpertise === exp
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand hover:text-brand'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Counselor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCounselors.map((counselor, index) => (
          <motion.div
            key={counselor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
          >
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <img 
                    src={counselor.image} 
                    alt={counselor.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50"
                  />
                  {counselor.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-brand text-white p-1 rounded-lg border-2 border-white">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Available Today
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand transition-colors">{counselor.name}</h3>
              <p className="text-sm font-bold text-slate-500 mb-4">{counselor.role}</p>
              
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                <MapPin className="w-3.5 h-3.5" /> {counselor.location}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Affiliated School
                </div>
                <p className="text-sm font-bold text-slate-700">{counselor.school}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {counselor.expertise.map((exp) => (
                  <span key={exp} className="px-3 py-1.5 bg-brand/5 text-brand rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    {exp}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => navigate(`/student/counselors/${counselor.id}`)}
                className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl group-hover:bg-brand group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Profile <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resources Banner */}
      <div className="bg-brand rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Academic Resources</h2>
            <p className="text-white/80 text-lg font-medium mb-8">
              Access our curated collection of guides, templates, and scholarship lists to help you succeed.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-brand px-8 py-3.5 rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Browse Resources
              </button>
              <button className="bg-brand-dark bg-opacity-20 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-opacity-30 transition-all">
                Scholarship List
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm relative">
              <GraduationCap className="w-24 h-24 text-white" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl rotate-12">
                <CheckCircle2 className="w-8 h-8 text-brand" />
              </div>
            </div>
          </div>
        </div>
        <UserCircle className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5" />
      </div>
    </div>
  );
}
