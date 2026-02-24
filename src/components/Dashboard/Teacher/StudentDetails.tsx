import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../context/ToastContext';
import { 
  User, 
  Target, 
  Activity as ActivityIcon, 
  Calendar, 
  Filter,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Bell,
  Search,
  X
} from 'lucide-react';

const activities = [
  { id: '1', type: 'Mentor', title: 'Requested a Mentor', description: 'You just Requested a mentor for Front-end development', time: '09:00 am', date: 'Today, Wednesday 31 March, 2022' },
  { id: '2', type: 'Interest', title: 'Followed an Interest', description: 'You followed Medicine as an interest. You will be able to see articles, videos and content regarding medicine as an interest.', time: '11:00 am', date: 'Today, Wednesday 31 March, 2022' },
  { id: '3', type: 'Quiz', title: 'Career Interest Quiz Result', description: 'Congratulations on completing the quiz career assessment. It evaluate and measure your interest and personality so we can find the right career for you. Click here to view result.', time: '12:00 pm', date: 'Today, Wednesday 31 March, 2022' },
  { id: '4', type: 'System', title: 'Welcome to your dashboard', description: 'Congratulations on signing up! Your career journey begins now.', time: '02:00 pm', date: 'Today, Wednesday 31 March, 2022' },
];

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'interests' | 'tracker'>('profile');
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const student = {
    firstName: 'Rasaq',
    lastName: 'Desmond',
    class: 'SSS 2 A',
    school: 'The Seaside School',
    avatar: 'https://picsum.photos/seed/rasaq/200/200'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img src={student.avatar} alt={student.firstName} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-slate-400 text-sm font-medium">{student.class}</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900 text-sm font-bold">{student.firstName} {student.lastName}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
          <p className="text-slate-500 font-medium">Institution: {student.school}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl w-fit">
        {[
          { id: 'profile', label: 'Profile Information' },
          { id: 'interests', label: 'Career Interest' },
          { id: 'tracker', label: 'Tracker' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-brand shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'profile' && (
            <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 space-y-12">
              <div className="space-y-6">
                {[
                  { label: 'First Name', value: 'Favour' },
                  { label: 'Last Name', value: 'Aina' },
                  { label: 'Email Address', value: 'favouraina@gmail.com' },
                  { label: 'Phone Number', value: '08054883021' },
                  { label: 'Gender', value: 'Female' },
                  { label: 'Class', value: 'JSS 3' },
                  { label: 'Bio', value: 'I am an JSS 3 student at The Seaside School based in Nigeria. I would love to pursue a degree in Computer science. I am currently in a Tech wiz club at my secondary school.' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[200px_1fr] gap-4 items-start">
                    <p className="text-slate-500 font-medium">{item.label}</p>
                    <p className="text-slate-900 font-bold leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Counselor</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/counselor/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Counselor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Sarah Ojo</p>
                        <p className="text-xs text-slate-500">Counselor at OAICC</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Mentor</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Mentor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mason Biyi</p>
                        <p className="text-xs text-slate-500">Full Stack Developer at Moniepoint</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Teacher</h4>
                    <div className="flex items-center gap-3">
                      <img src="https://picsum.photos/seed/teacher/100/100" className="w-12 h-12 rounded-xl object-cover" alt="Teacher" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mr. Uzo Kelechi</p>
                        <p className="text-xs text-slate-500">Teacher at The Seaside School</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Front-end Developer</h2>
                <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video">
                  <img src="https://picsum.photos/seed/coding/800/450" className="w-full h-full object-cover" alt="Coding" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <button onClick={() => setIsInterestModalOpen(true)} className="btn-primary px-8">View details</button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Mentor</h3>
                    <div className="flex items-center gap-4">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-14 h-14 rounded-full object-cover" alt="Mentor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mason Biyi</p>
                        <p className="text-xs text-slate-500">Full Stack Developer at Techinnover</p>
                      </div>
                      <button className="ml-auto text-brand font-bold text-sm hover:underline">View more</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Recent Activities By {student.firstName}</h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-sm font-bold text-slate-600">
                    <Calendar className="w-4 h-4" /> January 2023
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative pl-12">
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 ${
                      activity.type === 'Mentor' ? 'bg-blue-500' : 
                      activity.type === 'Interest' ? 'bg-orange-500' : 
                      activity.type === 'Quiz' ? 'bg-cyan-500' : 'bg-slate-400'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{activity.time}</p>
                          <h3 className="text-lg font-bold text-slate-900">{activity.title}</h3>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Notes</h3>
            <textarea 
              placeholder="Leave a note..." 
              className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-brand/20 outline-none text-sm resize-none"
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => showToast('Note saved successfully!')}
                className="btn-primary text-xs px-4 py-2"
              >
                Save Note
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <img src="https://picsum.photos/seed/parent/100/100" className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-xs font-bold">Dr. Fadeyibi Aina</p>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-1">3 mins ago</p>
                  <p className="text-xs text-slate-600">Needs to try using Quickchart.io</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Detail Modal */}
      <AnimatePresence>
        {isInterestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInterestModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">Front-end Developer</h3>
                  <button onClick={() => setIsInterestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <img src="https://picsum.photos/seed/coding/800/450" className="w-full rounded-2xl aspect-video object-cover" alt="Coding" />
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Topic of Interest</h4>
                    <div className="flex flex-wrap gap-2">
                      {['HTML', 'CSS', 'Coding', 'Front-end', 'Developer'].map(tag => (
                        <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Top skills</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Physical fitness', 'leadership', 'communication', 'first aid'].map(skill => (
                        <span key={skill} className="px-4 py-2 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold text-center">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">About</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Maxwell's equations—the foundation of classical electromagnetism—describe light as a wave that moves with a characteristic velocity. The modern view is that light needs no medium of transmission, but Maxwell and his contemporaries were convinced that light waves were propagated in a medium, analogous to sound propagating in air, and ripples propagating on the surface of a pond. This hypothetical medium was called the luminiferous aether, at rest relative to the "fixed stars" and through which the Earth moves. Fresnel's partial ether dragging hypothesis ruled out the measurement of first-order (v/c) effects, and although observations of second-order effects (v2/c2) were possible in principle, Maxwell thought they were too small to be detected with then-current technology... <button className="text-brand font-bold">Read more</button>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Mentor</h4>
                    <div className="flex items-center gap-4">
                      <img src="https://picsum.photos/seed/mentor/100/100" className="w-12 h-12 rounded-full object-cover" alt="Mentor" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mason Biyi</p>
                        <p className="text-xs text-slate-500">Full Stack Developer at Techinnover</p>
                      </div>
                    </div>
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
