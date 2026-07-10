import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useToast } from '../../../context/ToastContext';
import { mentorsStorage } from '../../../utils/storage';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Globe, 
  Linkedin, 
  Twitter,
  Award,
  Clock,
  ChevronRight,
  Shield,
  UserCircle
} from 'lucide-react';

export default function MentorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [mentor, setMentor] = useState<any>(null);

  useEffect(() => {
    const allMentors = mentorsStorage.get();
    const found = allMentors.find((m: any) => m.id === Number(id));
    if (found) {
      // Merge with some default structured data if the storage item is simple
      setMentor({
        ...found,
        location: found.location || 'Remote',
        rating: found.rating || 5.0,
        reviews: found.reviews || 0,
        isVerified: true,
        expertise: found.expertise ? (Array.isArray(found.expertise) ? found.expertise : [found.expertise]) : ['Career Guidance'],
        experience: found.currentRole ? [
          { role: found.currentRole, company: found.company || 'Independent', period: 'Present' }
        ] : [
          { role: found.role || 'Professional', company: found.company || 'Independent', period: 'Present' }
        ],
        education: found.institution ? [
          { degree: found.department || 'Degree', school: found.institution, year: '' }
        ] : [],
        availability: '2-3 hours per week'
      });
    }
  }, [id]);

  const handleSendRequest = () => {
    setIsRequesting(false);
    showToast('Mentorship request sent successfully!');
  };

  if (!mentor) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <UserCircle className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Mentor not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand font-bold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Mentors
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative">
                  <img 
                    src={mentor.avatar || mentor.image || `https://picsum.photos/seed/${mentor.id}/600/600`} 
                    alt={mentor.name} 
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-slate-50 shadow-sm"
                  />
                  {mentor.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-brand text-white p-2 rounded-lg border-4 border-white shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">{mentor.name}</h1>
                      <p className="text-lg font-bold text-brand">{mentor.currentRole || mentor.role} {mentor.company ? `@ ${mentor.company}` : ''}</p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      {mentor.linkedin && (
                        <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand hover:bg-brand/5 transition-all">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {mentor.twitter && (
                        <a href={mentor.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand hover:bg-brand/5 transition-all">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {mentor.website && (
                        <a href={mentor.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-brand hover:bg-brand/5 transition-all">
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {mentor.location}</span>
                    <span className="flex items-center gap-2"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {mentor.rating} ({mentor.reviews} reviews)</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {mentor.availability}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About Me</h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    {mentor.bio || 'This mentor has not provided a biography yet.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Expertise</h3>
                  <div className="flex flex-wrap gap-3">
                    {mentor.expertise.map((exp: string) => (
                      <span key={exp} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mentor.experience && mentor.experience.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand" /> Experience
                </h3>
                <div className="space-y-6">
                  {mentor.experience.map((exp: any, i: number) => (
                    <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 last:before:hidden">
                      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand"></div>
                      <h4 className="font-bold text-slate-900">{exp.role}</h4>
                      <p className="text-sm font-bold text-slate-500">{exp.company}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">{exp.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mentor.education && mentor.education.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand" /> Education
                </h3>
                <div className="space-y-6">
                  {mentor.education.map((edu: any, i: number) => (
                    <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100 last:before:hidden">
                      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand"></div>
                      <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                      <p className="text-sm font-bold text-slate-500">{edu.school}</p>
                      {edu.year && <p className="text-xs font-bold text-slate-400 mt-1">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6 sticky top-28">
            <div className="text-center pb-6 border-b border-slate-50">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Mentorship</p>
              <h3 className="text-2xl font-bold text-slate-900">Request Guidance</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <MessageSquare className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">1-on-1 Chat</p>
                  <p className="text-xs font-medium text-slate-500">Direct messaging for quick questions and advice.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <Calendar className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Video Calls</p>
                  <p className="text-xs font-medium text-slate-500">Schedule 30-min sessions for deep career discussions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <Award className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Project Review</p>
                  <p className="text-xs font-medium text-slate-500">Get feedback on your personal projects or portfolio.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsRequesting(true)}
              className="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Request Mentorship
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
              <Shield className="w-3.5 h-3.5" /> Secure & Verified Mentor
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal Placeholder */}
      {isRequesting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsRequesting(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Mentorship</h2>
              <p className="text-slate-500 font-medium mb-8">Tell {mentor.name} why you'd like to connect and what you're hoping to learn.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                  <textarea 
                    rows={4}
                    placeholder={`Hi ${mentor.name.split(' ')[0]}, I'm really interested in your work and saw your profile...`}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-brand/20 font-medium text-slate-700 resize-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsRequesting(false)}
                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSendRequest}
                    className="py-4 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
